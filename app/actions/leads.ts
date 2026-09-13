"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { LeadKind, Portal } from "@prisma/client";
import { prisma } from "@/lib/db";
import { recordAudit, requireAdminActor } from "@/lib/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCurrentPortal, type PortalId } from "@/lib/portal";
import {
  sendLeadAnnouncementToCandidate,
  sendLeadAnnouncementToCompany,
} from "@/lib/email";
import { PROVINCIAS_AR } from "@/lib/constants";
import { pickSample, type SampleJob } from "@/lib/leads";

/**
 * Captura de interés sin registro.
 *
 * El problema que resuelve: alguien entra a /empleos, no hay nada publicado,
 * y se va sin dejar rastro. Cuando haya avisos no vamos a tener a quién
 * avisarle. Registrarse con Google y hacer el onboarding entero para decir
 * "avisame" es pedirle demasiado a quien todavía no vio un solo empleo.
 */

type Result = { success: boolean; error?: string };

function fail(error: string): Result {
  return { success: false, error };
}

/**
 * Validación de correo deliberadamente permisiva.
 *
 * No intentamos decidir si la casilla existe —eso solo lo prueba un envío—,
 * solo descartamos lo que seguro no es un correo. Un regex estricto rechaza
 * direcciones válidas y raras, y acá el costo de un falso rechazo es alto:
 * la persona no se anota y no vuelve.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MAX_EMAIL_LENGTH = 254; // RFC 5321

interface SubscribeInput {
  email: string;
  kind: LeadKind;
  province?: string | null;
  wantsRemote?: boolean;
}

/**
 * Anota un correo en la lista de espera del portal del request.
 *
 * Devuelve éxito aunque el correo ya estuviera anotado. Decir "ya estás en la
 * lista" suena a reproche por algo que la persona no hizo mal, y encima
 * filtra quién está anotado a cualquiera que pruebe correos ajenos.
 */
export async function subscribeLead(input: SubscribeInput): Promise<Result> {
  try {
    const email = input.email.trim().toLowerCase();

    if (!email) return fail("Escribí tu correo electrónico");
    if (email.length > MAX_EMAIL_LENGTH)
      return fail("Ese correo es demasiado largo");
    if (!EMAIL_RE.test(email)) {
      return fail("Revisá el correo: parece que le falta algo");
    }

    // Rate limit por IP, no por correo: limitar por correo no frena a nadie
    // —basta con cambiar una letra— y encima castiga a quien se equivoca y
    // reintenta. El header lo pone el proxy de Vercel.
    const requestHeaders = await headers();
    const ip =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "desconocida";

    const limit = checkRateLimit(`lead:${ip}`, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (!limit.success) {
      return fail(
        "Recibimos varios intentos desde acá. Probá de nuevo en un rato."
      );
    }

    // La provincia viene de un <select> nuestro, pero llega por la red: si no
    // está en la lista, la descartamos en vez de guardar basura que después
    // no matchea con ningún aviso.
    // `PROVINCIAS_AR` es un tuple `as const`, así que `includes` solo acepta
    // sus propios literales. Se ensancha a `readonly string[]` para poder
    // preguntar por un valor que llega de afuera, que es justo el punto.
    const provinces: readonly string[] = PROVINCIAS_AR;
    const province =
      input.province && provinces.includes(input.province)
        ? input.province
        : null;

    const portal = await getCurrentPortal();
    const wantsRemote = input.wantsRemote ?? false;

    await prisma.lead.upsert({
      where: {
        email_portal_kind: {
          email,
          portal: portal as Portal,
          kind: input.kind,
        },
      },
      // Reenviar el formulario actualiza la ubicación —quizás se mudó, o la
      // primera vez no la completó— pero NO toca `notifiedAt`: ya recibió lo
      // que recibió, y resetearlo le mandaría la misma noticia dos veces.
      update: { province, wantsRemote },
      create: {
        email,
        portal: portal as Portal,
        kind: input.kind,
        province,
        wantsRemote,
      },
    });

    revalidatePath("/admin/lista");
    return { success: true };
  } catch (error) {
    console.error("subscribeLead:", error);
    return fail("No pudimos guardar tu correo. Probá de nuevo en un momento.");
  }
}

// ─── Envío a la lista, desde /admin/lista ─────────────────────────────────

/**
 * Tamaño de lote.
 *
 * Resend limita la tasa de envío y el runtime serverless limita el tiempo de
 * ejecución. Mandar de a 10 y marcar `notifiedAt` al cerrar cada lote hace
 * que un corte a la mitad sea recuperable: el reintento arranca donde quedó
 * en vez de volver a escribirle a los que ya recibieron.
 */
const BATCH_SIZE = 10;

export interface AnnounceResult extends Result {
  /** Cuántos correos se procesaron efectivamente. */
  sent?: number;
}

/**
 * Avisa a los leads sin notificar de un portal y tipo.
 *
 * A mano, nunca automático al publicar un aviso. Con diez avisos publicados
 * en una semana, el disparo automático son diez correos a la misma persona y
 * el cuarto ya lo clasifica el proveedor como spam — quemando la lista entera
 * justo cuando empieza a servir.
 */
export async function announceToLeads(input: {
  portal: PortalId;
  kind: LeadKind;
}): Promise<AnnounceResult> {
  try {
    const actor = await requireAdminActor();
    const portal = input.portal as Portal;

    // Corte fijado ANTES de empezar. Quien se anote mientras corre el envío
    // no entra en este lote: si entrara, podría quedar marcado como
    // notificado sin que le llegara nada.
    const cutoff = new Date();

    const pendingWhere = {
      portal,
      kind: input.kind,
      notifiedAt: null,
      createdAt: { lte: cutoff },
    } as const;

    const total = await prisma.lead.count({ where: pendingWhere });
    if (total === 0) {
      return fail("No hay nadie sin avisar en ese grupo");
    }

    // El contenido del correo se arma UNA vez y se reusa en todos los lotes:
    // la noticia es la misma para todos, y consultar por persona sería
    // multiplicar queries sin cambiar el resultado.
    const content =
      input.kind === "CANDIDATE"
        ? await buildCandidateContent(portal)
        : await buildCompanyContent(portal);

    if (!content) {
      return fail(
        input.kind === "CANDIDATE"
          ? "Todavía no hay avisos publicados en ese portal: no hay noticia que dar"
          : "Todavía no hay candidatos anotados en ese portal: no hay noticia que dar"
      );
    }

    let sent = 0;

    // Paginado por el propio filtro: cada lote marcado sale del conjunto
    // pendiente, así que siempre pedimos "los 10 que faltan" sin `skip`. Un
    // `skip` creciente saltearía filas al achicarse el conjunto.
    for (;;) {
      const batch = await prisma.lead.findMany({
        where: pendingWhere,
        select: { id: true, email: true, province: true, wantsRemote: true },
        orderBy: { createdAt: "asc" },
        take: BATCH_SIZE,
      });

      if (batch.length === 0) break;

      // Las funciones de correo no lanzan por contrato (ver lib/email.ts),
      // pero `allSettled` deja explícito que un fallo individual no puede
      // abortar el lote ni el envío entero.
      await Promise.allSettled(
        batch.map((lead) =>
          content.kind === "CANDIDATE"
            ? sendLeadAnnouncementToCandidate({
                portal: input.portal,
                to: lead.email,
                totalJobs: content.totalJobs,
                jobs: pickSample(content.jobs, lead.province, lead.wantsRemote),
                province: lead.province,
              })
            : sendLeadAnnouncementToCompany({
                portal: input.portal,
                to: lead.email,
                totalCandidates: content.totalCandidates,
              })
        )
      );

      await prisma.lead.updateMany({
        where: { id: { in: batch.map((lead) => lead.id) } },
        data: { notifiedAt: new Date() },
      });

      sent += batch.length;
    }

    await recordAudit({
      actorId: actor.id,
      action: "lead.announce",
      targetType: "Lead",
      // No hay una fila objetivo: el objetivo es el grupo. Se deja explícito
      // en vez de inventar un id que no apunta a nada.
      targetId: `${input.portal}:${input.kind}`,
      portal: input.portal,
      metadata: {
        sent,
        expected: total,
        cutoff: cutoff.toISOString(),
        kind: input.kind,
      },
    });

    revalidatePath("/admin/lista");
    return { success: true, sent };
  } catch (error) {
    console.error("announceToLeads:", error);
    return fail("No se pudo completar el envío");
  }
}

type CandidateContent = {
  kind: "CANDIDATE";
  totalJobs: number;
  jobs: SampleJob[];
};

type CompanyContent = {
  kind: "COMPANY";
  totalCandidates: number;
};

/**
 * Avisos publicados del portal. Se traen más de tres para poder elegir
 * después los de la provincia de cada persona sin volver a la base.
 */
async function buildCandidateContent(
  portal: Portal
): Promise<CandidateContent | null> {
  const where = {
    portals: { has: portal },
    status: "PUBLISHED",
    moderationStatus: "APPROVED",
  } as const;

  const [totalJobs, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      select: {
        id: true,
        title: true,
        province: true,
        city: true,
        isRemoteFriendly: true,
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
  ]);

  if (totalJobs === 0) return null;
  return { kind: "CANDIDATE", totalJobs, jobs };
}

/** Candidatos del portal: los registrados más los anotados en la lista. */
async function buildCompanyContent(
  portal: Portal
): Promise<CompanyContent | null> {
  const [registered, waiting] = await Promise.all([
    prisma.user.count({ where: { portal, role: "CANDIDATE" } }),
    prisma.lead.count({ where: { portal, kind: "CANDIDATE" } }),
  ]);

  const totalCandidates = registered + waiting;
  if (totalCandidates === 0) return null;
  return { kind: "COMPANY", totalCandidates };
}

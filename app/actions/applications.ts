"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentPortal, publicJobFilter } from "@/lib/portal";
import { threeQuestionsSchema } from "@/lib/validations";
import {
  sendApplicationConfirmation,
  sendContactRequest,
  sendNewApplicationNotification,
} from "@/lib/email";

export async function submitApplication(
  jobId: string,
  answers: {
    did: string;
    canDo: string;
    wantToDo: string;
  }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, error: "No autorizado" };
    }

    // Validamos en el servidor: la validación del cliente es una cortesía
    // de UX, no un control de seguridad.
    const parsed = threeQuestionsSchema.safeParse(answers);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Revisá tus respuestas",
      };
    }
    const validated = parsed.data;

    // Verificar el rol directamente desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        portal: true,
        isActive: true,
        name: true,
        email: true,
      },
    });

    if (!user || user.role !== "CANDIDATE") {
      return { success: false, error: "No autorizado" };
    }

    if (!user.isActive) {
      return { success: false, error: "Tu cuenta está suspendida" };
    }

    // El aviso debe estar publicado, aprobado y pertenecer al portal actual.
    // Sin este filtro, un POST directo permitiría postularse a un aviso del
    // otro portal.
    const portal = await getCurrentPortal();
    const job = await prisma.job.findFirst({
      where: { id: jobId, ...publicJobFilter(portal) },
      select: {
        id: true,
        title: true,
        company: {
          select: {
            name: true,
            owner: { select: { email: true, portal: true } },
          },
        },
      },
    });

    if (!job) {
      return { success: false, error: "Empleo no disponible" };
    }

    // Verificar que no se haya postulado ya
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: session.user.id,
        },
      },
    });

    if (existingApplication) {
      return { success: false, error: "Ya te postulaste a este empleo" };
    }

    // Guardamos perfil y postulación en una transacción: no queremos un
    // perfil actualizado sin la postulación que lo motivó.
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          did: validated.did,
          canDo: validated.canDo,
          wantToDo: validated.wantToDo,
        },
      }),
      prisma.application.create({
        data: {
          jobId,
          userId: session.user.id,
          did: validated.did,
          canDo: validated.canDo,
          wantToDo: validated.wantToDo,
          status: "SUBMITTED",
        },
      }),
    ]);

    // Los mails salen DESPUÉS de la transacción y no pueden hacerla fallar:
    // ninguna de estas funciones lanza. Se esperan igual, porque un
    // serverless puede cortar la ejecución apenas devuelve la respuesta y
    // una promesa suelta se pierde en el aire.
    //
    // Cada persona recibe del portal donde se registró: el candidato del
    // portal actual (que es el suyo, por el filtro de arriba) y la empresa
    // del portal donde abrió su cuenta.
    await Promise.all([
      sendApplicationConfirmation({
        portal: user.portal,
        to: user.email,
        candidateName: user.name,
        jobTitle: job.title,
        companyName: job.company.name,
      }),
      sendNewApplicationNotification({
        portal: job.company.owner.portal,
        to: job.company.owner.email,
        companyName: job.company.name,
        jobTitle: job.title,
        candidateName: user.name,
      }),
    ]);

    revalidatePath(`/empleos/${jobId}`);
    revalidatePath("/postulaciones");

    return { success: true };
  } catch (error) {
    console.error("Error al crear postulación:", error);
    return { success: false, error: "Error al procesar la postulación" };
  }
}

/**
 * Variante pensada para `.bind(null, jobId)` desde un componente servidor.
 * Mantiene la referencia estable a una server action exportada, en vez de
 * crear una closure nueva en cada render.
 */
export async function applyToJob(
  jobId: string,
  answers: { did: string; canDo: string; wantToDo: string }
) {
  return submitApplication(jobId, answers);
}

export async function contactCandidate(applicationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("No autorizado");
  }

  // Verificar el rol directamente desde la base de datos para evitar problemas de caché de sesión
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "COMPANY") {
    throw new Error("Solo las empresas pueden contactar candidatos");
  }

  // Obtener la empresa del usuario
  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
    select: {
      id: true,
      name: true,
      contactPhone: true,
      owner: { select: { email: true } },
    },
  });

  if (!company) {
    throw new Error("No se encontró la empresa");
  }

  // Verificar que la postulación pertenezca a un empleo de la empresa
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      job: { select: { companyId: true, title: true } },
      user: { select: { email: true, name: true, portal: true } },
    },
  });

  if (!application) {
    throw new Error("Postulación no encontrada");
  }

  if (application.job.companyId !== company.id) {
    throw new Error("No tenés permiso para contactar este candidato");
  }

  // Actualizar el estado de la postulación
  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "CONTACTED" },
  });

  // El candidato recibe los datos de contacto que la empresa declaró como
  // responsable en el onboarding, y puede responder el mail directo a la
  // empresa (reply-to). Se manda con la marca del portal del candidato.
  await sendContactRequest({
    portal: application.user.portal,
    to: application.user.email,
    candidateName: application.user.name,
    jobTitle: application.job.title,
    companyName: company.name,
    companyEmail: company.owner.email,
    companyPhone: company.contactPhone,
  });

  // Revalidar la página de empresa para reflejar los cambios
  revalidatePath("/empresa");
}

import "server-only";

import { Resend } from "resend";
import { getPortalConfig, portalBaseUrl, type PortalId } from "@/lib/portal";

/**
 * Emails transaccionales, por Resend.
 *
 * Reglas:
 *
 * - Cada persona recibe correo del portal en el que se registró. Un candidato
 *   de IncluJobs recibe un mail de IncluJobs aunque el aviso también esté en
 *   JubiJobs; una empresa recibe del portal donde abrió su cuenta. Por eso
 *   todas las funciones piden `portal` y no lo adivinan.
 *
 * - Ninguna función lanza. Un mail que no sale se loguea y se sigue: la
 *   postulación ya está guardada, el aviso ya está aprobado. Bloquear la
 *   acción principal porque falló el correo sería castigar al usuario por un
 *   problema nuestro.
 *
 * - Todo texto que escribió una persona —nombres, títulos, motivos— pasa por
 *   `escape()`. Un título de aviso con `<script>` no puede terminar ejecutado
 *   en el cliente de correo de una persona con discapacidad visual.
 *
 * - Una API key por portal, restringida en Resend a su propio dominio:
 *   `RESEND_API_KEY_JUBI` y `RESEND_API_KEY_INCLU`. Si una se filtra, solo
 *   puede mandar desde ese dominio, no desde el otro. Sin la key del portal se
 *   loguea el envío y no se manda nada, así en desarrollo y en previews no hace
 *   falta configurar nada para probar el resto del flujo.
 */

const API_KEY_ENV: Record<PortalId, string> = {
  JUBI: "RESEND_API_KEY_JUBI",
  INCLU: "RESEND_API_KEY_INCLU",
};

const clients = new Map<PortalId, Resend>();

function getClient(portal: PortalId): Resend | null {
  const cached = clients.get(portal);
  if (cached) return cached;

  const apiKey = process.env[API_KEY_ENV[portal]];
  if (!apiKey) return null;

  const client = new Resend(apiKey);
  clients.set(portal, client);
  return client;
}

function escape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Remitente del portal: "JubiJobs <hola@jubijobs.com>".
 *
 * Se usa la casilla de contacto real y no un `no-responder@`. Para esta
 * audiencia, contestar un mail es lo natural, y una respuesta que rebota es
 * una persona que se queda sin saber qué pasó. El dominio tiene que estar
 * verificado en Resend, ver DEPLOY.md.
 */
function sender(portal: PortalId): string {
  const config = getPortalConfig(portal);
  return `${config.name} <${config.contactEmail}>`;
}

interface Layout {
  portal: PortalId;
  heading: string;
  /** Párrafos ya escapados. */
  paragraphs: string[];
  /** Bloque destacado opcional, HTML ya escapado. */
  highlight?: string;
  /** Párrafos después del bloque destacado, ya escapados. */
  closing?: string[];
  cta?: { label: string; href: string };
}

/**
 * Plantilla única. Tipografía grande, contraste alto y un solo botón: el
 * mismo criterio de accesibilidad que el sitio, porque es la misma gente.
 */
function layout({
  portal,
  heading,
  paragraphs,
  highlight,
  closing = [],
  cta,
}: Layout) {
  const config = getPortalConfig(portal);
  const base = portalBaseUrl(portal);
  const color = config.themeColor;

  const paragraph = (p: string) =>
    `<p style="margin:0 0 16px;font-size:18px;line-height:1.5;color:#111827;">${p}</p>`;

  const body = paragraphs.map(paragraph).join("");
  const closingHtml = closing.map(paragraph).join("");

  const highlightHtml = highlight
    ? `<div style="margin:24px 0;padding:20px;border-radius:8px;background:#f3f4f6;font-size:18px;line-height:1.6;color:#111827;">${highlight}</div>`
    : "";

  const ctaHtml = cta
    ? `<p style="margin:28px 0;"><a href="${cta.href}" style="display:inline-block;padding:16px 28px;border-radius:8px;background:${color};color:#ffffff;font-size:18px;font-weight:700;text-decoration:none;">${cta.label}</a></p>`
    : "";

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
      <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:${color};">${config.name}</p>
      <h1 style="margin:0 0 20px;font-size:26px;line-height:1.3;color:#111827;">${heading}</h1>
      ${body}
      ${highlightHtml}
      ${closingHtml}
      ${ctaHtml}
      <hr style="border:0;border-top:1px solid #e5e7eb;margin:32px 0;">
      <p style="margin:0;font-size:15px;line-height:1.5;color:#6b7280;">
        ${config.name} · ${escape(config.audience)}<br>
        <a href="${base}" style="color:${color};">${config.domain}</a>
      </p>
    </div>
  </body>
</html>`;
}

async function send(input: {
  portal: PortalId;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const resend = getClient(input.portal);

  if (!resend) {
    console.log(`[email] ${API_KEY_ENV[input.portal]} ausente, no se envía:`, {
      to: input.to,
      subject: input.subject,
    });
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: sender(input.portal),
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
    });

    if (error) {
      console.error("[email] Resend rechazó el envío:", {
        to: input.to,
        subject: input.subject,
        error,
      });
    }
  } catch (error) {
    console.error("[email] Falló el envío:", {
      to: input.to,
      subject: input.subject,
      error,
    });
  }
}

// ─── Candidato ────────────────────────────────────────────────────────────

/** Al candidato, apenas se postula. */
export async function sendApplicationConfirmation(input: {
  portal: PortalId;
  to: string;
  candidateName: string | null;
  jobTitle: string;
  companyName: string;
}) {
  const name = escape(input.candidateName?.trim() || "Hola");
  const jobTitle = escape(input.jobTitle);
  const companyName = escape(input.companyName);

  await send({
    portal: input.portal,
    to: input.to,
    subject: `Tu postulación a ${input.jobTitle} quedó enviada`,
    html: layout({
      portal: input.portal,
      heading: "Tu postulación quedó enviada",
      paragraphs: [
        `${name},`,
        `Tu postulación para <strong>${jobTitle}</strong> en <strong>${companyName}</strong> fue recibida.`,
        `La empresa va a leer tus tres respuestas. Si le interesa tu perfil, te va a escribir o llamar con los datos que dejaste en tu cuenta. Te avisamos por acá cuando eso pase.`,
      ],
      cta: {
        label: "Ver mis postulaciones",
        href: `${portalBaseUrl(input.portal)}/postulaciones`,
      },
    }),
  });
}

/** Al candidato, cuando la empresa pide contactarlo. */
export async function sendContactRequest(input: {
  portal: PortalId;
  to: string;
  candidateName: string | null;
  jobTitle: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string | null;
}) {
  const name = escape(input.candidateName?.trim() || "Hola");
  const jobTitle = escape(input.jobTitle);
  const companyName = escape(input.companyName);
  const companyEmail = escape(input.companyEmail);
  const companyPhone = input.companyPhone ? escape(input.companyPhone) : null;

  const contact = [
    `<strong>Empresa:</strong> ${companyName}`,
    `<strong>Email:</strong> <a href="mailto:${companyEmail}">${companyEmail}</a>`,
    companyPhone
      ? `<strong>Teléfono:</strong> <a href="tel:${companyPhone.replace(/\s/g, "")}">${companyPhone}</a>`
      : null,
  ]
    .filter(Boolean)
    .join("<br>");

  await send({
    portal: input.portal,
    to: input.to,
    // Responder este mail le escribe a la empresa, no a nosotros.
    replyTo: input.companyEmail,
    subject: `${input.companyName} quiere contactarte por ${input.jobTitle}`,
    html: layout({
      portal: input.portal,
      heading: "Buenas noticias",
      paragraphs: [
        `${name},`,
        `<strong>${companyName}</strong> leyó tu postulación para <strong>${jobTitle}</strong> y quiere hablar con vos.`,
        `Podés responder este mismo correo o comunicarte directamente:`,
      ],
      highlight: contact,
      cta: {
        label: "Ver mis postulaciones",
        href: `${portalBaseUrl(input.portal)}/postulaciones`,
      },
    }),
  });
}

// ─── Empresa ──────────────────────────────────────────────────────────────

/** A la empresa, cuando alguien se postula a uno de sus avisos. */
export async function sendNewApplicationNotification(input: {
  portal: PortalId;
  to: string;
  companyName: string;
  jobTitle: string;
  candidateName: string | null;
}) {
  const companyName = escape(input.companyName);
  const jobTitle = escape(input.jobTitle);
  const candidateName = escape(input.candidateName?.trim() || "Una persona");

  await send({
    portal: input.portal,
    to: input.to,
    subject: `Nueva postulación para ${input.jobTitle}`,
    html: layout({
      portal: input.portal,
      heading: "Recibiste una postulación",
      paragraphs: [
        `Hola, ${companyName}.`,
        `<strong>${candidateName}</strong> se postuló para <strong>${jobTitle}</strong>.`,
        `Entrá al panel para leer sus tres respuestas y, si te interesa, contactarla.`,
      ],
      cta: {
        label: "Ver la postulación",
        href: `${portalBaseUrl(input.portal)}/empresa`,
      },
    }),
  });
}

/** A la empresa, cuando moderación aprueba su aviso. */
export async function sendJobApproved(input: {
  portal: PortalId;
  to: string;
  companyName: string;
  jobTitle: string;
  jobId: string;
}) {
  const companyName = escape(input.companyName);
  const jobTitle = escape(input.jobTitle);

  await send({
    portal: input.portal,
    to: input.to,
    subject: `Tu aviso ${input.jobTitle} ya está publicado`,
    html: layout({
      portal: input.portal,
      heading: "Tu aviso ya está publicado",
      paragraphs: [
        `Hola, ${companyName}.`,
        `Revisamos <strong>${jobTitle}</strong> y ya está visible para los candidatos.`,
        `Te vamos a avisar por correo cada vez que alguien se postule.`,
      ],
      cta: {
        label: "Ver el aviso",
        href: `${portalBaseUrl(input.portal)}/empleos/${input.jobId}`,
      },
    }),
  });
}

// ─── Lista de espera ──────────────────────────────────────────────────────

/**
 * Aviso a quien dejó su correo sin registrarse.
 *
 * Lo dispara un admin a mano desde /admin/lista, nunca la publicación de un
 * aviso: con diez avisos en una semana serían diez correos a la misma
 * persona, y el cuarto ya cae en spam.
 *
 * El asunto lleva la noticia completa —"Ya hay 12 empleos publicados"— y no
 * un "Novedades de JubiJobs" que no dice nada. Quien recibe decide si abre
 * leyendo esa línea; si no dice qué pasó, no abre.
 */
export async function sendLeadAnnouncementToCandidate(input: {
  portal: PortalId;
  to: string;
  /** Total publicado en el portal, no el largo de la muestra. */
  totalJobs: number;
  jobs: Array<{
    id: string;
    title: string;
    province: string;
    city: string | null;
  }>;
  /** Provincia que dejó la persona, si dejó alguna. */
  province: string | null;
}) {
  const config = getPortalConfig(input.portal);
  const base = portalBaseUrl(input.portal);
  const plural = input.totalJobs === 1;

  const subject = plural
    ? `Ya hay un empleo publicado en ${config.name}`
    : `Ya hay ${input.totalJobs} empleos publicados en ${config.name}`;

  const list = input.jobs
    .map((job) => {
      const title = escape(job.title);
      const place = escape(
        job.city ? `${job.city}, ${job.province}` : job.province
      );
      return `<a href="${base}/empleos/${job.id}" style="color:${config.themeColor};font-weight:700;text-decoration:none;">${title}</a><br><span style="color:#4b5563;">${place}</span>`;
    })
    .join("<br><br>");

  // Si pidió una provincia y ninguna de las muestras es de ahí, se dice.
  // Mostrar tres avisos de la otra punta del país como si fueran para ella
  // es peor que no mandar nada: la próxima vez no abre el correo.
  const fromHerProvince =
    input.province !== null &&
    input.jobs.some((job) => job.province === input.province);

  const intro =
    input.province && !fromHerProvince
      ? `Por ahora no hay nada publicado en ${escape(input.province)}. Te dejamos lo último que se sumó, por si algo te sirve:`
      : `Te dejamos algunos para que veas:`;

  // La búsqueda del botón arranca filtrada por su provincia cuando hay algo
  // ahí: llegar a una lista ya acotada evita el trabajo de filtrar a mano.
  const searchHref =
    input.province && fromHerProvince
      ? `${base}/empleos?provincia=${encodeURIComponent(input.province)}`
      : `${base}/empleos`;

  await send({
    portal: input.portal,
    to: input.to,
    subject,
    html: layout({
      portal: input.portal,
      heading: plural
        ? "Ya hay un empleo publicado"
        : `Ya hay ${input.totalJobs} empleos publicados`,
      paragraphs: [
        `Nos dejaste tu correo para que te avisáramos cuando hubiera trabajo. Ya hay.`,
        intro,
      ],
      highlight: list,
      closing: [
        `Para postularte vas a necesitar una cuenta: son tres preguntas y listo, sin currículum.`,
      ],
      cta: { label: "Ver los empleos", href: searchHref },
    }),
  });
}

/**
 * Aviso a la empresa que dejó su correo. Argumento invertido: a ella no le
 * interesan los avisos publicados sino cuánta gente hay esperando leerlos.
 */
export async function sendLeadAnnouncementToCompany(input: {
  portal: PortalId;
  to: string;
  totalCandidates: number;
}) {
  const config = getPortalConfig(input.portal);
  const single = input.totalCandidates === 1;

  const subject = single
    ? `Hay una persona buscando trabajo en ${config.name}`
    : `Hay ${input.totalCandidates} personas buscando trabajo en ${config.name}`;

  await send({
    portal: input.portal,
    to: input.to,
    subject,
    html: layout({
      portal: input.portal,
      heading: single
        ? "Hay una persona esperando tu aviso"
        : `Hay ${input.totalCandidates} personas esperando tu aviso`,
      paragraphs: [
        `Nos dejaste tu correo para saber cuándo valía la pena publicar.`,
        single
          ? `Hoy hay <strong>una persona</strong> anotada en ${escape(config.name)} buscando trabajo: ${escape(config.audience.toLowerCase())}.`
          : `Hoy hay <strong>${input.totalCandidates} personas</strong> anotadas en ${escape(config.name)} buscando trabajo: ${escape(config.audience.toLowerCase())}.`,
        `Publicar es gratis y lleva unos minutos. Cada aviso pasa por moderación antes de salir.`,
      ],
      cta: {
        label: "Publicar un empleo",
        href: `${portalBaseUrl(input.portal)}/empresas`,
      },
    }),
  });
}

/** A la empresa, cuando moderación rechaza su aviso. Siempre con el motivo. */
export async function sendJobRejected(input: {
  portal: PortalId;
  to: string;
  companyName: string;
  jobTitle: string;
  reason: string;
}) {
  const companyName = escape(input.companyName);
  const jobTitle = escape(input.jobTitle);
  const reason = escape(input.reason);
  const config = getPortalConfig(input.portal);

  await send({
    portal: input.portal,
    to: input.to,
    subject: `No pudimos publicar tu aviso ${input.jobTitle}`,
    html: layout({
      portal: input.portal,
      heading: "No pudimos publicar tu aviso",
      paragraphs: [
        `Hola, ${companyName}.`,
        `Revisamos <strong>${jobTitle}</strong> y por ahora no lo publicamos. El motivo:`,
      ],
      highlight: reason,
      closing: [
        `Si tenés dudas sobre el motivo, escribinos a <a href="mailto:${config.contactEmail}" style="color:${config.themeColor};">${config.contactEmail}</a>.`,
      ],
      cta: {
        label: "Ir a mi panel",
        href: `${portalBaseUrl(input.portal)}/empresa`,
      },
    }),
  });
}

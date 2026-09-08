import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { formatCurrency, formatDate } from "@/lib/constants";
import { notFound } from "next/navigation";
import {
  getCurrentPortal,
  getCurrentPortalConfig,
  publicJobFilter,
} from "@/lib/portal";
import { ThreeQuestionsForm } from "@/components/forms/ThreeQuestionsForm";
import { LineIcon } from "@/components/ui/LineIcon";
import { applyToJob } from "@/app/actions/applications";

const MODALITY_LABELS: Record<string, string> = {
  PRESENCIAL: "Presencial",
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
};

const SCHEDULE_LABELS: Record<string, string> = {
  PART_TIME: "Part-time",
  FLEX: "Flexible",
  POR_DIA: "Por día",
};

/**
 * Busca un aviso visible EN ESTE PORTAL. Un aviso de IncluJobs no debe ser
 * accesible desde jubijobs.com ni con la URL directa.
 */
async function findVisibleJob(id: string) {
  const portal = await getCurrentPortal();
  return prisma.job.findFirst({
    where: { id, ...publicJobFilter(portal) },
    include: { company: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [job, portal] = await Promise.all([
    findVisibleJob(id),
    getCurrentPortalConfig(),
  ]);

  if (!job) return { title: "Empleo no encontrado" };

  return {
    title: `${job.title} — ${job.company.name}`,
    description: job.description.slice(0, 160),
    openGraph: {
      title: `${job.title} — ${job.company.name}`,
      description: job.description.slice(0, 160),
      siteName: portal.name,
      type: "article",
    },
  };
}

export default async function EmpleoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await findVisibleJob(id);

  if (!job) notFound();

  const session = await auth.api.getSession({ headers: await headers() });

  let hasApplied = false;
  let user: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;
  let isCandidate = false;

  if (session) {
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
    isCandidate = user?.role === "CANDIDATE";

    if (isCandidate) {
      const application = await prisma.application.findUnique({
        where: { jobId_userId: { jobId: id, userId: session.user.id } },
      });
      hasApplied = !!application;
    }
  }

  const hasAccessibilityInfo =
    job.hasAccessibleSite ||
    job.supportsFlexHours ||
    job.isRemoteFriendly ||
    Boolean(job.accessibilityNotes);

  const salary =
    job.salaryArsMin && job.salaryArsMax
      ? `${formatCurrency(job.salaryArsMin)} a ${formatCurrency(job.salaryArsMax)}`
      : job.salaryArsMin
        ? `Desde ${formatCurrency(job.salaryArsMin)}`
        : "A convenir";

  return (
    <div className="bg-paper">
      {/* Encabezado sobre superficie clara: separa el "qué es este puesto"
          del "de qué se trata". */}
      <header className="border-b border-rule bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <nav aria-label="Volver" className="mb-6">
            <Link
              href="/empleos"
              className="text-base text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Volver a los empleos
            </Link>
          </nav>

          <p className="text-lg text-ink-soft">{job.company.name}</p>
          <h1 className="mt-1 text-3xl md:text-4xl">{job.title}</h1>

          {/* Los datos en grilla, sin repetir la etiqueta en cada línea:
              el encabezado de la definición ya dice qué es cada cosa. */}
          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-rule pt-6 sm:grid-cols-4">
            <div>
              <dt className="text-base text-ink-soft">Ubicación</dt>
              <dd className="mt-0.5 text-lg font-medium">
                {job.city ? `${job.city}, ${job.province}` : job.province}
              </dd>
            </div>
            <div>
              <dt className="text-base text-ink-soft">Modalidad</dt>
              <dd className="mt-0.5 text-lg font-medium">
                {MODALITY_LABELS[job.modality]}
              </dd>
            </div>
            <div>
              <dt className="text-base text-ink-soft">Jornada</dt>
              <dd className="mt-0.5 text-lg font-medium">
                {SCHEDULE_LABELS[job.schedule]}
              </dd>
            </div>
            <div>
              <dt className="text-base text-ink-soft">Salario</dt>
              <dd className="mt-0.5 text-lg font-semibold text-primary-700 dark:text-primary-200">
                {salary}
              </dd>
            </div>
          </dl>

          {job.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-sm border border-rule px-2.5 py-1 text-sm text-ink-soft"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-base text-ink-soft">
            Publicado el {formatDate(job.createdAt)}
          </p>
        </div>
      </header>

      <div className="band-major mx-auto max-w-5xl px-6">
        <article>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl">Descripción del puesto</h2>
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-ink-soft">
              {job.description}
            </div>
          </section>

          {hasAccessibilityInfo && (
            <section
              aria-labelledby="accesibilidad-puesto"
              className="mb-12 rounded-lg border-2 border-primary-200 bg-primary-50 p-6 dark:border-primary-800 dark:bg-primary-950"
            >
              <h2 id="accesibilidad-puesto" className="mb-4 text-2xl">
                Condiciones de accesibilidad
              </h2>
              {/* Iconos de trazo en vez del "✓" de texto: el glifo cambia de
                  forma y de peso según la fuente del sistema, y en Atkinson no
                  existe con el mismo trazo. LineIcon hereda el color de marca y
                  el grosor de la familia. */}
              <ul className="space-y-3 text-lg text-ink">
                {job.hasAccessibleSite && (
                  <li className="flex items-start gap-3">
                    <span className="mt-1 shrink-0 text-primary-700 dark:text-primary-200">
                      <LineIcon name="check" size={22} strokeWidth={2.2} />
                    </span>
                    <span>
                      Instalaciones adaptadas (acceso, ascensor y baño
                      accesible)
                    </span>
                  </li>
                )}
                {job.supportsFlexHours && (
                  <li className="flex items-start gap-3">
                    <span className="mt-1 shrink-0 text-primary-700 dark:text-primary-200">
                      <LineIcon name="check" size={22} strokeWidth={2.2} />
                    </span>
                    <span>
                      Horarios flexibles, ajustables según tus necesidades
                    </span>
                  </li>
                )}
                {job.isRemoteFriendly && (
                  <li className="flex items-start gap-3">
                    <span className="mt-1 shrink-0 text-primary-700 dark:text-primary-200">
                      <LineIcon name="check" size={22} strokeWidth={2.2} />
                    </span>
                    <span>Se puede trabajar de forma remota</span>
                  </li>
                )}
              </ul>
              {job.accessibilityNotes && (
                <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-ink-soft">
                  {job.accessibilityNotes}
                </p>
              )}
            </section>
          )}

          {job.company.about && (
            <section className="mb-12 rounded-lg bg-paper p-6 transition-colors">
              <h2 className="mb-4 text-2xl">Sobre {job.company.name}</h2>
              <p className="text-lg text-ink-soft">{job.company.about}</p>
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-lg font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Visitar sitio web →
                </a>
              )}
            </section>
          )}

          {isCandidate && !hasApplied && (
            <section className="rounded-lg border-2 border-primary-300 bg-primary-50 p-8 transition-colors dark:border-primary-700 dark:bg-primary-950">
              <h2 className="mb-6 text-2xl md:text-3xl">
                Postularme (3 preguntas)
              </h2>
              <ThreeQuestionsForm
                initialValues={{
                  did: user?.did || "",
                  canDo: user?.canDo || "",
                  wantToDo: user?.wantToDo || "",
                }}
                action={applyToJob.bind(null, id)}
                submitLabel="Enviar postulación"
              />
            </section>
          )}

          {/* Confirmación de postulación. El énfasis lo da la jerarquía
              —icono, título, cuerpo— en vez de apilar borde de 4px, gradiente,
              sombra y un emoji de 60px como antes. El verde sale de `success`,
              que está en la escala de tokens. `role="status"` para que un lector
              de pantalla anuncie el resultado sin mover el foco. */}
          {hasApplied && (
            <div
              role="status"
              className="surface-raised rounded-lg border-success-500/40 p-8 text-center sm:p-10"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300">
                <LineIcon name="check" size={30} strokeWidth={2.4} />
              </span>
              <h2 className="mt-5 text-2xl md:text-3xl">
                Tu postulación quedó enviada
              </h2>
              <p className="mx-auto mt-3 max-w-measure text-lg text-ink-soft">
                La empresa va a leer tu perfil y las tres respuestas que
                mandaste. Te avisamos por email si hay novedades.
              </p>
              <a
                href="/postulaciones"
                className="press mt-7 inline-flex min-h-[56px] items-center justify-center rounded-md bg-primary-600 px-8 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Ver mis postulaciones
              </a>
            </div>
          )}

          {!session && (
            <div className="rounded-lg border-2 border-primary-300 bg-primary-50 p-8 text-center transition-colors dark:border-primary-700 dark:bg-primary-950">
              <p className="mb-4 text-2xl">Para postularte, ingresá primero</p>
              <a
                href="/ingresar"
                className="press inline-flex min-h-[56px] items-center justify-center rounded-md bg-primary-600 px-8 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Ingresar
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

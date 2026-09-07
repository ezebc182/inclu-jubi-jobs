import type { Metadata } from "next";
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
 * Busca un aviso visible EN ESTE PORTAL. Un aviso de InclúJobs no debe ser
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 transition-colors dark:bg-gray-900">
      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            {job.title}
          </h1>
          <div className="flex flex-col gap-3 text-lg text-gray-700 dark:text-gray-300">
            <div>
              <strong>Empresa:</strong> {job.company.name}
            </div>
            <div>
              <strong>Ubicación:</strong>{" "}
              {job.city ? `${job.city}, ${job.province}` : job.province}
            </div>
            <div>
              <strong>Modalidad:</strong> {MODALITY_LABELS[job.modality]}
            </div>
            <div>
              <strong>Jornada:</strong> {SCHEDULE_LABELS[job.schedule]}
            </div>
            {job.salaryArsMin && job.salaryArsMax && (
              <div>
                <strong>Salario:</strong> {formatCurrency(job.salaryArsMin)} -{" "}
                {formatCurrency(job.salaryArsMax)}
              </div>
            )}
            <div className="text-base text-gray-600 dark:text-gray-400">
              Publicado el {formatDate(job.createdAt)}
            </div>
          </div>

          {job.tags && job.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="dark:bg-primary-950 rounded-full bg-primary-100 px-4 py-2 text-base font-semibold text-primary-700 dark:text-primary-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Descripción del puesto
          </h2>
          <div className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {job.description}
          </div>
        </section>

        {hasAccessibilityInfo && (
          <section
            aria-labelledby="accesibilidad-puesto"
            className="dark:bg-primary-950 mb-12 rounded-lg border-2 border-primary-200 bg-primary-50 p-6 dark:border-primary-800"
          >
            <h2
              id="accesibilidad-puesto"
              className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              Condiciones de accesibilidad
            </h2>
            <ul className="space-y-3 text-lg text-gray-800 dark:text-gray-200">
              {job.hasAccessibleSite && (
                <li className="flex items-start gap-3">
                  <span aria-hidden="true">✓</span>
                  <span>
                    Instalaciones adaptadas (acceso, ascensor y baño accesible)
                  </span>
                </li>
              )}
              {job.supportsFlexHours && (
                <li className="flex items-start gap-3">
                  <span aria-hidden="true">✓</span>
                  <span>
                    Horarios flexibles, ajustables según tus necesidades
                  </span>
                </li>
              )}
              {job.isRemoteFriendly && (
                <li className="flex items-start gap-3">
                  <span aria-hidden="true">✓</span>
                  <span>Se puede trabajar de forma remota</span>
                </li>
              )}
            </ul>
            {job.accessibilityNotes && (
              <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {job.accessibilityNotes}
              </p>
            )}
          </section>
        )}

        {job.company.about && (
          <section className="mb-12 rounded-lg bg-gray-50 p-6 transition-colors dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Sobre {job.company.name}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {job.company.about}
            </p>
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
          <section className="dark:bg-primary-950 rounded-lg border-2 border-primary-300 bg-primary-50 p-8 transition-colors dark:border-primary-700">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
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

        {hasApplied && (
          <div className="rounded-xl border-4 border-green-400 bg-gradient-to-b from-green-50 to-green-100 p-10 text-center shadow-lg transition-colors dark:border-green-600 dark:from-green-950 dark:to-green-900">
            <div className="mb-4 text-6xl" aria-hidden="true">
              ✅
            </div>
            <p className="mb-4 text-3xl font-bold text-green-900 dark:text-green-200">
              ¡Postulación enviada exitosamente!
            </p>
            <p className="mb-2 text-xl text-green-800 dark:text-green-300">
              La empresa va a revisar tu perfil y las 3 respuestas que enviaste.
            </p>
            <p className="mb-6 text-lg text-green-700 dark:text-green-400">
              Te vamos a notificar por email si hay novedades.
            </p>
            <a
              href="/postulaciones"
              className="inline-flex min-h-[56px] items-center justify-center rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Ver todas mis postulaciones
            </a>
          </div>
        )}

        {!session && (
          <div className="dark:bg-primary-950 rounded-lg border-2 border-primary-300 bg-primary-50 p-8 text-center transition-colors dark:border-primary-700">
            <p className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Para postularte, ingresá primero
            </p>
            <a
              href="/ingresar"
              className="inline-block rounded-lg bg-primary-600 px-8 py-4 text-xl font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Ingresar
            </a>
          </div>
        )}
      </article>
    </div>
  );
}

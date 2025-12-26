import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { formatCurrency, formatDate } from "@/lib/constants";
import { notFound, redirect } from "next/navigation";
import { ThreeQuestionsForm } from "@/components/forms/ThreeQuestionsForm";
import { submitApplication } from "@/app/actions/applications";

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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!job) {
    return {
      title: "Empleo no encontrado - JubiJobs",
    };
  }

  return {
    title: `${job.title} - ${job.company.name} - JubiJobs`,
    description: job.description.substring(0, 160),
  };
}

export default async function EmpleoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!job || job.status !== "PUBLISHED") notFound();

  const session = await auth.api.getSession({ headers: await headers() });

  let hasApplied = false;
  let user: any = null;
  let isCandidate = false;

  if (session) {
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
    isCandidate = user?.role === "CANDIDATE";

    if (isCandidate) {
      const application = await prisma.application.findUnique({
        where: {
          jobId_userId: {
            jobId: id,
            userId: session.user.id,
          },
        },
      });
      hasApplied = !!application;
    }
  }

  const handleSubmit = async (answers: {
    did: string;
    canDo: string;
    wantToDo: string;
  }) => {
    "use server";
    const result = await submitApplication(id, answers);
    if (result.success) {
      redirect(`/empleos/${id}?applied=true`);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 transition-colors dark:bg-gray-900">
      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">{job.title}</h1>
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
                  className="rounded-full bg-primary-100 px-4 py-2 text-base font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300"
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

        {job.company.about && (
          <section className="mb-12 rounded-lg bg-gray-50 p-6 transition-colors dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Sobre {job.company.name}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">{job.company.about}</p>
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
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
              Postularme (3 preguntas)
            </h2>
            <ThreeQuestionsForm
              initialValues={{
                did: user?.did || "",
                canDo: user?.canDo || "",
                wantToDo: user?.wantToDo || "",
              }}
              onSubmit={handleSubmit}
              submitLabel="Enviar postulación"
            />
          </section>
        )}

        {hasApplied && (
          <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6 text-center transition-colors dark:border-green-700 dark:bg-green-950">
            <p className="text-2xl font-bold text-green-800 dark:text-green-300">
              ✓ Ya te postulaste a este empleo
            </p>
            <p className="mt-2 text-lg text-green-700 dark:text-green-400">
              Revisá el estado en{" "}
              <a href="/postulaciones" className="font-semibold underline">
                Mis postulaciones
              </a>
            </p>
          </div>
        )}

        {!session && (
          <div className="rounded-lg border-2 border-primary-300 bg-primary-50 p-8 text-center transition-colors dark:border-primary-700 dark:bg-primary-950">
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

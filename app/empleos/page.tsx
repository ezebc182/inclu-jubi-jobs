import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getCurrentPortal,
  getCurrentPortalConfig,
  publicJobFilter,
} from "@/lib/portal";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { SavedSearches } from "@/components/jobs/SavedSearches";
import { EmptyState } from "@/components/ui/EmptyState";

export async function generateMetadata(): Promise<Metadata> {
  const portal = await getCurrentPortalConfig();
  return {
    title: "Empleos disponibles",
    description: `Empleos en Argentina para ${portal.audience.toLowerCase()}. Trabajos flexibles, part-time y por día.`,
  };
}

export default async function EmpleosPage({
  searchParams,
}: {
  searchParams: Promise<{
    provincia?: string;
    modalidad?: string;
    jornada?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const portal = await getCurrentPortal();

  // El filtro de portal es innegociable: un candidato solo ve avisos de SU
  // portal, publicados y aprobados por moderación.
  const where: Prisma.JobWhereInput = { ...publicJobFilter(portal) };

  if (params.provincia) where.province = params.provincia;
  if (params.modalidad)
    where.modality = params.modalidad as Prisma.JobWhereInput["modality"];
  if (params.jornada)
    where.schedule = params.jornada as Prisma.JobWhereInput["schedule"];
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { tags: { hasSome: [params.q] } },
    ];
  }

  const jobs = await prisma.job.findMany({
    where,
    include: { company: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Búsquedas guardadas del usuario, acotadas también a este portal.
  const session = await auth.api.getSession({ headers: await headers() });
  let savedSearches: Awaited<ReturnType<typeof prisma.savedSearch.findMany>> =
    [];

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role === "CANDIDATE") {
      savedSearches = await prisma.savedSearch.findMany({
        where: { userId: session.user.id, portal },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 transition-colors dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
          Empleos disponibles
        </h1>
        <p className="mb-12 text-xl text-gray-700 dark:text-gray-300">
          {jobs.length}{" "}
          {jobs.length === 1 ? "empleo encontrado" : "empleos encontrados"}
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="flex flex-col gap-6">
              <JobFilters />
              {session && savedSearches && (
                <SavedSearches
                  searches={savedSearches}
                  currentFilters={{
                    province: params.provincia,
                    modality: params.modalidad,
                    schedule: params.jornada,
                  }}
                />
              )}
            </div>
          </aside>

          <main className="lg:col-span-3">
            {jobs.length === 0 ? (
              <EmptyState
                title="No se encontraron empleos"
                description="Probá ajustando los filtros o buscando otras palabras clave."
                actionLabel="Ver todos los empleos"
                actionHref="/empleos"
              />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company={job.company.name}
                    province={job.province}
                    city={job.city}
                    modality={job.modality}
                    schedule={job.schedule}
                    salaryArsMin={job.salaryArsMin}
                    salaryArsMax={job.salaryArsMax}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

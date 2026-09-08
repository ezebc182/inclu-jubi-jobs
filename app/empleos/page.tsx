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

  const hasFilters = Boolean(
    params.provincia || params.modalidad || params.jornada || params.q
  );

  return (
    <div className="bg-paper">
      <header className="border-b border-rule bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl md:text-4xl">Empleos disponibles</h1>
          <p className="mt-3 text-lg text-ink-soft" role="status">
            {jobs.length === 0
              ? "Ningún aviso coincide con tu búsqueda"
              : `${jobs.length} ${jobs.length === 1 ? "aviso" : "avisos"}${
                  hasFilters ? " con los filtros aplicados" : " publicados"
                }`}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="flex flex-col gap-6 lg:sticky lg:top-24">
              <JobFilters />
              {session && savedSearches.length > 0 && (
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

          <main className="lg:col-span-9">
            {jobs.length === 0 ? (
              /* Dos situaciones distintas que antes daban el mismo mensaje.
                 Sin filtros no hay nada que quitar, y "Ver todos los empleos"
                 devolvia a la misma pagina vacia: un callejon sin salida. */
              hasFilters ? (
                <EmptyState
                  icon="route"
                  title="Ningún empleo coincide con esa búsqueda"
                  description="Probá con menos filtros, o mirá todo lo que hay publicado."
                  actionLabel="Ver todos los empleos"
                  actionHref="/empleos"
                />
              ) : (
                <EmptyState
                  icon="clock"
                  title="Todavía no hay empleos publicados"
                  description="Estamos sumando empresas. Dejanos tu contacto y te avisamos apenas se publique el primero."
                  actionLabel="Quiero que me avisen"
                  actionHref="/ingresar"
                  secondaryLabel="Cómo funciona"
                  secondaryHref="/como-funciona"
                />
              )
            ) : (
              /* Grilla a hueco de 1px: las tarjetas comparten borde en vez
                 de flotar cada una con su sombra. Lee como un listado, que
                 es lo que es. */
              <ul className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <JobCard
                      id={job.id}
                      title={job.title}
                      company={job.company.name}
                      province={job.province}
                      city={job.city}
                      modality={job.modality}
                      schedule={job.schedule}
                      salaryArsMin={job.salaryArsMin}
                      salaryArsMax={job.salaryArsMax}
                      hasAccessibleSite={job.hasAccessibleSite}
                      supportsFlexHours={job.supportsFlexHours}
                      isRemoteFriendly={job.isRemoteFriendly}
                    />
                  </li>
                ))}
              </ul>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

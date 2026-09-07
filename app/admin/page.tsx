import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { allPortals, type PortalId } from "@/lib/portal";

/** Métricas por portal: sin desagregar, un número global no dice nada. */
async function loadStats() {
  const portalIds: PortalId[] = ["JUBI", "INCLU"];

  const [
    pendingJobs,
    totalCompanies,
    unverifiedCompanies,
    applications,
    perPortal,
  ] = await Promise.all([
    prisma.job.count({ where: { moderationStatus: "PENDING" } }),
    prisma.company.count(),
    prisma.company.count({ where: { isVerified: false } }),
    prisma.application.count(),
    Promise.all(
      portalIds.map(async (portal) => {
        const [candidates, publishedJobs] = await Promise.all([
          prisma.user.count({ where: { portal, role: "CANDIDATE" } }),
          prisma.job.count({
            where: {
              portals: { has: portal },
              status: "PUBLISHED",
              moderationStatus: "APPROVED",
            },
          }),
        ]);
        return { portal, candidates, publishedJobs };
      })
    ),
  ]);

  return {
    pendingJobs,
    totalCompanies,
    unverifiedCompanies,
    applications,
    perPortal,
  };
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <dt className="text-base font-medium text-gray-600 dark:text-gray-400">
        {label}
      </dt>
      <dd className="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
        {value.toLocaleString("es-AR")}
      </dd>
      {hint && (
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await loadStats();
  const portals = allPortals();

  return (
    <div className="flex flex-col gap-10">
      {stats.pendingJobs > 0 && (
        <div
          role="status"
          className="dark:bg-secondary-950 rounded-lg border-2 border-secondary-500 bg-secondary-50 p-6 dark:border-secondary-400"
        >
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {stats.pendingJobs}{" "}
            {stats.pendingJobs === 1 ? "aviso espera" : "avisos esperan"}{" "}
            moderación
          </p>
          <Link
            href="/admin/moderacion"
            className="mt-3 inline-flex min-h-[48px] items-center rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
          >
            Revisar ahora
          </Link>
        </div>
      )}

      <section aria-labelledby="totales">
        <h2
          id="totales"
          className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          Totales
        </h2>
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Avisos pendientes" value={stats.pendingJobs} />
          <StatCard label="Empresas" value={stats.totalCompanies} />
          <StatCard
            label="Sin verificar"
            value={stats.unverifiedCompanies}
            hint="Sus avisos pasan por moderación"
          />
          <StatCard label="Postulaciones" value={stats.applications} />
        </dl>
      </section>

      <section aria-labelledby="por-portal">
        <h2
          id="por-portal"
          className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          Por portal
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {stats.perPortal.map((row) => {
            const config = portals.find((p) => p.id === row.portal)!;
            return (
              <article
                key={row.portal}
                className="rounded-xl border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {config.name}
                </h3>
                <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
                  {config.audience} · {config.domain}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-base text-gray-600 dark:text-gray-400">
                      Candidatos
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {row.candidates.toLocaleString("es-AR")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-base text-gray-600 dark:text-gray-400">
                      Avisos publicados
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {row.publishedJobs.toLocaleString("es-AR")}
                    </dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

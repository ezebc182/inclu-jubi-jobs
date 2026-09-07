import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { getPortalConfig } from "@/lib/portal";
import { formatCurrency, formatDate } from "@/lib/constants";
import { ModerationActions } from "@/components/admin/ModerationActions";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function ModeracionPage() {
  await requireAdmin();

  const jobs = await prisma.job.findMany({
    where: { moderationStatus: "PENDING" },
    include: { company: { select: { id: true, name: true, isVerified: true } } },
    orderBy: { createdAt: "asc" }, // Los más viejos primero: nadie espera de más.
    take: 50,
  });

  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No hay avisos pendientes"
        description="Cuando una empresa publique un aviso nuevo, va a aparecer acá para revisión."
        actionLabel="Volver al resumen"
        actionHref="/admin"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {jobs.length} {jobs.length === 1 ? "aviso pendiente" : "avisos pendientes"}
      </h2>

      <ul className="flex flex-col gap-6">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="rounded-xl border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <article>
              <header className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {job.title}
                </h3>
                <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
                  {job.company.name}
                  {job.company.isVerified && (
                    <span className="ml-2 rounded bg-success-100 px-2 py-0.5 text-sm font-semibold text-success-700">
                      Verificada
                    </span>
                  )}
                  {" · "}
                  {job.city ? `${job.city}, ${job.province}` : job.province}
                  {" · "}
                  Recibido el {formatDate(job.createdAt)}
                </p>
              </header>

              <dl className="mb-4 grid grid-cols-2 gap-3 text-base sm:grid-cols-3">
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Portales</dt>
                  <dd className="font-semibold text-gray-900 dark:text-gray-100">
                    {job.portals.map((p) => getPortalConfig(p).name).join(" + ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Modalidad</dt>
                  <dd className="font-semibold text-gray-900 dark:text-gray-100">
                    {job.modality}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Salario</dt>
                  <dd className="font-semibold text-gray-900 dark:text-gray-100">
                    {job.salaryArsMin && job.salaryArsMax
                      ? `${formatCurrency(job.salaryArsMin)} – ${formatCurrency(job.salaryArsMax)}`
                      : "No informado"}
                  </dd>
                </div>
              </dl>

              <details className="mb-4">
                <summary className="cursor-pointer text-lg font-semibold text-primary-700 dark:text-primary-300">
                  Ver descripción completa
                </summary>
                <p className="mt-3 whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {job.description}
                </p>
              </details>

              {job.portals.includes("INCLU") && (
                <div className="mb-4 rounded-lg bg-primary-50 p-4 dark:bg-primary-950">
                  <h4 className="mb-2 font-bold text-gray-900 dark:text-gray-100">
                    Accesibilidad declarada
                  </h4>
                  <ul className="list-inside list-disc text-base text-gray-700 dark:text-gray-300">
                    {job.hasAccessibleSite && <li>Instalaciones adaptadas</li>}
                    {job.supportsFlexHours && <li>Horarios flexibles</li>}
                    {job.isRemoteFriendly && <li>Trabajo remoto posible</li>}
                  </ul>
                  {job.accessibilityNotes && (
                    <p className="mt-2 text-base text-gray-700 dark:text-gray-300">
                      {job.accessibilityNotes}
                    </p>
                  )}
                </div>
              )}

              <ModerationActions jobId={job.id} jobTitle={job.title} />
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

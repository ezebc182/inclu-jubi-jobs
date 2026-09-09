import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { getPortalConfig } from "@/lib/portal";
import { formatearCuit } from "@/lib/identificacion";
import { formatCurrency, formatDate } from "@/lib/constants";
import { ModerationActions } from "@/components/admin/ModerationActions";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function ModeracionPage() {
  await requireAdmin();

  const jobs = await prisma.job.findMany({
    where: { moderationStatus: "PENDING" },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          isVerified: true,
          // Acreditación de quien publica. Sin esto el moderador decide mirando
          // un nombre suelto, que es exactamente lo que no alcanza.
          employerType: true,
          taxId: true,
          nationalId: true,
          contactName: true,
          contactRole: true,
          contactPhone: true,
        },
      },
    },
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
      <h2 className="text-2xl font-bold text-ink">
        {jobs.length}{" "}
        {jobs.length === 1 ? "aviso pendiente" : "avisos pendientes"}
      </h2>

      <ul className="flex flex-col gap-6">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="rounded-xl border border-rule bg-surface p-6"
          >
            <article>
              <header className="mb-4">
                <h3 className="text-xl font-bold text-ink">{job.title}</h3>
                <p className="mt-1 text-base text-ink-soft">
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

              {/* Quién publica.
                  Va arriba de todo y separado: es lo primero que hay que mirar
                  ante un aviso sospechoso. Antes solo se veía el nombre de la
                  empresa, que cualquiera puede inventar.

                  "Sin declarar" cuando falta: son avisos de empresas anteriores
                  a que se pidieran estos datos, y esa ausencia también es
                  información para quien modera. */}
              <div className="mb-4 rounded-lg border border-rule bg-paper p-4">
                <h4 className="text-base font-semibold text-ink">
                  Quién publica
                </h4>
                <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 text-base sm:grid-cols-2">
                  <div>
                    <dt className="text-ink-soft">Tipo</dt>
                    <dd className="font-semibold text-ink">
                      {job.company.employerType === "PARTICULAR"
                        ? "Persona particular"
                        : "Empresa"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">
                      {job.company.employerType === "PARTICULAR"
                        ? "DNI"
                        : "CUIT"}
                    </dt>
                    <dd className="font-semibold text-ink">
                      {job.company.employerType === "PARTICULAR"
                        ? (job.company.nationalId ?? "Sin declarar")
                        : job.company.taxId
                          ? formatearCuit(job.company.taxId)
                          : "Sin declarar"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Responsable</dt>
                    <dd className="font-semibold text-ink">
                      {job.company.contactName ?? "Sin declarar"}
                      {job.company.contactRole && (
                        <span className="font-normal text-ink-soft">
                          {" "}
                          · {job.company.contactRole}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Teléfono</dt>
                    <dd className="font-semibold text-ink">
                      {job.company.contactPhone ? (
                        <a
                          href={`tel:${job.company.contactPhone}`}
                          className="link-text text-primary-700 dark:text-primary-200"
                        >
                          {job.company.contactPhone}
                        </a>
                      ) : (
                        "Sin declarar"
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <dl className="mb-4 grid grid-cols-2 gap-3 text-base sm:grid-cols-3">
                <div>
                  <dt className="text-ink-soft">Portales</dt>
                  <dd className="font-semibold text-ink">
                    {job.portals
                      .map((p) => getPortalConfig(p).name)
                      .join(" + ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Modalidad</dt>
                  <dd className="font-semibold text-ink">{job.modality}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Salario</dt>
                  <dd className="font-semibold text-ink">
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
                <p className="mt-3 whitespace-pre-wrap text-lg leading-relaxed text-ink-soft">
                  {job.description}
                </p>
              </details>

              {job.portals.includes("INCLU") && (
                <div className="mb-4 rounded-lg bg-primary-50 p-4 dark:bg-primary-950">
                  <h4 className="mb-2 font-bold text-ink">
                    Accesibilidad declarada
                  </h4>
                  <ul className="list-inside list-disc text-base text-ink-soft">
                    {job.hasAccessibleSite && <li>Instalaciones adaptadas</li>}
                    {job.supportsFlexHours && <li>Horarios flexibles</li>}
                    {job.isRemoteFriendly && <li>Trabajo remoto posible</li>}
                  </ul>
                  {job.accessibilityNotes && (
                    <p className="mt-2 text-base text-ink-soft">
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

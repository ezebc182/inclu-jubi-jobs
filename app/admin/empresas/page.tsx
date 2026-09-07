import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/constants";
import { CompanyAdminActions } from "@/components/admin/CompanyAdminActions";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AdminEmpresasPage() {
  await requireAdmin();

  const companies = await prisma.company.findMany({
    include: {
      owner: { select: { email: true } },
      _count: { select: { jobs: true } },
    },
    // Sin verificar primero: son las que necesitan una decisión.
    orderBy: [{ isVerified: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  if (companies.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay empresas registradas"
        description="Cuando una empresa complete su registro, va a aparecer acá."
        actionLabel="Volver al resumen"
        actionHref="/admin"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-ink">
        {companies.length} {companies.length === 1 ? "empresa" : "empresas"}
      </h2>

      <ul className="flex flex-col gap-4">
        {companies.map((company) => (
          <li
            key={company.id}
            className="rounded-xl border-2 border-rule bg-white p-6"
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-ink">
                  {company.name}
                </h3>
                <p className="mt-1 text-base text-ink-soft">
                  {company.owner.email} · {company._count.jobs}{" "}
                  {company._count.jobs === 1 ? "aviso" : "avisos"} · Registrada
                  el {formatDate(company.createdAt)}
                </p>
                {company.location && (
                  <p className="text-base text-ink-soft">
                    {company.location}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {company.isVerified ? (
                  <span className="rounded bg-success-100 px-3 py-1 text-sm font-semibold text-success-800">
                    Verificada
                  </span>
                ) : (
                  <span className="rounded bg-secondary-100 px-3 py-1 text-sm font-semibold text-secondary-800">
                    Sin verificar
                  </span>
                )}
                {company.autoApproveJobs && (
                  <span className="rounded bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800">
                    Publica directo
                  </span>
                )}
                {!company.isActive && (
                  <span className="rounded bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                    Suspendida
                  </span>
                )}
              </div>
            </div>

            {!company.isActive && company.suspendedReason && (
              <p className="mb-4 rounded-lg bg-red-50 p-4 text-base text-red-900 dark:bg-red-950 dark:text-red-200">
                <strong>Motivo de suspensión:</strong> {company.suspendedReason}
              </p>
            )}

            <CompanyAdminActions
              companyId={company.id}
              companyName={company.name}
              isVerified={company.isVerified}
              autoApproveJobs={company.autoApproveJobs}
              isActive={company.isActive}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

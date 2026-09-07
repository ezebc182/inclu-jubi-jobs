import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { getPortalConfig } from "@/lib/portal";
import { EmptyState } from "@/components/ui/EmptyState";

/** Etiquetas legibles de cada acción registrada. */
const ACTION_LABELS: Record<string, string> = {
  "job.approve": "Aprobó un aviso",
  "job.reject": "Rechazó un aviso",
  "company.verify": "Cambió la verificación de una empresa",
  "company.suspend": "Suspendió una empresa",
  "company.reactivate": "Reactivó una empresa",
  "user.suspend": "Suspendió un usuario",
  "user.reactivate": "Reactivó un usuario",
  "user.role_change": "Cambió el rol de un usuario",
};

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Argentina/Buenos_Aires",
});

export default async function AdminAuditoriaPage() {
  await requireAdmin();

  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  if (entries.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay acciones registradas"
        description="Cada aprobación, rechazo o suspensión que hagas desde el panel queda registrada acá."
        actionLabel="Volver al resumen"
        actionHref="/admin"
      />
    );
  }

  // Resolvemos los nombres de los administradores en una sola consulta.
  const actorIds = [...new Set(entries.map((entry) => entry.actorId))];
  const actors = await prisma.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, name: true, email: true },
  });
  const actorById = new Map(actors.map((actor) => [actor.id, actor]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-ink">
          Registro de auditoría
        </h2>
        <p className="mt-1 text-lg text-ink-soft">
          Últimas {entries.length} acciones administrativas.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Acciones administrativas ordenadas de la más reciente a la más
            antigua
          </caption>
          <thead>
            <tr className="border-b-2 border-rule">
              <th
                scope="col"
                className="py-3 pr-4 text-base font-bold text-ink"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="py-3 pr-4 text-base font-bold text-ink"
              >
                Administrador
              </th>
              <th
                scope="col"
                className="py-3 pr-4 text-base font-bold text-ink"
              >
                Acción
              </th>
              <th
                scope="col"
                className="py-3 pr-4 text-base font-bold text-ink"
              >
                Portal
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const actor = actorById.get(entry.actorId);
              return (
                <tr
                  key={entry.id}
                  className="border-b border-rule"
                >
                  <td className="py-3 pr-4 text-base text-ink-soft">
                    {dateTimeFormatter.format(entry.createdAt)}
                  </td>
                  <td className="py-3 pr-4 text-base text-ink-soft">
                    {actor?.name || actor?.email || "Cuenta eliminada"}
                  </td>
                  <td className="py-3 pr-4 text-base text-ink">
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </td>
                  <td className="py-3 pr-4 text-base text-ink-soft">
                    {entry.portal ? getPortalConfig(entry.portal).name : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

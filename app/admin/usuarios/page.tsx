import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin";
import { getPortalConfig, isPortalId } from "@/lib/portal";
import { formatDate } from "@/lib/constants";
import { UserAdminActions } from "@/components/admin/UserAdminActions";
import { EmptyState } from "@/components/ui/EmptyState";

const ROLE_LABELS = {
  CANDIDATE: "Candidato/a",
  COMPANY: "Empresa",
  ADMIN: "Administrador/a",
} as const;

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; portal?: string; rol?: string }>;
}) {
  const actor = await requireAdmin();
  const params = await searchParams;

  const where: Prisma.UserWhereInput = {};

  if (params.q) {
    where.OR = [
      { email: { contains: params.q, mode: "insensitive" } },
      { name: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (isPortalId(params.portal)) where.portal = params.portal;
  if (
    params.rol === "CANDIDATE" ||
    params.rol === "COMPANY" ||
    params.rol === "ADMIN"
  ) {
    where.role = params.rol;
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      portal: true,
      isActive: true,
      suspendedReason: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <form
        method="get"
        className="flex flex-wrap items-end gap-4"
        role="search"
      >
        <div className="flex-1">
          <label
            htmlFor="q"
            className="mb-1 block text-base font-semibold text-ink"
          >
            Buscar por nombre o email
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={params.q ?? ""}
            className="min-h-[48px] w-full rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>

        <div>
          <label
            htmlFor="portal"
            className="mb-1 block text-base font-semibold text-ink"
          >
            Portal
          </label>
          <select
            id="portal"
            name="portal"
            defaultValue={params.portal ?? ""}
            className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg"
          >
            <option value="">Todos</option>
            <option value="JUBI">JubiJobs</option>
            <option value="INCLU">InclúJobs</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="rol"
            className="mb-1 block text-base font-semibold text-ink"
          >
            Rol
          </label>
          <select
            id="rol"
            name="rol"
            defaultValue={params.rol ?? ""}
            className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg"
          >
            <option value="">Todos</option>
            <option value="CANDIDATE">Candidatos</option>
            <option value="COMPANY">Empresas</option>
            <option value="ADMIN">Administradores</option>
          </select>
        </div>

        <button
          type="submit"
          className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-lg font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
        >
          Filtrar
        </button>
      </form>

      {users.length === 0 ? (
        <EmptyState
          title="No hay usuarios que coincidan"
          description="Probá con otros términos de búsqueda o quitá los filtros."
          actionLabel="Ver todos"
          actionHref="/admin/usuarios"
        />
      ) : (
        <>
          <p className="text-lg text-ink-soft" role="status">
            {users.length} {users.length === 1 ? "usuario" : "usuarios"}
          </p>

          <ul className="flex flex-col gap-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="rounded-xl border-2 border-rule bg-white p-6"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-ink">
                      {user.name || "Sin nombre"}
                    </h3>
                    <p className="mt-1 text-base text-ink-soft">
                      {user.email} · {ROLE_LABELS[user.role]} ·{" "}
                      {getPortalConfig(user.portal).name} · Alta el{" "}
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  {!user.isActive && (
                    <span className="rounded bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                      Suspendido
                    </span>
                  )}
                </div>

                {!user.isActive && user.suspendedReason && (
                  <p className="mb-3 rounded-lg bg-red-50 p-4 text-base text-red-900 dark:bg-red-950 dark:text-red-200">
                    <strong>Motivo:</strong> {user.suspendedReason}
                  </p>
                )}

                <UserAdminActions
                  userId={user.id}
                  userLabel={user.name || user.email}
                  role={user.role}
                  isActive={user.isActive}
                  isSelf={user.id === actor.id}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

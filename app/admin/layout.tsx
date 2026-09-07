import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/moderacion", label: "Moderación" },
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/auditoria", label: "Auditoría" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor = await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8 border-b-2 border-gray-200 pb-6 dark:border-gray-700">
        <p className="text-base text-gray-600 dark:text-gray-400">
          Panel de administración — {actor.name || actor.email}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Gestión de portales
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <nav aria-label="Secciones de administración" className="lg:col-span-1">
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-[48px] items-center rounded-lg px-4 py-3 text-lg font-semibold text-gray-800 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">{children}</div>
      </div>
    </div>
  );
}

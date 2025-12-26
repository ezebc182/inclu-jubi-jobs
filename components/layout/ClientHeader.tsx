"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface ClientHeaderProps {
  session: any;
}

export function ClientHeader({ session }: ClientHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b-2 border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl font-bold text-primary-600 transition-colors hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-primary-400 dark:hover:text-primary-300"
          >
            JubiJobs
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/empleos"
              className="min-h-[48px] rounded-lg px-5 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Empleos
            </Link>
            <Link
              href="/empresas"
              className="min-h-[48px] rounded-lg px-5 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Empresas
            </Link>

            <ThemeToggle />

            {session ? (
              <>
                {session.user.role === "COMPANY" && (
                  <Link
                    href="/empresa"
                    className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
                  >
                    Mi empresa
                  </Link>
                )}
                {session.user.role === "CANDIDATE" && (
                  <Link
                    href="/postulaciones"
                    className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
                  >
                    Mis postulaciones
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="min-h-[48px] rounded-lg px-5 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/ingresar"
                className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Ingresar
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

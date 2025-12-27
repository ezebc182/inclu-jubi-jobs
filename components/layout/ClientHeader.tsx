"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FontSizeControl } from "@/components/ui/FontSizeControl";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

interface ClientHeaderProps {
  session: any;
}

export function ClientHeader({ session }: ClientHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
    setMobileMenuOpen(false);
  };

  return (
    <header role="banner" className="border-b-2 border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl font-bold text-primary-600 transition-colors hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-primary-400 dark:hover:text-primary-300"
          >
            JubiJobs
          </Link>

          {/* Desktop Navigation */}
          <nav role="navigation" aria-label="Navegación principal" className="hidden md:flex items-center gap-3">
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
            <Link
              href="/ayuda"
              className="min-h-[48px] rounded-lg px-5 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Ayuda
            </Link>

            <ThemeToggle />
            <FontSizeControl />

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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[48px] min-w-[48px] rounded-lg p-3 text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            role="navigation"
            aria-label="Navegación móvil"
            className="mt-4 flex flex-col gap-3 border-t-2 border-gray-200 pt-4 md:hidden dark:border-gray-700"
          >
            <Link
              href="/empleos"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[48px] rounded-lg px-5 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Empleos
            </Link>
            <Link
              href="/empresas"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[48px] rounded-lg px-5 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Empresas
            </Link>
            <Link
              href="/ayuda"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[48px] rounded-lg px-5 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Ayuda
            </Link>

            <div className="flex items-center justify-between border-t-2 border-gray-200 pt-3 dark:border-gray-700">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Tema:</span>
              <ThemeToggle />
            </div>

            {session ? (
              <>
                {session.user.role === "COMPANY" && (
                  <Link
                    href="/empresa"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-center text-lg font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
                  >
                    Mi empresa
                  </Link>
                )}
                {session.user.role === "CANDIDATE" && (
                  <Link
                    href="/postulaciones"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-center text-lg font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
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
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-center text-lg font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Ingresar
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

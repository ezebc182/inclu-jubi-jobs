"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "./UserMenu";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { BrandSlug } from "@/lib/brand-assets";

interface SessionUser {
  id: string;
  role?: "CANDIDATE" | "COMPANY" | "ADMIN";
  /** Los tres vienen de Google. `name` e `image` pueden faltar. */
  name: string | null;
  email: string;
  image: string | null;
}

interface ClientHeaderProps {
  session: { user: SessionUser } | null;
  /** Marca activa, resuelta por dominio en el servidor. */
  brand: BrandSlug;
}

export function ClientHeader({ session, brand }: ClientHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
    setMobileMenuOpen(false);
  };

  const isAdmin = session?.user.role === "ADMIN";

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b border-rule bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80"
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="Ir al inicio"
            className="rounded-lg text-primary-700 transition-colors hover:text-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:text-primary-300 dark:hover:text-primary-200"
          >
            <BrandLogo slug={brand} symbolSize={40} />
          </Link>

          {/* Desktop Navigation */}
          <nav
            role="navigation"
            aria-label="Navegación principal"
            className="hidden items-center gap-3 md:flex"
          >
            <Link
              href="/empleos"
              className="min-h-[44px] rounded-md px-4 py-2.5 text-lg font-medium text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Empleos
            </Link>
            <Link
              href="/empresas"
              className="min-h-[44px] rounded-md px-4 py-2.5 text-lg font-medium text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Empresas
            </Link>
            <Link
              href="/ayuda"
              className="min-h-[44px] rounded-md px-4 py-2.5 text-lg font-medium text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Ayuda
            </Link>

            <ThemeToggle />

            {session ? (
              // La acción principal queda a la vista y el resto entra al menú.
              // Antes había hasta tres botones sueltos más un "Salir" sin
              // contexto: no se sabía con qué cuenta se había entrado.
              <>
                {session.user.role === "COMPANY" && (
                  <Link
                    href="/empresa"
                    className="min-h-[44px] rounded-md bg-primary-600 px-5 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
                  >
                    Mi empresa
                  </Link>
                )}
                {session.user.role === "CANDIDATE" && (
                  <Link
                    href="/postulaciones"
                    className="min-h-[44px] rounded-md bg-primary-600 px-5 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
                  >
                    Mis postulaciones
                  </Link>
                )}
                <UserMenu user={session.user} />
              </>
            ) : (
              <Link
                href="/ingresar"
                className="min-h-[44px] rounded-md bg-primary-600 px-5 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Ingresar
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] rounded-md p-2.5 text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30 md:hidden"
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
            className="mt-4 flex flex-col gap-3 border-t border-rule pt-4 md:hidden"
          >
            <Link
              href="/empleos"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] rounded-md px-4 py-2.5 text-lg font-medium text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Empleos
            </Link>
            <Link
              href="/empresas"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] rounded-md px-4 py-2.5 text-lg font-medium text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Empresas
            </Link>
            <Link
              href="/ayuda"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] rounded-md px-4 py-2.5 text-lg font-medium text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Ayuda
            </Link>

            <div className="flex items-center justify-between border-t border-rule pt-3">
              <span className="text-lg font-medium text-ink">Tema:</span>
              <ThemeToggle />
            </div>

            {session ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] rounded-md border border-primary-600 px-5 py-2.5 text-center text-lg font-medium text-primary-700 transition-colors hover:bg-primary-50 dark:border-primary-300 dark:text-primary-200 dark:hover:bg-primary-900/30"
                  >
                    Administración
                  </Link>
                )}
                {session.user.role === "COMPANY" && (
                  <Link
                    href="/empresa"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] rounded-md bg-primary-600 px-5 py-2.5 text-center text-lg font-semibold text-white transition-colors hover:bg-primary-700"
                  >
                    Mi empresa
                  </Link>
                )}
                {session.user.role === "CANDIDATE" && (
                  <Link
                    href="/postulaciones"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] rounded-md bg-primary-600 px-5 py-2.5 text-center text-lg font-semibold text-white transition-colors hover:bg-primary-700"
                  >
                    Mis postulaciones
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="min-h-[44px] rounded-md px-4 py-2.5 text-lg font-medium text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/ingresar"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] rounded-md bg-primary-600 px-5 py-2.5 text-center text-lg font-semibold text-white transition-colors hover:bg-primary-700"
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

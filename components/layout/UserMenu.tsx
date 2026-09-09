"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LineIcon } from "@/components/ui/LineIcon";

export interface UserMenuUser {
  name: string | null;
  email: string;
  image: string | null;
  role?: "CANDIDATE" | "COMPANY" | "ADMIN";
}

/**
 * Menú de la persona que inició sesión.
 *
 * Antes el header solo mostraba un botón "Salir" suelto: no había forma de
 * saber con qué cuenta se había entrado. En un sitio donde alguien puede tener
 * un correo personal y otro de la empresa, eso importa.
 *
 * El disparador muestra la foto de Google —o las iniciales si no hay— y el
 * nombre. Adentro van el correo y las acciones, agrupadas.
 */
export function UserMenu({ user }: { user: UserMenuUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Cerrar al clickear afuera o al apretar Escape: lo que espera cualquiera
  // que haya usado un menú antes.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName = user.name?.trim() || user.email;
  // Solo el nombre de pila en el botón: "Ezequiel Bär Coch" completo empuja la
  // navegación y en pantallas medianas la parte.
  const firstName = displayName.split(" ")[0]!;

  const homeLink =
    user.role === "COMPANY"
      ? { href: "/empresa", label: "Mi empresa" }
      : { href: "/postulaciones", label: "Mis postulaciones" };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        className="flex min-h-[44px] items-center gap-2 rounded-md px-2 py-1.5 text-lg font-medium text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
      >
        <Avatar user={user} />
        <span className="hidden sm:inline">{firstName}</span>
        <span className="text-ink-soft" aria-hidden="true">
          <LineIcon name="chevron-down" size={18} strokeWidth={2} />
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Tu cuenta"
          className="surface-raised absolute right-0 z-50 mt-2 w-64 rounded-lg p-2"
        >
          {/* El correo, para saber con qué cuenta se entró. `break-all` porque
              una dirección larga se sale de la caja. */}
          <div className="border-b border-rule px-3 pb-3 pt-2">
            <p className="font-semibold text-ink">{displayName}</p>
            <p className="mt-0.5 break-all text-base text-ink-soft">
              {user.email}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={homeLink.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center rounded-md px-3 text-lg text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              {homeLink.label}
            </Link>

            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded-md px-3 text-lg text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
              >
                Administración
              </Link>
            )}
          </div>

          {/* Separado del resto: cerrar sesión no es una navegación más. */}
          <div className="mt-2 border-t border-rule pt-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={signingOut}
              aria-busy={signingOut}
              className="flex min-h-[44px] w-full items-center rounded-md px-3 text-left text-lg text-ink transition-colors hover:bg-primary-50 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-primary-900/30"
            >
              {signingOut ? "Cerrando sesión…" : "Cerrar sesión"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Foto de Google, o las iniciales cuando no hay.
 *
 * `unoptimized` a propósito: las fotos de `lh3.googleusercontent.com` ya vienen
 * dimensionadas y pasarlas por el optimizador de Next agregaría una petición al
 * servidor sin ganancia.
 */
function Avatar({ user }: { user: UserMenuUser }) {
  const [failed, setFailed] = useState(false);
  const label = user.name?.trim() || user.email;

  if (user.image && !failed) {
    return (
      <Image
        src={user.image}
        alt=""
        width={32}
        height={32}
        unoptimized
        onError={() => setFailed(true)}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white"
    >
      {initials(label)}
    </span>
  );
}

/** Dos iniciales como mucho: "Ezequiel Bär Coch" → "EB". */
function initials(value: string): string {
  return value
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

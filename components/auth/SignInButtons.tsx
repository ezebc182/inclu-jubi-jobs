"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { SocialProviderId } from "@/lib/auth-providers";

/**
 * Botones de ingreso social.
 *
 * Solo se pintan los proveedores que el servidor confirmó como configurados
 * (ver `lib/auth-providers.ts`). Antes se pintaban los tres siempre y el
 * usuario descubría a los golpes cuál funcionaba.
 *
 * Los logos van en su color de marca: son marcas registradas y su guía de uso
 * lo exige. Pero el color NO transmite información acá — el texto del botón
 * dice de qué proveedor se trata.
 */

const PROVIDERS: Record<
  SocialProviderId,
  { name: string; icon: React.ReactNode }
> = {
  google: {
    name: "Google",
    icon: (
      <svg
        className="h-6 w-6 shrink-0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  microsoft: {
    name: "Microsoft",
    icon: (
      <svg
        className="h-6 w-6 shrink-0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022" />
        <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00" />
        <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF" />
        <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900" />
      </svg>
    ),
  },
  facebook: {
    name: "Facebook",
    icon: (
      <svg
        className="h-6 w-6 shrink-0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          fill="#1877F2"
        />
      </svg>
    ),
  },
  github: {
    name: "GitHub",
    icon: (
      <svg
        className="h-6 w-6 shrink-0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1a2.6 2.6 0 0 1 .7-1.6c-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5 18.3 5c.7 1.7.3 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"
          fill="currentColor"
        />
      </svg>
    ),
  },
};

export function SignInButtons({
  providers,
}: {
  providers: SocialProviderId[];
}) {
  const [loading, setLoading] = useState<SocialProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (providers.length === 0) return null;

  const handleSignIn = async (provider: SocialProviderId) => {
    setLoading(provider);
    setError(null);

    /**
     * `signIn.social` del cliente de Better-Auth, no una navegación a mano.
     *
     * Antes esto hacía `window.location.href = "/api/auth/sign-in/" + provider`,
     * que da 404: esa ruta no existe. Better-Auth expone `/sign-in/social` y
     * espera un POST con el provider en el body, no un GET con el provider en
     * la URL. El botón llevaba a una pantalla de error del navegador.
     *
     * El cliente resuelve su base contra el origen actual (ver
     * `lib/auth-client.ts`), así que el callback vuelve al portal por el que
     * entró la persona.
     */
    const { error: signInError } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });

    // Si falla, el botón tiene que soltarse. Antes, ante cualquier error,
    // quedaba girando en "Llevándote a Google" para siempre.
    if (signInError) {
      setError(
        "No pudimos abrir el ingreso con " +
          PROVIDERS[provider].name +
          ". Probá de nuevo en un momento."
      );
      setLoading(null);
    }
  };

  return (
    <>
      {/* role="alert" para que un lector de pantalla lo anuncie sin que la
          persona tenga que ir a buscarlo. */}
      {error && (
        <p
          role="alert"
          className="mb-3 rounded-md border border-rule bg-paper p-3 text-base text-ink"
        >
          {error}
        </p>
      )}

      <ul className="space-y-3">
        {providers.map((id) => {
          const provider = PROVIDERS[id];
          const isLoading = loading === id;

          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => handleSignIn(id)}
                disabled={loading !== null}
                // aria-busy en vez de solo el texto: el lector de pantalla
                // anuncia el estado sin depender de leer "Redirigiendo".
                aria-busy={isLoading}
                className="flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-rule bg-surface px-6 text-lg font-semibold text-ink transition-colors hover:border-primary-300 hover:bg-primary-50 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-primary-900/25"
              >
                {isLoading ? (
                  <span
                    className="h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-rule border-t-primary-600"
                    aria-hidden="true"
                  />
                ) : (
                  provider.icon
                )}
                <span>
                  {isLoading ? "Llevándote a " : "Continuar con "}
                  {provider.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

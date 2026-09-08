"use client";

import { useId, useState } from "react";
import { SignInButtons } from "./SignInButtons";
import { PhoneLogin } from "./PhoneLogin";
import { LineIcon } from "@/components/ui/LineIcon";
import type { SocialProviderId } from "@/lib/auth-providers";

type LoginMethod = "oauth" | "phone";

/**
 * Selector de método de ingreso.
 *
 * Tres decisiones que no son cosméticas:
 *
 * 1. Los tabs aparecen SOLO si hay dos métodos disponibles. Un tab solitario no
 *    es una elección, es ruido: ocupa espacio y sugiere que hay algo más.
 *
 * 2. `role="tablist"` de verdad, con flechas para navegar. Antes eran dos
 *    `<button>` sueltos y un lector de pantalla no anunciaba que fueran
 *    alternativas de lo mismo.
 *
 * 3. Sin emoji. El "📱" anterior se leía en voz alta como "teléfono móvil,
 *    Teléfono" — la etiqueta duplicada, y con un glifo distinto por sistema.
 */
export function LoginOptions({
  providers,
  phoneEnabled,
}: {
  providers: SocialProviderId[];
  phoneEnabled: boolean;
}) {
  const hasSocial = providers.length > 0;
  const [method, setMethod] = useState<LoginMethod>(
    hasSocial ? "oauth" : "phone"
  );
  const baseId = useId();

  // Sin ningún método configurado no se finge una pantalla de ingreso: se dice
  // qué pasa y por dónde seguir. Ver `lib/auth-providers.ts`.
  if (!hasSocial && !phoneEnabled) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-rule bg-paper p-6 text-center"
      >
        <p className="text-lg font-semibold text-ink">
          El ingreso está momentáneamente fuera de servicio
        </p>
        <p className="mt-2 text-base text-ink-soft">
          Podés seguir viendo los empleos publicados. Volvé a intentar en unos
          minutos.
        </p>
        <a
          href="/empleos"
          className="mt-5 inline-flex min-h-[48px] items-center rounded-md bg-primary-600 px-6 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Ver empleos
        </a>
      </div>
    );
  }

  const onlyOneMethod = !hasSocial || !phoneEnabled;

  if (onlyOneMethod) {
    return hasSocial ? <SignInButtons providers={providers} /> : <PhoneLogin />;
  }

  const tabs: Array<{
    id: LoginMethod;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "oauth",
      // El nombre del proveedor, no la lista de todos: si solo hay Google, decir
      // "Google / Facebook / Microsoft" es una promesa que no se cumple.
      label:
        providers.length === 1
          ? providerLabel(providers[0]!)
          : "Cuenta de correo",
      icon: <LineIcon name="chat" size={22} />,
    },
    {
      id: "phone",
      // "WhatsApp" y no "SMS": es el canal real y es la palabra que esta
      // audiencia reconoce sin pensar.
      label: "Código por WhatsApp",
      icon: <LineIcon name="phone" size={22} />,
    },
  ];

  /** Flechas entre tabs: lo que espera cualquiera que navegue con teclado. */
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (delta === 0) return;

    event.preventDefault();
    const next = tabs[(index + delta + tabs.length) % tabs.length]!;
    setMethod(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  };

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Cómo querés ingresar"
        className="flex gap-1 rounded-lg border border-rule bg-paper p-1"
      >
        {tabs.map((tab, index) => {
          const selected = method === tab.id;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              // Solo el tab activo entra en el orden de tabulación: es el
              // patrón de tablist, así el Tab salta al contenido y no entre
              // tabs.
              tabIndex={selected ? 0 : -1}
              onClick={() => setMethod(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-3 text-base font-semibold transition-colors ${
                selected
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-soft hover:bg-surface/60 hover:text-ink"
              }`}
            >
              <span
                className={selected ? "text-primary-600" : "text-ink-soft"}
                aria-hidden="true"
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${baseId}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={method !== tab.id}
        >
          {tab.id === "oauth" ? (
            <SignInButtons providers={providers} />
          ) : (
            <PhoneLogin />
          )}
        </div>
      ))}
    </div>
  );
}

function providerLabel(id: SocialProviderId): string {
  const names: Record<SocialProviderId, string> = {
    google: "Cuenta de Google",
    microsoft: "Cuenta de Microsoft",
    facebook: "Cuenta de Facebook",
    github: "Cuenta de GitHub",
  };
  return names[id];
}

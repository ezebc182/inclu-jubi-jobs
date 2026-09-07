"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "pwa-install-dismissed-at";
/** Si lo rechazan, no volvemos a molestar por dos semanas. */
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

function wasRecentlyDismissed() {
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < SNOOZE_MS;
  } catch {
    return false;
  }
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS expone esto fuera del estándar.
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

/**
 * Invitación a instalar la app.
 *
 * Pensada para la audiencia real de estos portales: nada de "A2HS" ni jerga.
 * Se explica en castellano qué gana la persona, con botones grandes y foco
 * gestionado. Aparece solo cuando el navegador confirma que se puede instalar.
 */
export function InstallPrompt({ appName }: { appName: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [visible, setVisible] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    let showTimer: ReturnType<typeof setTimeout> | undefined;

    const onBeforeInstall = (event: Event) => {
      // Cortamos el mini-infobar del navegador para mostrar el nuestro,
      // que explica de qué se trata.
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);

      // Esperamos a que la persona haya visto de qué se trata el sitio.
      // Interrumpir en el primer segundo, tapando el titular, es la
      // forma más rápida de que cierren la pestaña.
      showTimer = setTimeout(() => setVisible(true), 25_000);
    };

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      if (showTimer) clearTimeout(showTimer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (visible) headingRef.current?.focus();
  }, [visible]);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      // Modo privado: no poder recordar la decisión no es motivo de error.
    }
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  }, [deferred]);

  if (!visible || !deferred) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="install-prompt-title"
      aria-describedby="install-prompt-desc"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-primary-600 bg-surface p-6 shadow-xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm sm:rounded-lg sm:border"
    >
      <h2
        id="install-prompt-title"
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-xl font-semibold focus:outline-none"
      >
        Instalá {appName} en tu teléfono
      </h2>
      <p
        id="install-prompt-desc"
        className="mt-2 text-base leading-relaxed text-ink-soft"
      >
        Queda el acceso directo en la pantalla de inicio, como cualquier otra
        aplicación. Abre más rápido y los empleos que ya viste quedan
        disponibles sin internet.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={install}
          className="min-h-[48px] flex-1 rounded-md bg-primary-600 px-5 text-base font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Instalar
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-[48px] rounded-md border border-rule px-5 text-base font-medium text-ink-soft transition-colors hover:bg-paper"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}

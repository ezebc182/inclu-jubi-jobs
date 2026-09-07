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
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
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
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    const onBeforeInstall = (event: Event) => {
      // Cortamos el mini-infobar del navegador para mostrar el nuestro,
      // que explica de qué se trata.
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
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
      className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-primary-600 bg-white p-6 shadow-2xl dark:border-primary-400 dark:bg-gray-800 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-md sm:rounded-xl sm:border-4"
    >
      <h2
        id="install-prompt-title"
        ref={headingRef}
        tabIndex={-1}
        className="mb-3 text-2xl font-bold text-gray-900 focus:outline-none dark:text-gray-100"
      >
        Instalá {appName} en tu teléfono
      </h2>
      <p id="install-prompt-desc" className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        Vas a tener el acceso directo en la pantalla de inicio, como cualquier otra
        aplicación. Abre más rápido y podés ver los empleos guardados aunque te
        quedes sin internet.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={install}
          className="min-h-[56px] flex-1 rounded-lg bg-primary-600 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          Instalar la aplicación
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-[56px] rounded-lg border-2 border-gray-400 px-6 py-4 text-lg font-semibold text-gray-800 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}

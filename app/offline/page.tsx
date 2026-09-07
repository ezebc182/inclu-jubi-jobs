import type { Metadata } from "next";
import { getCurrentPortalConfig } from "@/lib/portal";

export const metadata: Metadata = {
  title: "Sin conexión",
  robots: { index: false, follow: false },
};

/**
 * Página que sirve el service worker cuando no hay red.
 *
 * Debe ser autosuficiente: sin datos, sin llamadas a la base. Si necesitara
 * el servidor, no podría mostrarse justo cuando hace falta.
 */
export default async function OfflinePage() {
  const portal = await getCurrentPortalConfig();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 text-6xl" aria-hidden="true">
        📡
      </div>
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
        Te quedaste sin internet
      </h1>
      <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
        No pudimos conectarnos. Revisá el wifi o los datos del teléfono y volvé a
        intentar. Las páginas que ya visitaste siguen disponibles.
      </p>

      <a
        href="/empleos"
        className="min-h-[56px] rounded-lg bg-primary-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        Reintentar
      </a>

      <p className="mt-10 text-base text-gray-600 dark:text-gray-400">
        {portal.name} · Si el problema sigue, escribinos a{" "}
        <a href={`mailto:${portal.contactEmail}`} className="underline">
          {portal.contactEmail}
        </a>
      </p>
    </div>
  );
}

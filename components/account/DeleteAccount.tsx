"use client";

import { useState } from "react";
import { deleteMyAccount } from "@/app/actions/account";

/**
 * Baja de la cuenta con confirmación dentro de la página: `confirm()` es
 * chico, no se puede leer con zoom y no deja explicar qué se pierde.
 */
export function DeleteAccount({
  usted,
  company,
}: {
  usted: boolean;
  company: { name: string; jobs: number; applications: number } | null;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setPending(true);
    setError("");
    const result = await deleteMyAccount();
    if (result.success) {
      // Navegación completa: la sesión ya no existe y no queremos estado viejo.
      window.location.assign("/");
      return;
    }
    setError(result.error ?? "No se pudo eliminar la cuenta.");
    setPending(false);
  };

  return (
    <div className="mt-4">
      <p className="text-lg text-ink-soft">
        {usted
          ? "Se borran su perfil, sus postulaciones y sus búsquedas guardadas. No se puede deshacer."
          : "Se borran tu perfil, tus postulaciones y tus búsquedas guardadas. No se puede deshacer."}
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-6 min-h-[48px] rounded-md border-2 border-red-700 px-6 text-lg font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-950"
        >
          Eliminar mi cuenta
        </button>
      ) : (
        <div
          role="group"
          aria-labelledby="delete-title"
          aria-describedby="delete-detail"
          className="mt-6 rounded-lg border-2 border-red-700 p-6 dark:border-red-400"
        >
          <p id="delete-title" className="text-xl font-semibold text-ink">
            {usted
              ? "¿Seguro que quiere eliminar su cuenta?"
              : "¿Seguro que querés eliminar tu cuenta?"}
          </p>
          <div
            id="delete-detail"
            className="mt-3 space-y-3 text-lg text-ink-soft"
          >
            {company ? (
              <p>
                <strong className="text-ink">
                  {usted
                    ? "También se borra su empresa"
                    : "También se borra tu empresa"}{" "}
                  &quot;{company.name}&quot;
                </strong>
                , sus {company.jobs} {company.jobs === 1 ? "aviso" : "avisos"} y
                las {company.applications}{" "}
                {company.applications === 1 ? "postulación" : "postulaciones"}{" "}
                que otras personas enviaron a esos avisos. Esas personas dejan
                de ver su postulación.
              </p>
            ) : null}
            <p>No se puede deshacer.</p>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 text-lg font-semibold text-red-700 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              aria-busy={pending}
              className="min-h-[48px] rounded-md bg-red-700 px-6 text-lg font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? "Eliminando…" : "Sí, eliminar mi cuenta"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              // El botón que se tocó desaparece: el foco va a la opción segura.
              autoFocus
              className="min-h-[48px] rounded-md px-6 text-lg font-medium text-ink transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

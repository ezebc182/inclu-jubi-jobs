"use client";

import { useState, useTransition } from "react";
import type { LeadKind } from "@prisma/client";
import { announceToLeads } from "@/app/actions/leads";
import type { PortalId } from "@/lib/portal";

/**
 * Disparo manual del aviso a un grupo de la lista.
 *
 * Confirmación de dos pasos con el número escrito: un envío masivo no se
 * deshace. Una vez que salieron 340 correos no hay botón para traerlos de
 * vuelta, así que el paso extra no es burocracia, es la única red que hay.
 *
 * El resultado se muestra fijo en pantalla, no en toast: si el envío se cortó
 * a la mitad, quien administra necesita ver cuántos salieron para decidir si
 * reintenta.
 */
export function LeadAnnounceButton({
  portal,
  portalName,
  kind,
  pending,
}: {
  portal: PortalId;
  portalName: string;
  kind: LeadKind;
  /** Cuántos hay sin notificar en este grupo. */
  pending: number;
}) {
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<
    { ok: true; sent: number } | { ok: false; error: string } | null
  >(null);
  const [isPending, startTransition] = useTransition();

  const noun = kind === "CANDIDATE" ? "candidato" : "empresa";
  const nounPlural = kind === "CANDIDATE" ? "candidatos" : "empresas";
  const label =
    pending === 1
      ? `Avisar a 1 ${noun} de ${portalName}`
      : `Avisar a los ${pending} ${nounPlural} de ${portalName} sin notificar`;

  const handleConfirm = () => {
    startTransition(async () => {
      const response = await announceToLeads({ portal, kind });
      setConfirming(false);
      setResult(
        response.success
          ? { ok: true, sent: response.sent ?? 0 }
          : { ok: false, error: response.error ?? "No se pudo enviar" }
      );
    });
  };

  if (result) {
    return (
      <div
        role="status"
        className={
          result.ok
            ? "rounded-lg border-2 border-success-600 bg-success-50 p-4 dark:border-success-400 dark:bg-success-900"
            : "rounded-lg border-2 border-red-600 bg-red-50 p-4 dark:border-red-400 dark:bg-red-950"
        }
      >
        <p
          className={
            result.ok
              ? "text-lg font-bold text-success-900 dark:text-success-50"
              : "text-lg font-bold text-red-800 dark:text-red-200"
          }
        >
          {result.ok
            ? `Se enviaron ${result.sent} ${result.sent === 1 ? "correo" : "correos"}.`
            : result.error}
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-3 min-h-[48px] rounded-lg border-2 border-rule px-5 py-2 text-lg font-semibold text-ink hover:bg-paper focus:outline-none focus:ring-4 focus:ring-primary-300"
        >
          Volver
        </button>
      </div>
    );
  }

  if (pending === 0) {
    return (
      <p className="text-lg text-ink-soft">
        No hay nadie sin avisar en este grupo.
      </p>
    );
  }

  if (confirming) {
    return (
      <div className="rounded-lg border-2 border-secondary-500 bg-secondary-50 p-4 dark:border-secondary-400 dark:bg-surface">
        {/* El número va escrito en la pregunta, no solo en el botón de
            arriba: quien confirma tiene que leer a cuánta gente le escribe. */}
        <p className="text-lg font-bold text-ink">
          Se van a enviar {pending} {pending === 1 ? "correo" : "correos"} a{" "}
          {pending === 1 ? `1 ${noun}` : `${pending} ${nounPlural}`} de{" "}
          {portalName}.
        </p>
        <p className="mt-2 text-base text-ink-soft">
          Esto no se puede deshacer. Quien ya fue notificado no vuelve a recibir
          el aviso.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-60"
          >
            {isPending
              ? "Enviando…"
              : `Sí, enviar ${pending} ${pending === 1 ? "correo" : "correos"}`}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="min-h-[48px] rounded-lg border-2 border-rule px-6 py-3 text-lg font-semibold text-ink transition-colors hover:bg-paper focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
    >
      {label}
    </button>
  );
}

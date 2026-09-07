"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { approveJob, rejectJob } from "@/app/actions/admin";

const MIN_REASON = 10;

export function ModerationActions({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveJob(jobId);
      if (result.success) toast.success(`Aviso aprobado: ${jobTitle}`);
      else toast.error(result.error ?? "No se pudo aprobar");
    });
  };

  const handleReject = () => {
    if (reason.trim().length < MIN_REASON) {
      toast.error(`El motivo necesita al menos ${MIN_REASON} caracteres`);
      return;
    }
    startTransition(async () => {
      const result = await rejectJob(jobId, reason);
      if (result.success) {
        toast.success(
          "Aviso rechazado. La empresa puede corregirlo y volver a enviarlo."
        );
        setShowReject(false);
        setReason("");
      } else {
        toast.error(result.error ?? "No se pudo rechazar");
      }
    });
  };

  return (
    <div className="border-t-2 border-gray-200 pt-4 dark:border-gray-700">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleApprove}
          disabled={isPending}
          className="min-h-[48px] rounded-lg bg-success-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-success-700 focus:outline-none focus:ring-4 focus:ring-success-300 disabled:opacity-60"
        >
          Aprobar y publicar
        </button>
        <button
          type="button"
          onClick={() => setShowReject((v) => !v)}
          disabled={isPending}
          aria-expanded={showReject}
          aria-controls={`reject-${jobId}`}
          className="min-h-[48px] rounded-lg border-2 border-red-600 px-6 py-3 text-lg font-semibold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950"
        >
          Rechazar
        </button>
      </div>

      {showReject && (
        <div id={`reject-${jobId}`} className="mt-4">
          <label
            htmlFor={`reason-${jobId}`}
            className="mb-2 block text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            Motivo del rechazo
          </label>
          <p className="mb-2 text-base text-gray-600 dark:text-gray-400">
            La empresa lo va a leer. Sé concreto para que pueda corregirlo.
          </p>
          <textarea
            id={`reason-${jobId}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Ejemplo: la descripción no indica las tareas del puesto."
          />
          <button
            type="button"
            onClick={handleReject}
            disabled={isPending}
            className="mt-3 min-h-[48px] rounded-lg bg-red-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-60"
          >
            Confirmar rechazo
          </button>
        </div>
      )}
    </div>
  );
}

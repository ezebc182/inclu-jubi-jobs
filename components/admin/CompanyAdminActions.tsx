"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  setCompanySuspension,
  setCompanyVerification,
} from "@/app/actions/admin";

const MIN_REASON = 10;

export function CompanyAdminActions({
  companyId,
  companyName,
  isVerified,
  autoApproveJobs,
  isActive,
}: {
  companyId: string;
  companyName: string;
  isVerified: boolean;
  autoApproveJobs: boolean;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [showSuspend, setShowSuspend] = useState(false);
  const [reason, setReason] = useState("");

  const run = (
    fn: () => Promise<{ success: boolean; error?: string }>,
    okMessage: string
  ) => {
    startTransition(async () => {
      const result = await fn();
      if (result.success) toast.success(okMessage);
      else toast.error(result.error ?? "No se pudo completar la acción");
    });
  };

  return (
    <div className="flex flex-col gap-4 border-t-2 border-gray-200 pt-4 dark:border-gray-700">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            run(
              () =>
                setCompanyVerification(companyId, {
                  isVerified: !isVerified,
                  autoApproveJobs: !isVerified ? autoApproveJobs : false,
                }),
              isVerified ? "Verificación retirada" : `${companyName} verificada`
            )
          }
          className="min-h-[48px] rounded-lg border-2 border-primary-600 px-5 py-3 text-lg font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-60 dark:text-primary-300 dark:hover:bg-gray-700"
        >
          {isVerified ? "Quitar verificación" : "Verificar empresa"}
        </button>

        {isVerified && (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(
                () =>
                  setCompanyVerification(companyId, {
                    isVerified: true,
                    autoApproveJobs: !autoApproveJobs,
                  }),
                autoApproveJobs
                  ? "Sus avisos vuelven a pasar por moderación"
                  : "Sus avisos se publican sin moderación"
              )
            }
            className="min-h-[48px] rounded-lg border-2 border-gray-400 px-5 py-3 text-lg font-semibold text-gray-800 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-60 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {autoApproveJobs
              ? "Exigir moderación"
              : "Permitir publicar directo"}
          </button>
        )}

        {isActive ? (
          <button
            type="button"
            disabled={isPending}
            aria-expanded={showSuspend}
            onClick={() => setShowSuspend((v) => !v)}
            className="min-h-[48px] rounded-lg border-2 border-red-600 px-5 py-3 text-lg font-semibold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950"
          >
            Suspender
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(
                () => setCompanySuspension(companyId, { suspend: false }),
                `${companyName} reactivada`
              )
            }
            className="min-h-[48px] rounded-lg bg-success-600 px-5 py-3 text-lg font-bold text-white transition-colors hover:bg-success-700 focus:outline-none focus:ring-4 focus:ring-success-300 disabled:opacity-60"
          >
            Reactivar
          </button>
        )}
      </div>

      {showSuspend && isActive && (
        <div>
          <label
            htmlFor={`suspend-reason-${companyId}`}
            className="mb-2 block text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            Motivo de la suspensión
          </label>
          <p className="mb-2 text-base text-gray-600 dark:text-gray-400">
            Al suspender, sus avisos publicados se pausan automáticamente.
          </p>
          <textarea
            id={`suspend-reason-${companyId}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (reason.trim().length < MIN_REASON) {
                toast.error(
                  `El motivo necesita al menos ${MIN_REASON} caracteres`
                );
                return;
              }
              run(
                () =>
                  setCompanySuspension(companyId, { suspend: true, reason }),
                "Empresa suspendida"
              );
              setShowSuspend(false);
              setReason("");
            }}
            className="mt-3 min-h-[48px] rounded-lg bg-red-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-60"
          >
            Confirmar suspensión
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setUserRole, setUserSuspension } from "@/app/actions/admin";

type Role = "CANDIDATE" | "COMPANY" | "ADMIN";

const MIN_REASON = 10;

const ROLE_OPTIONS: Array<{ value: Role; label: string }> = [
  { value: "CANDIDATE", label: "Candidato/a" },
  { value: "COMPANY", label: "Empresa" },
  { value: "ADMIN", label: "Administrador/a" },
];

export function UserAdminActions({
  userId,
  userLabel,
  role,
  isActive,
  isSelf,
}: {
  userId: string;
  userLabel: string;
  /** Puede venir vacío: quien no eligió todavía en /onboarding. */
  role: Role | null;
  isActive: boolean;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [showSuspend, setShowSuspend] = useState(false);
  const [reason, setReason] = useState("");

  // Sobre la propia cuenta no se opera: evita que un admin se deje afuera.
  if (isSelf) {
    return (
      <p className="border-t-2 border-rule pt-4 text-base text-ink-soft">
        Esta es tu propia cuenta. Pedile a otro administrador que haga cambios
        sobre ella.
      </p>
    );
  }

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
    <div className="flex flex-col gap-4 border-t-2 border-rule pt-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor={`role-${userId}`}
            className="mb-1 block text-base font-semibold text-ink-soft"
          >
            Rol
          </label>
          <select
            id={`role-${userId}`}
            defaultValue={role ?? ""}
            disabled={isPending}
            onChange={(e) =>
              run(
                () => setUserRole(userId, e.target.value as Role),
                `Rol actualizado para ${userLabel}`
              )
            }
            className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg dark:bg-surface"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isActive ? (
          <button
            type="button"
            disabled={isPending}
            aria-expanded={showSuspend}
            onClick={() => setShowSuspend((v) => !v)}
            className="min-h-[48px] rounded-lg border-2 border-red-600 px-5 py-3 text-lg font-semibold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950"
          >
            Suspender cuenta
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(
                () => setUserSuspension(userId, { suspend: false }),
                `${userLabel} reactivado`
              )
            }
            className="min-h-[48px] rounded-lg bg-success-600 px-5 py-3 text-lg font-bold text-white transition-colors hover:bg-success-700 focus:outline-none focus:ring-4 focus:ring-success-300 disabled:opacity-60"
          >
            Reactivar cuenta
          </button>
        )}
      </div>

      {showSuspend && isActive && (
        <div>
          <label
            htmlFor={`user-reason-${userId}`}
            className="mb-2 block text-lg font-bold text-ink-soft"
          >
            Motivo de la suspensión
          </label>
          <p className="mb-2 text-base text-ink-soft">
            Se cierran todas sus sesiones abiertas.
          </p>
          <textarea
            id={`user-reason-${userId}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:bg-surface"
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
                () => setUserSuspension(userId, { suspend: true, reason }),
                `${userLabel} suspendido`
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

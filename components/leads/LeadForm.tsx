"use client";

import { useId, useState, useTransition } from "react";
import type { LeadKind } from "@prisma/client";
import { subscribeLead } from "@/app/actions/leads";
import { ProvinceSelect } from "@/components/forms/ProvinceSelect";

/**
 * Formulario de lista de espera: dos campos y nada más.
 *
 * Sin Google, sin onboarding, sin elegir rol. Quien llega acá todavía no vio
 * un solo empleo; pedirle que se registre entero para decir "avisame" es
 * exactamente por qué hoy se va sin dejar rastro.
 *
 * Al enviar, el formulario se REEMPLAZA por la confirmación en el mismo
 * lugar. No se usa toast a propósito: desaparece a los cinco segundos, y
 * para esta audiencia eso es información perdida —quien usa lector de
 * pantalla, quien lee despacio, o simplemente quien miró para otro lado—.
 */

interface LeadFormProps {
  kind: LeadKind;
  title: string;
  description: string;
  submitLabel: string;
  /** Qué se muestra en lugar del formulario una vez enviado. */
  confirmationTitle: string;
  confirmationBody: string;
  /** El checkbox de remoto solo tiene sentido para quien busca trabajo. */
  showRemote?: boolean;
}

export function LeadForm({
  kind,
  title,
  description,
  submitLabel,
  confirmationTitle,
  confirmationBody,
  showRemote = false,
}: LeadFormProps) {
  const formId = useId();
  const emailId = `${formId}-email`;
  const errorId = `${formId}-error`;
  const remoteId = `${formId}-remote`;

  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [wantsRemote, setWantsRemote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await subscribeLead({
        email,
        kind,
        province: province || null,
        wantsRemote,
      });

      if (result.success) setSent(true);
      else setError(result.error ?? "No pudimos guardar tu correo");
    });
  };

  if (sent) {
    return (
      <div
        // `role="status"` lo anuncia el lector de pantalla sin robar el foco,
        // y el texto queda en pantalla: nadie se pierde la confirmación por
        // tardar en leerla.
        role="status"
        // El texto se fija explícito en cada tema en vez de usar `text-ink`:
        // el token de tinta se invierte en oscuro y quedaría texto claro
        // sobre el verde claro del fondo. La escala de `success` llega a 900,
        // no hay 950.
        className="rounded-xl border-2 border-success-600 bg-success-50 p-6 dark:border-success-400 dark:bg-success-900"
      >
        <h3 className="text-2xl font-bold text-success-900 dark:text-success-50">
          {confirmationTitle}
        </h3>
        <p className="mt-3 text-lg text-success-800 dark:text-success-100">
          {confirmationBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-rule bg-surface p-6"
    >
      <h3 className="text-2xl font-bold text-ink">{title}</h3>
      <p className="mt-2 text-lg text-ink-soft">{description}</p>

      <div className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor={emailId} className="text-lg font-bold text-ink">
            Correo electrónico
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          </label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
            placeholder="tucorreo@ejemplo.com"
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            className="min-h-[48px] rounded-lg border border-rule bg-surface px-4 py-3 text-lg text-ink focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-300"
          />
        </div>

        <ProvinceSelect
          value={province}
          onChange={setProvince}
          label="Provincia (opcional)"
        />

        {showRemote && (
          <div className="flex items-start gap-3">
            <input
              id={remoteId}
              type="checkbox"
              checked={wantsRemote}
              onChange={(e) => setWantsRemote(e.target.checked)}
              className="mt-1 h-6 w-6 shrink-0 rounded border-2 border-rule text-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-300"
            />
            <label
              htmlFor={remoteId}
              // El área clickeable llega a 48px por el padding vertical, sin
              // agrandar la caja visual del checkbox.
              className="min-h-[48px] py-2 text-lg text-ink"
            >
              También me interesa trabajo remoto
            </label>
          </div>
        )}

        {error && (
          // El error se anuncia y además se ve: nunca solo por color.
          <p
            id={errorId}
            role="alert"
            className="text-lg font-semibold text-red-700 dark:text-red-400"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="min-h-[48px] rounded-lg bg-primary-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-60"
        >
          {isPending ? "Guardando…" : submitLabel}
        </button>

        <p className="text-base text-ink-soft">
          Solo usamos tu correo para avisarte. No te vamos a escribir por otra
          cosa.
        </p>
      </div>
    </form>
  );
}

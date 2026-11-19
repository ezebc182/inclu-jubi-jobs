"use client";

import { useState } from "react";
import { CALL_SLOT_LABELS, type CallSlot } from "@/lib/postulacion";

type Result = { success: boolean; error?: string };

/** Usted en JubiJobs, vos en IncluJobs (ver PRODUCT.md). */
const COPY = {
  JUBI: {
    lead: "Deje su teléfono y la empresa lo/la llama. No hace falta escribir nada más: le mandamos las respuestas de su perfil.",
    phone: "Su teléfono",
    slot: "¿Cuándo prefiere que lo/la llamen?",
    retry: "Hubo un problema al enviar. Intente de nuevo en un momento.",
  },
  INCLU: {
    lead: "Dejá tu teléfono y la empresa te llama. No hace falta escribir nada más: le mandamos las respuestas de tu perfil.",
    phone: "Tu teléfono",
    slot: "¿Cuándo preferís que te llamen?",
    retry: "Hubo un problema al enviar. Probá de nuevo en un momento.",
  },
} as const;

export function CallMeForm({
  action,
  portal,
  initialPhone = "",
}: {
  action: (input: { phone: string; slot: string }) => Promise<Result>;
  portal: keyof typeof COPY;
  initialPhone?: string;
}) {
  const copy = COPY[portal];
  const [phone, setPhone] = useState(initialPhone);
  const [slot, setSlot] = useState<CallSlot>("ANYTIME");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      // Si sale bien, la página se revalida y muestra la confirmación.
      const result = await action({ phone, slot });
      if (!result.success) setError(result.error ?? "No se pudo enviar");
    } catch {
      setError(copy.retry);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <p className="text-lg text-ink-soft">{copy.lead}</p>

      <div className="flex flex-col gap-2">
        <label htmlFor="call-phone" className="text-lg font-bold text-ink">
          {copy.phone}
        </label>
        <input
          id="call-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="11 4567 8901"
          aria-invalid={!!error}
          aria-describedby={error ? "call-error" : undefined}
          className="min-h-[56px] rounded-lg border-2 border-rule px-4 text-xl focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          required
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-lg font-bold text-ink">{copy.slot}</legend>
        {(Object.keys(CALL_SLOT_LABELS) as CallSlot[]).map((value) => (
          <label
            key={value}
            className="flex min-h-[56px] cursor-pointer items-center gap-4 rounded-lg border-2 border-rule bg-surface px-4 text-lg text-ink has-[:checked]:border-primary-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-300"
          >
            <input
              type="radio"
              name="call-slot"
              value={value}
              checked={slot === value}
              onChange={() => setSlot(value)}
              className="h-6 w-6 shrink-0 accent-primary-600"
            />
            {CALL_SLOT_LABELS[value]}
          </label>
        ))}
      </fieldset>

      {error && (
        <p
          id="call-error"
          role="alert"
          className="text-lg font-semibold text-red-700 dark:text-red-400"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-[56px] items-center justify-center rounded-lg bg-primary-600 px-8 py-4 text-xl font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Enviando..." : "Postularme para que me llamen"}
      </button>
    </form>
  );
}

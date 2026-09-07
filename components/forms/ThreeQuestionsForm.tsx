"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

type Answers = { did: string; canDo: string; wantToDo: string };

interface ThreeQuestionsFormProps {
  initialValues?: Answers;
  /**
   * Server action que recibe las respuestas. Se importa desde el módulo de
   * actions y se pasa por referencia — nunca como closure creada en el
   * componente servidor.
   */
  action: (values: Answers) => Promise<{ success: boolean; error?: string }>;
  submitLabel?: string;
}

const MIN_LENGTH = 10;
const HINT = `Por favor, contanos un poco más (mínimo ${MIN_LENGTH} caracteres)`;

export function ThreeQuestionsForm({
  initialValues,
  action,
  submitLabel = "Enviar postulación",
}: ThreeQuestionsFormProps) {
  const [values, setValues] = useState<Answers>({
    did: initialValues?.did || "",
    canDo: initialValues?.canDo || "",
    wantToDo: initialValues?.wantToDo || "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Answers, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Partial<Record<keyof Answers, string>> = {};
    (Object.keys(values) as Array<keyof Answers>).forEach((field) => {
      if (values[field].trim().length < MIN_LENGTH) newErrors[field] = HINT;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // WCAG 3.3.1: llevamos el foco al resumen para que el lector de
      // pantalla anuncie los errores en vez de dejar al usuario a ciegas.
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await action(values);
      if (!result.success) {
        toast.error(result.error ?? "No pudimos enviar tu postulación");
      }
    } catch {
      toast.error("Hubo un problema al enviar. Probá de nuevo en un momento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorList = (
    Object.entries(errors) as Array<[keyof Answers, string]>
  ).filter(([, message]) => Boolean(message));

  const FIELD_LABELS: Record<keyof Answers, string> = {
    did: "¿Qué hiciste?",
    canDo: "¿Qué sabés hacer?",
    wantToDo: "¿Qué te gustaría hacer?",
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {errorList.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border-2 border-red-600 bg-red-50 p-5 dark:border-red-500 dark:bg-red-950"
        >
          <h3 className="mb-2 text-lg font-bold text-red-900 dark:text-red-200">
            Revisá{" "}
            {errorList.length === 1
              ? "este campo"
              : `estos ${errorList.length} campos`}
            :
          </h3>
          <ul className="list-inside list-disc space-y-1 text-lg text-red-800 dark:text-red-300">
            {errorList.map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`} className="underline">
                  {FIELD_LABELS[field]}
                </a>
                : {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="did"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          ¿Qué hiciste?
          <span className="ml-1 text-red-600">*</span>
        </label>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Contanos sobre tu experiencia laboral o actividades anteriores.
        </p>
        <textarea
          id="did"
          value={values.did}
          onChange={(e) => setValues({ ...values, did: e.target.value })}
          rows={4}
          className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Ejemplo: Trabajé 30 años en el sector bancario..."
          aria-invalid={!!errors.did}
          aria-describedby={errors.did ? "did-error" : undefined}
          required
        />
        {errors.did && (
          <p
            id="did-error"
            className="flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-red-400"
            role="alert"
          >
            <span aria-hidden="true">⚠️</span>
            {errors.did}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="canDo"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          ¿Qué sabés hacer?
          <span className="ml-1 text-red-600">*</span>
        </label>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Contanos sobre tus habilidades y conocimientos.
        </p>
        <textarea
          id="canDo"
          value={values.canDo}
          onChange={(e) => setValues({ ...values, canDo: e.target.value })}
          rows={4}
          className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Ejemplo: Sé usar computadoras, atender teléfonos..."
          aria-invalid={!!errors.canDo}
          aria-describedby={errors.canDo ? "canDo-error" : undefined}
          required
        />
        {errors.canDo && (
          <p
            id="canDo-error"
            className="flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-red-400"
            role="alert"
          >
            <span aria-hidden="true">⚠️</span>
            {errors.canDo}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="wantToDo"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          ¿Qué te gustaría hacer?
          <span className="ml-1 text-red-600">*</span>
        </label>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Contanos qué tipo de trabajo te gustaría realizar.
        </p>
        <textarea
          id="wantToDo"
          value={values.wantToDo}
          onChange={(e) => setValues({ ...values, wantToDo: e.target.value })}
          rows={4}
          className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Ejemplo: Me gustaría trabajar part-time atendiendo al público..."
          aria-invalid={!!errors.wantToDo}
          aria-describedby={errors.wantToDo ? "wantToDo-error" : undefined}
          required
        />
        {errors.wantToDo && (
          <p
            id="wantToDo-error"
            className="flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-red-400"
            role="alert"
          >
            <span aria-hidden="true">⚠️</span>
            {errors.wantToDo}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-[52px] items-center justify-center gap-3 rounded-lg bg-primary-600 px-8 py-4 text-xl font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <div
              className="border-3 h-6 w-6 animate-spin rounded-full border-white border-t-transparent"
              aria-hidden="true"
            />
            <span>Enviando...</span>
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

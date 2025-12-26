"use client";

import { useState } from "react";

interface ThreeQuestionsFormProps {
  initialValues?: {
    did: string;
    canDo: string;
    wantToDo: string;
  };
  onSubmit: (values: {
    did: string;
    canDo: string;
    wantToDo: string;
  }) => Promise<void>;
  submitLabel?: string;
}

export function ThreeQuestionsForm({
  initialValues,
  onSubmit,
  submitLabel = "Enviar postulación",
}: ThreeQuestionsFormProps) {
  const [values, setValues] = useState({
    did: initialValues?.did || "",
    canDo: initialValues?.canDo || "",
    wantToDo: initialValues?.wantToDo || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (values.did.length < 10)
      newErrors.did = "Por favor, contanos un poco más (mínimo 10 caracteres)";
    if (values.canDo.length < 10)
      newErrors.canDo =
        "Por favor, contanos un poco más (mínimo 10 caracteres)";
    if (values.wantToDo.length < 10)
      newErrors.wantToDo =
        "Por favor, contanos un poco más (mínimo 10 caracteres)";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Error al enviar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="did" className="text-lg font-bold text-gray-900">
          ¿Qué hiciste?
          <span className="ml-1 text-red-600">*</span>
        </label>
        <p className="text-base text-gray-600">
          Contanos sobre tu experiencia laboral o actividades anteriores.
        </p>
        <textarea
          id="did"
          value={values.did}
          onChange={(e) => setValues({ ...values, did: e.target.value })}
          rows={4}
          className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="Ejemplo: Trabajé 30 años en el sector bancario..."
        />
        {errors.did && (
          <p className="text-lg font-semibold text-red-600">{errors.did}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="canDo" className="text-lg font-bold text-gray-900">
          ¿Qué sabés hacer?
          <span className="ml-1 text-red-600">*</span>
        </label>
        <p className="text-base text-gray-600">
          Contanos sobre tus habilidades y conocimientos.
        </p>
        <textarea
          id="canDo"
          value={values.canDo}
          onChange={(e) => setValues({ ...values, canDo: e.target.value })}
          rows={4}
          className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="Ejemplo: Sé usar computadoras, atender teléfonos..."
        />
        {errors.canDo && (
          <p className="text-lg font-semibold text-red-600">{errors.canDo}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="wantToDo" className="text-lg font-bold text-gray-900">
          ¿Qué te gustaría hacer?
          <span className="ml-1 text-red-600">*</span>
        </label>
        <p className="text-base text-gray-600">
          Contanos qué tipo de trabajo te gustaría realizar.
        </p>
        <textarea
          id="wantToDo"
          value={values.wantToDo}
          onChange={(e) => setValues({ ...values, wantToDo: e.target.value })}
          rows={4}
          className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="Ejemplo: Me gustaría trabajar part-time atendiendo al público..."
        />
        {errors.wantToDo && (
          <p className="text-lg font-semibold text-red-600">
            {errors.wantToDo}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-[52px] rounded-lg bg-primary-600 px-8 py-4 text-xl font-bold text-white hover:bg-primary-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-primary-300"
      >
        {isSubmitting ? "Enviando..." : submitLabel}
      </button>
    </form>
  );
}

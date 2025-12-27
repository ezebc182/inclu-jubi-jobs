"use client";

import { useState } from "react";
import { MODALITIES, SCHEDULES } from "@/lib/constants";
import { createJob } from "@/app/actions/jobs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function JobForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("tags", JSON.stringify(tags));

    try {
      const result = await createJob(formData);
      if (result.success) {
        toast.success("✅ ¡Empleo publicado exitosamente!", {
          description: "Tu oferta laboral ya está visible para todos los candidatos. Vas a recibir notificaciones cuando alguien se postule",
          duration: 7000,
        });
        (e.target as HTMLFormElement).reset();
        setTags([]);
        // Redirigir a la página /empresa que mostrará la tab de empleos por defecto
        router.push("/empresa");
        router.refresh();
      }
    } catch (error: any) {
      toast.error("❌ No se pudo publicar el empleo", {
        description: error.message || "Por favor, verificá los datos del formulario e intentá nuevamente",
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Título del puesto
          <span className="ml-1 text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          minLength={5}
          maxLength={100}
          className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          placeholder="Ej: Administrativo part-time"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          Descripción del puesto
          <span className="ml-1 text-red-600 dark:text-red-400">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          maxLength={3000}
          rows={6}
          className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          placeholder="Describí las tareas, requisitos y cualquier información relevante..."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="province" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Provincia
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          </label>
          <select
            id="province"
            name="province"
            required
            className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Seleccioná tu provincia</option>
            {["CABA", "Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos", "Salta", "Misiones", "Chaco", "Chubut", "Corrientes", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Neuquén", "Río Negro", "San Juan", "San Luis", "Santa Cruz", "Santiago del Estero", "Tierra del Fuego"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Ciudad (opcional)
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            placeholder="Ej: Córdoba Capital"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="modality"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            Modalidad
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          </label>
          <select
            id="modality"
            name="modality"
            required
            className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Seleccioná modalidad</option>
            {MODALITIES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="schedule"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            Jornada
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          </label>
          <select
            id="schedule"
            name="schedule"
            required
            className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Seleccioná jornada</option>
            {SCHEDULES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="salaryArsMin"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            Salario mínimo (ARS, opcional)
          </label>
          <input
            type="number"
            id="salaryArsMin"
            name="salaryArsMin"
            min="0"
            step="1000"
            className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            placeholder="250000"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="salaryArsMax"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            Salario máximo (ARS, opcional)
          </label>
          <input
            type="number"
            id="salaryArsMax"
            name="salaryArsMax"
            min="0"
            step="1000"
            className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            placeholder="350000"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Etiquetas (opcional, máx 10)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="min-h-[48px] flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            placeholder="Ej: Atención al cliente"
            disabled={tags.length >= 10}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || tags.length >= 10}
            className="rounded-lg bg-gray-600 px-6 py-3 text-lg font-semibold text-white hover:bg-gray-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600"
          >
            Agregar
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-base font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="text-primary-900 hover:text-primary-950 dark:text-primary-200 dark:hover:text-primary-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-[52px] items-center justify-center gap-3 rounded-lg bg-primary-600 px-8 py-4 text-xl font-bold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {isSubmitting ? (
          <>
            <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" aria-hidden="true" />
            <span>Publicando empleo...</span>
          </>
        ) : (
          "Publicar empleo"
        )}
      </button>
    </form>
  );
}

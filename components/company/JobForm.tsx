"use client";

import { useState } from "react";
import { MODALITIES, PROVINCIAS_AR, SCHEDULES } from "@/lib/constants";
import { createJob } from "@/app/actions/jobs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PortalChoice = "JUBI" | "INCLU";

const PORTAL_OPTIONS: Array<{
  value: PortalChoice;
  label: string;
  hint: string;
}> = [
  {
    value: "JUBI",
    label: "JubiJobs",
    hint: "Personas jubiladas y mayores de 60 años",
  },
  {
    value: "INCLU",
    label: "InclúJobs",
    hint: "Personas con discapacidad. Requiere declarar las condiciones de accesibilidad del puesto.",
  },
];

export function JobForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [portals, setPortals] = useState<PortalChoice[]>(["JUBI"]);
  const [access, setAccess] = useState({
    isRemoteFriendly: false,
    hasAccessibleSite: false,
    supportsFlexHours: false,
  });

  const publishesToInclu = portals.includes("INCLU");

  const togglePortal = (value: PortalChoice) => {
    setPortals((current) =>
      current.includes(value)
        ? current.filter((p) => p !== value)
        : [...current, value]
    );
  };

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (value && tags.length < 10 && !tags.includes(value)) {
      setTags([...tags, value]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (portals.length === 0) {
      toast.error("Elegí al menos un portal donde publicar el aviso");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("tags", JSON.stringify(tags));
    formData.set("portals", JSON.stringify(portals));
    formData.set("isRemoteFriendly", String(access.isRemoteFriendly));
    formData.set("hasAccessibleSite", String(access.hasAccessibleSite));
    formData.set("supportsFlexHours", String(access.supportsFlexHours));

    setIsSubmitting(true);
    try {
      const result = await createJob(formData);
      if (result.success) {
        if (result.pendingReview) {
          toast.success("Aviso enviado a revisión", {
            description:
              "Lo vamos a revisar y se publica en cuanto quede aprobado. Te avisamos por email.",
            duration: 8000,
          });
        } else {
          toast.success("Aviso publicado", {
            description:
              "Ya está visible para los candidatos. Te avisamos cuando alguien se postule.",
            duration: 7000,
          });
        }
        form.reset();
        setTags([]);
        setPortals(["JUBI"]);
        setAccess({
          isRemoteFriendly: false,
          hasAccessibleSite: false,
          supportsFlexHours: false,
        });
        router.push("/empresa");
        router.refresh();
      }
    } catch (error) {
      toast.error("No se pudo publicar el aviso", {
        description:
          error instanceof Error
            ? error.message
            : "Revisá los datos del formulario e intentá de nuevo.",
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset className="rounded-lg border-2 border-primary-300 p-5 dark:border-primary-700">
        <legend className="px-2 text-lg font-bold text-ink">
          ¿Dónde querés publicar este aviso?
          <span className="ml-1 text-red-600 dark:text-red-400">*</span>
        </legend>
        <p className="mb-4 text-base text-ink-soft">
          Son dos portales con públicos distintos. Podés elegir uno o los dos,
          según a quién le sirva este puesto.
        </p>
        <div className="flex flex-col gap-4">
          {PORTAL_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-3 hover:bg-primary-50"
            >
              <input
                type="checkbox"
                checked={portals.includes(option.value)}
                onChange={() => togglePortal(option.value)}
                className="mt-1 h-6 w-6 rounded border-2 border-rule text-primary-600 focus:ring-4 focus:ring-primary-300"
              />
              <span>
                <span className="block text-lg font-semibold text-ink">
                  {option.label}
                </span>
                <span className="block text-base text-ink-soft">
                  {option.hint}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="title"
          className="text-lg font-bold text-ink"
        >
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
          className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 "
          placeholder="Ej: Administrativo part-time"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-lg font-bold text-ink"
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
          className="rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 "
          placeholder="Describí las tareas, requisitos y cualquier información relevante..."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="province"
            className="text-lg font-bold text-ink"
          >
            Provincia
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          </label>
          <select
            id="province"
            name="province"
            required
            className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="">Seleccioná tu provincia</option>
            {PROVINCIAS_AR.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="city"
            className="text-lg font-bold text-ink"
          >
            Ciudad (opcional)
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 "
            placeholder="Ej: Córdoba Capital"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="modality"
            className="text-lg font-bold text-ink"
          >
            Modalidad
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          </label>
          <select
            id="modality"
            name="modality"
            required
            className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
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
            className="text-lg font-bold text-ink"
          >
            Jornada
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          </label>
          <select
            id="schedule"
            name="schedule"
            required
            className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
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
            className="text-lg font-bold text-ink"
          >
            Salario mínimo (ARS, opcional)
          </label>
          <input
            type="number"
            id="salaryArsMin"
            name="salaryArsMin"
            min="0"
            step="1000"
            className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 "
            placeholder="250000"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="salaryArsMax"
            className="text-lg font-bold text-ink"
          >
            Salario máximo (ARS, opcional)
          </label>
          <input
            type="number"
            id="salaryArsMax"
            name="salaryArsMax"
            min="0"
            step="1000"
            className="min-h-[48px] rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 "
            placeholder="350000"
          />
        </div>
      </div>

      <fieldset
        className={`rounded-lg border-2 p-5 ${
          publishesToInclu
            ? "border-primary-400 bg-primary-50 dark:border-primary-600 dark:bg-primary-950"
            : "border-rule"
        }`}
      >
        <legend className="px-2 text-lg font-bold text-ink">
          Condiciones de accesibilidad del puesto
          {publishesToInclu && (
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          )}
        </legend>
        <p className="mb-4 text-base text-ink-soft">
          {publishesToInclu
            ? "Publicás en InclúJobs, así que necesitamos al menos un dato acá. El candidato lo lee antes de postularse: sin esta información no puede saber si el puesto le sirve."
            : "Opcional, pero suma: ayuda a que más candidatos se animen a postularse."}
        </p>

        <div className="flex flex-col gap-3">
          {(
            [
              {
                key: "hasAccessibleSite",
                label: "Instalaciones adaptadas",
                hint: "Acceso sin escaleras, ascensor y baño accesible",
              },
              {
                key: "supportsFlexHours",
                label: "Horarios flexibles",
                hint: "Se pueden ajustar según tratamientos o necesidades",
              },
              {
                key: "isRemoteFriendly",
                label: "Se puede trabajar de forma remota",
                hint: "Total o parcialmente desde casa",
              },
            ] as const
          ).map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-white/60/60"
            >
              <input
                type="checkbox"
                checked={access[item.key]}
                onChange={(e) =>
                  setAccess((current) => ({
                    ...current,
                    [item.key]: e.target.checked,
                  }))
                }
                className="mt-1 h-6 w-6 rounded border-2 border-rule text-primary-600 focus:ring-4 focus:ring-primary-300"
              />
              <span>
                <span className="block text-lg font-semibold text-ink">
                  {item.label}
                </span>
                <span className="block text-base text-ink-soft">
                  {item.hint}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label
            htmlFor="accessibilityNotes"
            className="text-lg font-semibold text-ink"
          >
            Detalles adicionales
          </label>
          <textarea
            id="accessibilityNotes"
            name="accessibilityNotes"
            rows={3}
            maxLength={1000}
            className="rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 "
            placeholder="Ej: la oficina está en planta baja, tenemos lector de pantalla instalado y el equipo maneja lengua de señas básica."
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="tag-input"
          className="text-lg font-bold text-ink"
        >
          Etiquetas (opcional, máx 10)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="min-h-[48px] flex-1 rounded-lg border-2 border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 "
            placeholder="Ej: Atención al cliente"
            disabled={tags.length >= 10}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || tags.length >= 10}
            className="rounded-lg bg-primary-700 px-6 py-3 text-lg font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50"
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
                  aria-label={`Quitar la etiqueta ${tag}`}
                  className="text-primary-900 hover:text-primary-950 dark:text-primary-200 dark:hover:text-primary-100"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-[52px] items-center justify-center gap-3 rounded-lg bg-primary-600 px-8 py-4 text-xl font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {isSubmitting ? (
          <>
            <div
              className="border-3 h-6 w-6 animate-spin rounded-full border-white border-t-transparent"
              aria-hidden="true"
            />
            <span>Publicando empleo...</span>
          </>
        ) : (
          "Publicar empleo"
        )}
      </button>
    </form>
  );
}

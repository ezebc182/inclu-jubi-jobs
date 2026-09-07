"use client";

import { PROVINCIAS_AR, MODALITIES, SCHEDULES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const FIELD =
  "min-h-[44px] w-full rounded-md border border-rule bg-surface px-3 py-2 text-base text-ink focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600";

const LABEL = "mb-1.5 block text-base font-medium text-ink";

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [province, setProvince] = useState(searchParams.get("provincia") || "");
  const [modality, setModality] = useState(searchParams.get("modalidad") || "");
  const [schedule, setSchedule] = useState(searchParams.get("jornada") || "");
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const hasFilters = Boolean(province || modality || schedule || search);

  // Es un <form>: antes era un div con botones, así que presionar Enter
  // en el campo de búsqueda no hacía nada.
  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (province) params.set("provincia", province);
    if (modality) params.set("modalidad", modality);
    if (schedule) params.set("jornada", schedule);
    if (search) params.set("q", search);

    router.push(`/empleos?${params.toString()}`);
  };

  const clearFilters = () => {
    setProvince("");
    setModality("");
    setSchedule("");
    setSearch("");
    router.push("/empleos");
  };

  return (
    <form
      onSubmit={applyFilters}
      role="search"
      aria-labelledby="filtros-titulo"
      className="border border-rule bg-surface p-5"
    >
      <h2 id="filtros-titulo" className="font-display text-lg font-semibold">
        Buscar
      </h2>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label htmlFor="search" className={LABEL}>
            Palabra clave
          </label>
          <input
            type="search"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Administrativo, atención al cliente…"
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="province" className={LABEL}>
            Provincia
          </label>
          <select
            id="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className={FIELD}
          >
            <option value="">Todas</option>
            {PROVINCIAS_AR.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="modality" className={LABEL}>
            Modalidad
          </label>
          <select
            id="modality"
            value={modality}
            onChange={(e) => setModality(e.target.value)}
            className={FIELD}
          >
            <option value="">Todas</option>
            {MODALITIES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="schedule" className={LABEL}>
            Jornada
          </label>
          <select
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className={FIELD}
          >
            <option value="">Todas</option>
            {SCHEDULES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 min-h-[44px] w-full rounded-md bg-primary-600 px-4 text-base font-semibold text-white transition-colors hover:bg-primary-700"
      >
        Aplicar filtros
      </button>

      {/* Solo aparece cuando hay algo que limpiar: un botón permanentemente
          inútil es ruido. */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mt-2 min-h-[44px] w-full rounded-md px-4 text-base font-medium text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
        >
          Quitar filtros
        </button>
      )}
    </form>
  );
}

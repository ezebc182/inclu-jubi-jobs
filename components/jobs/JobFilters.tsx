"use client";

import { PROVINCIAS_AR, MODALITIES, SCHEDULES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [province, setProvince] = useState(searchParams.get("provincia") || "");
  const [modality, setModality] = useState(searchParams.get("modalidad") || "");
  const [schedule, setSchedule] = useState(searchParams.get("jornada") || "");
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const applyFilters = () => {
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
    <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-6 transition-colors dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Filtros de búsqueda
      </h2>

      <div className="mb-4 flex flex-col gap-2">
        <label
          htmlFor="search"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          Buscar por palabra clave
        </label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ej: administrativo, atención al cliente..."
          className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-2 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <label
          htmlFor="province"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          Provincia
        </label>
        <select
          id="province"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-2 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="">Todas las provincias</option>
          {PROVINCIAS_AR.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <label
          htmlFor="modality"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          Modalidad
        </label>
        <select
          id="modality"
          value={modality}
          onChange={(e) => setModality(e.target.value)}
          className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-2 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="">Todas las modalidades</option>
          {MODALITIES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <label
          htmlFor="schedule"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          Jornada
        </label>
        <select
          id="schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-2 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="">Todas las jornadas</option>
          {SCHEDULES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={applyFilters}
          className="flex-1 rounded-lg bg-primary-600 px-6 py-3 text-lg font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          Aplicar filtros
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 rounded-lg bg-gray-300 px-6 py-3 text-lg font-bold text-gray-900 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}

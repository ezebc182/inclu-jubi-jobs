"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSavedSearch, saveSearch } from "@/app/actions/saved-searches";
import { toast } from "sonner";

interface SavedSearch {
  id: string;
  name: string;
  province: string | null;
  modality: string | null;
  schedule: string | null;
  createdAt: Date;
}

interface SavedSearchesProps {
  searches: SavedSearch[];
  currentFilters: {
    province?: string;
    modality?: string;
    schedule?: string;
  };
}

export function SavedSearches({
  searches,
  currentFilters,
}: SavedSearchesProps) {
  const router = useRouter();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saving, setSaving] = useState(false);

  const hasActiveFilters =
    currentFilters.province ||
    currentFilters.modality ||
    currentFilters.schedule;

  const handleSaveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.set("name", saveName);
    if (currentFilters.province)
      formData.set("province", currentFilters.province);
    if (currentFilters.modality)
      formData.set("modality", currentFilters.modality);
    if (currentFilters.schedule)
      formData.set("schedule", currentFilters.schedule);

    const result = await saveSearch(formData);

    if (result.success) {
      toast.success("✅ Búsqueda guardada", {
        description: `Podés acceder rápidamente a "${saveName}" desde esta sección`,
        duration: 5000,
      });
      setSaveName("");
      setShowSaveDialog(false);
      router.refresh();
    } else {
      toast.error("❌ No se pudo guardar", {
        description: result.error || "Intentá nuevamente",
        duration: 5000,
      });
    }

    setSaving(false);
  };

  const handleApplySearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    if (search.province) params.set("provincia", search.province);
    if (search.modality) params.set("modalidad", search.modality);
    if (search.schedule) params.set("jornada", search.schedule);

    router.push(`/empleos?${params.toString()}`);

    toast.info("🔍 Filtros aplicados", {
      description: `Mostrando resultados para "${search.name}"`,
      duration: 4000,
    });
  };

  const handleDeleteSearch = async (searchId: string, searchName: string) => {
    if (!confirm(`¿Eliminar la búsqueda "${searchName}"?`)) {
      return;
    }

    const result = await deleteSavedSearch(searchId);

    if (result.success) {
      toast.success("✅ Búsqueda eliminada", {
        description: `"${searchName}" fue eliminada correctamente`,
        duration: 4000,
      });
      router.refresh();
    } else {
      toast.error("❌ Error al eliminar", {
        description: result.error || "Intentá nuevamente",
        duration: 5000,
      });
    }
  };

  return (
    <div className="rounded-lg border border-rule bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-ink">
          Búsquedas guardadas
        </h2>
        {hasActiveFilters && (
          <button
            onClick={() => setShowSaveDialog(!showSaveDialog)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-base font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            {showSaveDialog ? "Cancelar" : "+ Guardar"}
          </button>
        )}
      </div>

      {showSaveDialog && (
        <form
          onSubmit={handleSaveSearch}
          className="mb-6 rounded-lg bg-primary-50 p-4 transition-colors dark:bg-primary-950"
        >
          <label
            htmlFor="saveName"
            className="mb-2 block text-lg font-semibold text-ink"
          >
            Nombre de la búsqueda
          </label>
          <input
            type="text"
            id="saveName"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Ej: Empleos en CABA part-time"
            className="mb-3 min-h-[48px] w-full rounded-lg border border-rule px-4 py-2 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 "
            required
            minLength={3}
            autoFocus
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-primary-600 px-6 py-3 text-lg font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            {saving ? "Guardando..." : "Guardar búsqueda"}
          </button>
        </form>
      )}

      {searches.length === 0 ? (
        <div className="rounded-lg bg-paper p-6 text-center">
          <p className="mb-2 text-lg font-semibold text-ink-soft">
            No tenés búsquedas guardadas
          </p>
          <p className="text-base text-ink-soft">
            Aplicá filtros y guardá tus búsquedas favoritas para acceder
            rápidamente
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {searches.map((search) => (
            <div
              key={search.id}
              className="group rounded-lg border border-rule bg-paper p-4 transition-colors hover:border-primary-500 dark:hover:border-primary-400"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg font-bold text-ink">
                  {search.name}
                </h3>
                <button
                  onClick={() => handleDeleteSearch(search.id, search.name)}
                  className="text-base text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 dark:text-red-400 dark:hover:text-red-300"
                  aria-label={`Eliminar búsqueda ${search.name}`}
                >
                  ✕
                </button>
              </div>

              <div className="mb-3 flex flex-wrap gap-2 text-sm">
                {search.province && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-base font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    📍 {search.province}
                  </span>
                )}
                {search.modality && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-base font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">
                    {search.modality === "PRESENCIAL"
                      ? "🏢"
                      : search.modality === "REMOTO"
                        ? "🏠"
                        : "🔄"}{" "}
                    {search.modality}
                  </span>
                )}
                {search.schedule && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-base font-semibold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    ⏰{" "}
                    {search.schedule === "PART_TIME"
                      ? "Part-time"
                      : search.schedule === "FLEX"
                        ? "Flexible"
                        : "Por día"}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleApplySearch(search)}
                className="w-full rounded-lg bg-primary-600 px-4 py-2 text-lg font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Aplicar esta búsqueda
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

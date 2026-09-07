"use client";

import { PROVINCIAS_AR } from "@/lib/constants";

interface ProvinceSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

export function ProvinceSelect({
  value,
  onChange,
  label = "Provincia",
  required = false,
  error,
}: ProvinceSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-bold text-ink">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="min-h-[48px] rounded-lg border-2 border-rule bg-white px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
      >
        <option value="">Seleccioná tu provincia</option>
        {PROVINCIAS_AR.map((provincia) => (
          <option key={provincia} value={provincia}>
            {provincia}
          </option>
        ))}
      </select>
      {error && <p className="text-lg font-semibold text-red-600">{error}</p>}
    </div>
  );
}

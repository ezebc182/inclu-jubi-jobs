"use client";

interface LargeToggleRoleProps {
  value: "CANDIDATE" | "COMPANY";
  onChange: (value: "CANDIDATE" | "COMPANY") => void;
}

export function LargeToggleRole({ value, onChange }: LargeToggleRoleProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row" role="radiogroup">
      <button
        type="button"
        role="radio"
        aria-checked={value === "CANDIDATE"}
        onClick={() => onChange("CANDIDATE")}
        className={`flex min-h-[80px] flex-1 items-center justify-center rounded-lg border-4 px-6 py-4 text-xl font-bold transition-all focus:outline-none focus:ring-4 focus:ring-primary-300 ${
          value === "CANDIDATE"
            ? "border-primary-600 bg-primary-50 text-primary-700"
            : "border-rule bg-surface text-ink-soft hover:border-rule"
        }`}
      >
        Busco trabajo
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === "COMPANY"}
        onClick={() => onChange("COMPANY")}
        className={`flex min-h-[80px] flex-1 items-center justify-center rounded-lg border-4 px-6 py-4 text-xl font-bold transition-all focus:outline-none focus:ring-4 focus:ring-primary-300 ${
          value === "COMPANY"
            ? "border-primary-600 bg-primary-50 text-primary-700"
            : "border-rule bg-surface text-ink-soft hover:border-rule"
        }`}
      >
        Soy empresa
      </button>
    </div>
  );
}

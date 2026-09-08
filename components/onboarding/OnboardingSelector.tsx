"use client";

import { useState } from "react";
import { LargeToggleRole } from "@/components/forms/LargeToggleRole";
import { useRouter } from "next/navigation";

export function OnboardingSelector() {
  const router = useRouter();
  const [role, setRole] = useState<"CANDIDATE" | "COMPANY">("CANDIDATE");

  const handleContinue = () => {
    if (role === "CANDIDATE") {
      router.push("/onboarding/candidato");
    } else {
      router.push("/onboarding/empresa");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-lg border border-rule bg-surface p-8">
        <h1 className="mb-4 text-4xl font-bold text-ink">
          ¡Bienvenido a JubiJobs!
        </h1>
        <p className="mb-8 text-xl text-ink-soft">
          Primero, contanos qué querés hacer:
        </p>

        <div className="mb-8">
          <LargeToggleRole value={role} onChange={setRole} />
        </div>

        <button
          onClick={handleContinue}
          className="min-h-[52px] w-full rounded-lg bg-primary-600 px-8 py-4 text-xl font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

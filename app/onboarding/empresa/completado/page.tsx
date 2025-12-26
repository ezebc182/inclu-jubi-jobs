"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function OnboardingEmpresaCompletadoPage() {
  const router = useRouter();

  useEffect(() => {
    // Esperar 2 segundos y luego redirigir
    const timer = setTimeout(() => {
      router.push("/empresa");
      router.refresh();
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4 transition-colors dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl border-2 border-gray-200 bg-white p-12 text-center shadow-lg transition-colors dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <svg
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            ¡Perfil creado con éxito!
          </h1>

          <p className="mb-8 text-xl text-gray-700 dark:text-gray-300">
            Tu empresa ya está registrada. En unos segundos te redirigiremos a tu dashboard
            para que puedas publicar tu primer empleo.
          </p>

          <div className="flex items-center justify-center gap-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-primary-600 dark:bg-primary-400"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-primary-600 delay-100 dark:bg-primary-400"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-primary-600 delay-200 dark:bg-primary-400"></div>
          </div>

          <p className="mt-8 text-base text-gray-600 dark:text-gray-400">
            Si no se redirige automáticamente,{" "}
            <a
              href="/empresa"
              className="font-semibold text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
            >
              hacé click aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

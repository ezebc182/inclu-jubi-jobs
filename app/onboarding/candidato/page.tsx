import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProvinceSelect } from "@/components/forms/ProvinceSelect";
import { DISABILITY_TYPES } from "@/lib/constants";
import { completeOnboardingCandidate } from "@/app/actions/onboarding";

export default async function OnboardingCandidatoPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 transition-colors dark:bg-gray-900">
      <div className="rounded-lg border-2 border-gray-300 bg-white p-8 transition-colors dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Completá tu perfil
        </h1>
        <p className="mb-8 text-xl text-gray-700 dark:text-gray-300">
          Solo necesitamos unos datos básicos y tus respuestas a 3 preguntas.
        </p>

        <form action={completeOnboardingCandidate} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Tu nombre completo
              <span className="ml-1 text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={session.user.name || ""}
              className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="11-1234-5678"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ¿Dónde vivís?
              <span className="ml-1 text-red-600 dark:text-red-400">*</span>
            </label>
            <select
              id="location"
              name="location"
              required
              className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Seleccioná tu provincia</option>
              {["CABA", "Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos", "Salta", "Misiones", "Chaco", "Chubut", "Corrientes", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Neuquén", "Río Negro", "San Juan", "San Luis", "Santa Cruz", "Santiago del Estero", "Tierra del Fuego"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="birthYear" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Año de nacimiento (opcional)
            </label>
            <input
              type="number"
              id="birthYear"
              name="birthYear"
              min="1920"
              max="2010"
              className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="1960"
            />
          </div>

          <div className="rounded-lg bg-purple-50 p-6 transition-colors dark:bg-purple-950">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Trabajo inclusivo
            </h3>
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="isDisabled"
                name="isDisabled"
                value="true"
                className="h-6 w-6 rounded border-2 border-gray-300 focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="isDisabled" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Soy una persona con discapacidad
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="disabilityType" className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Tipo de discapacidad (opcional)
              </label>
              <select
                id="disabilityType"
                name="disabilityType"
                className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                {DISABILITY_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="accessibilityNeeds" className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Necesidades de accesibilidad (opcional)
              </label>
              <textarea
                id="accessibilityNeeds"
                name="accessibilityNeeds"
                rows={3}
                maxLength={500}
                className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="Ej: Necesito rampas de acceso, baños adaptados..."
              />
            </div>
          </div>

          <hr className="my-4 dark:border-gray-700" />

          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">3 preguntas simples</h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="did" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ¿Qué hiciste?
              <span className="ml-1 text-red-600 dark:text-red-400">*</span>
            </label>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Contanos sobre tu experiencia laboral o actividades anteriores.
            </p>
            <textarea
              id="did"
              name="did"
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Ejemplo: Trabajé 30 años en el sector bancario..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="canDo" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ¿Qué sabés hacer?
              <span className="ml-1 text-red-600 dark:text-red-400">*</span>
            </label>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Contanos sobre tus habilidades y conocimientos.
            </p>
            <textarea
              id="canDo"
              name="canDo"
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Ejemplo: Sé usar computadoras, atender teléfonos..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="wantToDo" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ¿Qué te gustaría hacer?
              <span className="ml-1 text-red-600 dark:text-red-400">*</span>
            </label>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Contanos qué tipo de trabajo te gustaría realizar.
            </p>
            <textarea
              id="wantToDo"
              name="wantToDo"
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Ejemplo: Me gustaría trabajar part-time atendiendo al público..."
            />
          </div>

          <button
            type="submit"
            className="min-h-[52px] rounded-lg bg-primary-600 px-8 py-4 text-xl font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Completar perfil
          </button>
        </form>
      </div>
    </div>
  );
}

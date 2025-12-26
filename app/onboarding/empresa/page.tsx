import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { completeOnboardingCompany } from "@/app/actions/onboarding";
import { PROVINCIAS_AR } from "@/lib/constants";
import { prisma } from "@/lib/db";

export default async function OnboardingEmpresaPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  // Verificar el rol del usuario desde la base de datos
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  // Si el usuario ya tiene una empresa, redirigir al dashboard
  if (user?.role === "COMPANY") {
    const company = await prisma.company.findUnique({
      where: { ownerId: session.user.id },
    });

    if (company) {
      redirect("/empresa");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 transition-colors dark:bg-gray-900">
      <div className="rounded-lg border-2 border-gray-300 bg-white p-8 transition-colors dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Creá tu perfil de empresa
        </h1>
        <p className="mb-8 text-xl text-gray-700 dark:text-gray-300">
          Completá los datos de tu empresa para empezar a publicar empleos.
        </p>

        <form action={completeOnboardingCompany} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="companyName" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Nombre de la empresa
              <span className="ml-1 text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              minLength={2}
              className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Supermercado Sur"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="website" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Sitio web (opcional)
            </label>
            <input
              type="url"
              id="website"
              name="website"
              className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="https://ejemplo.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Ubicación principal (opcional)
            </label>
            <select
              id="location"
              name="location"
              className="min-h-[48px] rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Seleccioná una provincia</option>
              {PROVINCIAS_AR.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="about" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Sobre la empresa (opcional)
            </label>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Describí brevemente tu empresa, su historia o valores.
            </p>
            <textarea
              id="about"
              name="about"
              rows={5}
              maxLength={1000}
              className="rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Somos una empresa familiar con más de 20 años en el mercado..."
            />
          </div>

          <div className="rounded-lg bg-primary-50 p-6 transition-colors dark:bg-primary-900/30">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
              ¿Por qué contratar jubilados?
            </h3>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-lg font-bold text-primary-600 dark:text-primary-400">✓</span>
                <span className="text-gray-800 dark:text-gray-200">Experiencia y responsabilidad comprobada</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-lg font-bold text-primary-600 dark:text-primary-400">✓</span>
                <span className="text-gray-800 dark:text-gray-200">Estabilidad y compromiso con el trabajo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-lg font-bold text-primary-600 dark:text-primary-400">✓</span>
                <span className="text-gray-800 dark:text-gray-200">Flexibilidad en jornadas (part-time, por día)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-lg font-bold text-primary-600 dark:text-primary-400">✓</span>
                <span className="text-gray-800 dark:text-gray-200">Conocimientos valiosos para transmitir</span>
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="min-h-[52px] rounded-lg bg-primary-600 px-8 py-4 text-xl font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Crear perfil y publicar mi primer empleo
          </button>
        </form>
      </div>
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { JobForm } from "@/components/company/JobForm";
import { CompanyJobsList } from "@/components/company/CompanyJobsList";
import { ApplicationsList } from "@/components/company/ApplicationsList";

export const metadata = {
  title: "Mi Empresa - Dashboard - JubiJobs",
  description: "Gestioná tus empleos y postulaciones recibidas",
};

export default async function EmpresaDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/ingresar");
  }

  // Verificar el rol directamente desde la base de datos para evitar problemas de caché de sesión
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "COMPANY") {
    redirect("/onboarding");
  }

  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!company) {
    redirect("/onboarding/empresa");
  }

  // Obtener empleos de la empresa
  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: {
      _count: {
        select: { applicants: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Obtener todas las postulaciones
  const applications = await prisma.application.findMany({
    where: {
      job: {
        companyId: company.id,
      },
    },
    include: {
      user: true,
      job: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-paper transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header mejorado */}
        <header className="mb-8 rounded-xl bg-white p-8 shadow-sm transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-ink">
                {company.name}
              </h1>
              <p className="text-xl text-ink-soft">
                Dashboard de empresa
              </p>
            </div>
            {company.isVerified && (
              <div className="rounded-lg bg-green-50 px-4 py-2 transition-colors dark:bg-green-950">
                <p className="flex items-center gap-2 text-base font-semibold text-green-800 dark:text-green-400">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verificada
                </p>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 transition-colors dark:bg-blue-950">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
                Total empleos
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                {jobs.length}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 transition-colors dark:bg-green-950">
              <p className="text-sm font-semibold text-green-800 dark:text-green-400">
                Empleos activos
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-300">
                {jobs.filter((j) => j.status === "PUBLISHED").length}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 transition-colors dark:bg-purple-950">
              <p className="text-sm font-semibold text-purple-800 dark:text-purple-400">
                Postulaciones
              </p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">
                {applications.length}
              </p>
            </div>
          </div>
        </header>

        <Tabs.Root defaultValue="empleos" className="w-full">
          <Tabs.List className="mb-6 flex flex-wrap gap-2 rounded-lg bg-white p-2 shadow-sm transition-colors">
            <Tabs.Trigger
              value="empleos"
              className="rounded-lg px-6 py-3 text-base font-semibold text-ink-soft transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300 data-[state=active]:bg-primary-600 data-[state=active]:text-white dark:data-[state=active]:bg-primary-500"
            >
              Mis empleos ({jobs.length})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="crear"
              className="rounded-lg px-6 py-3 text-base font-semibold text-ink-soft transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300 data-[state=active]:bg-primary-600 data-[state=active]:text-white dark:data-[state=active]:bg-primary-500"
            >
              Crear empleo
            </Tabs.Trigger>
            <Tabs.Trigger
              value="postulaciones"
              className="rounded-lg px-6 py-3 text-base font-semibold text-ink-soft transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300 data-[state=active]:bg-primary-600 data-[state=active]:text-white dark:data-[state=active]:bg-primary-500"
            >
              Postulaciones ({applications.length})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="perfil"
              className="rounded-lg px-6 py-3 text-base font-semibold text-ink-soft transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300 data-[state=active]:bg-primary-600 data-[state=active]:text-white dark:data-[state=active]:bg-primary-500"
            >
              Perfil de empresa
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="empleos">
            <CompanyJobsList jobs={jobs} />
          </Tabs.Content>

          <Tabs.Content value="crear">
            <div className="rounded-xl bg-white p-8 shadow-sm transition-colors">
              <h2 className="mb-6 text-2xl font-bold text-ink">
                Publicar un nuevo empleo
              </h2>
              <JobForm />
            </div>
          </Tabs.Content>

          <Tabs.Content value="postulaciones">
            <ApplicationsList applications={applications} />
          </Tabs.Content>

          <Tabs.Content value="perfil">
            <div className="rounded-xl bg-white p-8 shadow-sm transition-colors">
              <h2 className="mb-6 text-2xl font-bold text-ink">
                Perfil de {company.name}
              </h2>
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="mb-2 text-lg font-bold text-ink">
                    Nombre de la empresa
                  </h3>
                  <p className="text-base text-ink-soft">
                    {company.name}
                  </p>
                </div>

                {company.website && (
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-ink">
                      Sitio web
                    </h3>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                {company.location && (
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-ink">
                      Ubicación
                    </h3>
                    <p className="text-base text-ink-soft">
                      {company.location}
                    </p>
                  </div>
                )}

                {company.about && (
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-ink">
                      Sobre la empresa
                    </h3>
                    <p className="text-base text-ink-soft">
                      {company.about}
                    </p>
                  </div>
                )}

                <div className="mt-4 rounded-lg border-2 border-rule bg-paper p-4 transition-colors">
                  <p className="text-sm text-ink-soft">
                    💡 Para editar el perfil de tu empresa, contactanos a través
                    de nuestro email de soporte.
                  </p>
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

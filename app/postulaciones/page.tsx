import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = {
  title: "Mis Postulaciones - JubiJobs",
  description: "Seguimiento de tus postulaciones a empleos",
};

export default async function PostulacionesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  // Verificar el rol del usuario desde la base de datos
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "CANDIDATE") {
    redirect("/");
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Mis postulaciones
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          {applications.length}{" "}
          {applications.length === 1
            ? "postulación realizada"
            : "postulaciones realizadas"}
        </p>
      </header>

      {applications.length === 0 ? (
        <EmptyState
          title="No tenés postulaciones todavía"
          description="Buscá empleos que te interesen y postulate respondiendo 3 preguntas simples."
          actionLabel="Buscar empleos"
          actionHref="/empleos"
        />
      ) : (
        <div className="flex flex-col gap-6">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              id={app.job.id}
              jobTitle={app.job.title}
              companyName={app.job.company.name}
              status={app.status}
              createdAt={app.createdAt}
            />
          ))}
        </div>
      )}

      <section className="mt-12 rounded-lg bg-primary-50 p-6 dark:border dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Estados de las postulaciones
        </h2>
        <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              📤
            </span>
            <div>
              <strong className="dark:text-gray-100">Enviada:</strong> Tu
              postulación fue recibida y la empresa la va a revisar.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              👀
            </span>
            <div>
              <strong className="dark:text-gray-100">Revisada:</strong> La
              empresa vio tu postulación y está evaluando tu perfil.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              ✅
            </span>
            <div>
              <strong className="dark:text-gray-100">Contactado/a:</strong> ¡La
              empresa se interesó en tu perfil! Deberías recibir un email con
              sus datos de contacto.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              ❌
            </span>
            <div>
              <strong className="dark:text-gray-100">Rechazada:</strong> La
              empresa decidió no continuar con tu postulación esta vez. Seguí
              buscando otras oportunidades.
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCurrentPortal } from "@/lib/portal";

// Usted en JubiJobs, vos en IncluJobs (ver PRODUCT.md).
const TEXTOS = {
  JUBI: {
    vacioTitulo: "Todavía no tiene postulaciones",
    vacioTexto:
      "Busque empleos que le interesen y postúlese respondiendo 3 preguntas simples.",
    enviada: "Su postulación fue recibida y la empresa la va a revisar.",
    vista: "La empresa vio su postulación y está evaluando su perfil.",
    contactado:
      "¡La empresa se interesó en su perfil! Debería recibir un email con sus datos de contacto.",
    rechazada:
      "La empresa decidió no continuar con su postulación esta vez. Siga buscando otras oportunidades.",
  },
  INCLU: {
    vacioTitulo: "No tenés postulaciones todavía",
    vacioTexto:
      "Buscá empleos que te interesen y postulate respondiendo 3 preguntas simples.",
    enviada: "Tu postulación fue recibida y la empresa la va a revisar.",
    vista: "La empresa vio tu postulación y está evaluando tu perfil.",
    contactado:
      "¡La empresa se interesó en tu perfil! Deberías recibir un email con sus datos de contacto.",
    rechazada:
      "La empresa decidió no continuar con tu postulación esta vez. Seguí buscando otras oportunidades.",
  },
} as const;

export const metadata = {
  title: "Mis Postulaciones - JubiJobs",
  description: "Seguimiento de las postulaciones a empleos",
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
  const t = TEXTOS[await getCurrentPortal()];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-ink">Mis postulaciones</h1>
        <p className="text-xl text-ink-soft">
          {applications.length}{" "}
          {applications.length === 1
            ? "postulación realizada"
            : "postulaciones realizadas"}
        </p>
      </header>

      {applications.length === 0 ? (
        <EmptyState
          title={t.vacioTitulo}
          description={t.vacioTexto}
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
              reviewedAt={app.reviewedAt}
              contactedAt={app.contactedAt}
            />
          ))}
        </div>
      )}

      <section className="mt-12 rounded-lg bg-primary-50 p-6 dark:border">
        <h2 className="mb-4 text-2xl font-bold text-ink">
          Estados de las postulaciones
        </h2>
        <ul className="space-y-3 text-lg text-ink-soft">
          <li className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              📤
            </span>
            <div>
              <strong className="dark:text-ink-soft">Enviada:</strong>{" "}
              {t.enviada}
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              👀
            </span>
            <div>
              <strong className="dark:text-ink-soft">Vista:</strong> {t.vista}
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              ✅
            </span>
            <div>
              <strong className="dark:text-ink-soft">Contactado/a:</strong>{" "}
              {t.contactado}
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              ❌
            </span>
            <div>
              <strong className="dark:text-ink-soft">Rechazada:</strong>{" "}
              {t.rechazada}
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}

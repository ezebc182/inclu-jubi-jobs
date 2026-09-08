"use client";

import { useState } from "react";
import { APP_STATUS_LABELS, formatDate } from "@/lib/constants";
import { contactCandidate } from "@/app/actions/applications";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LineIcon } from "@/components/ui/LineIcon";
import { EmptyState } from "@/components/ui/EmptyState";

interface Application {
  id: string;
  did: string;
  canDo: string;
  wantToDo: string;
  status: "SUBMITTED" | "REVIEWED" | "CONTACTED" | "REJECTED";
  createdAt: Date | string;
  user: {
    name: string | null;
    email: string;
    phoneNumber: string | null;
    whatsappNumber: string | null;
    location: string | null;
    birthYear: number | null;
    isDisabled: boolean;
    disabilityType: string | null;
    accessibilityNeeds: string | null;
  };
  job: {
    title: string;
  };
}

export function ApplicationsList({
  applications,
}: {
  applications: Application[];
}) {
  const router = useRouter();
  const [contacting, setContacting] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleContact = async (applicationId: string) => {
    setContacting(applicationId);
    try {
      await contactCandidate(applicationId);
      const candidateName =
        applications.find((a) => a.id === applicationId)?.user.name ||
        "El candidato";
      toast.success("Le avisamos al candidato", {
        description: `${candidateName} recibirá un email con tus datos de contacto y podrá comunicarse con vos`,
        duration: 6000,
      });
      router.refresh();
    } catch (error: any) {
      toast.error("No se pudo enviar el aviso", {
        description:
          error.message || "Por favor, intentá nuevamente en unos momentos",
        duration: 6000,
      });
    } finally {
      setContacting(null);
    }
  };

  if (applications.length === 0) {
    return (
      <EmptyState
        icon="chat"
        title="Todavía no recibiste postulaciones"
        description="Cuando alguien se postule a alguno de tus avisos, va a aparecer acá con sus tres respuestas."
        actionLabel="Ver mis avisos"
        actionHref="/empresa"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {applications.map((app) => (
        <article
          key={app.id}
          className="rounded-xl border border-rule bg-surface p-6 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-bold text-ink">
                {app.user.name || "Candidato"}
              </h3>
              <p className="mb-2 text-lg text-ink-soft">
                Postulación para: <strong>{app.job.title}</strong>
              </p>
              {/* Ubicación y fecha, nada más.
                  La condición de discapacidad NO va acá. Estaba junto a la
                  edad, en violeta y negrita, o sea que era lo primero que veía
                  la empresa: la condición antes que la persona. Es un dato
                  sensible de salud, y mostrarlo destacado en la pantalla donde
                  se decide a quién contactar es el mecanismo de una
                  discriminación — no hace falta mala intención, alcanza con
                  que el ojo lo vea primero.

                  Lo que la empresa sí necesita saber son las condiciones de
                  trabajo a garantizar, y eso se muestra abajo, junto al resto
                  de los datos del puesto. */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-base text-ink-soft">
                {app.user.location && <span>{app.user.location}</span>}
                <span>Se postuló el {formatDate(app.createdAt)}</span>
              </div>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-base font-bold ${
                app.status === "SUBMITTED"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
                  : app.status === "REVIEWED"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                    : app.status === "CONTACTED"
                      ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {APP_STATUS_LABELS[app.status]}
            </span>
          </div>

          {/* Condiciones de trabajo, no "necesidades" de la persona.
              El encuadre importa: "necesidades de accesibilidad" pone la carga
              en el candidato, como si pidiera un favor. Son condiciones que el
              puesto tiene que dar, igual que un horario o una herramienta.

              Se muestra solo si la persona escribió algo: cuando no hay nada
              que garantizar, no hay nada que decir. El flag `isDisabled` por sí
              solo ya no pinta ninguna etiqueta.

              Sale de los tokens de marca y no de un violeta fijo, que ademas
              en modo oscuro quedaba ilegible. */}
          {app.user.accessibilityNeeds && (
            <div className="mb-4 rounded-lg border border-rule bg-paper p-4">
              <h4 className="text-base font-semibold text-ink">
                Condiciones a garantizar en el puesto
              </h4>
              <p className="mt-1 text-base text-ink-soft">
                {app.user.accessibilityNeeds}
              </p>
            </div>
          )}

          {/* aria-expanded y aria-controls: el boton controla una region que
              aparece y desaparece, y un lector de pantalla necesita saberlo.
              Antes eran flechas de texto (▼ ▶) sin ninguna semantica. */}
          <button
            type="button"
            onClick={() => setExpanded(expanded === app.id ? null : app.id)}
            aria-expanded={expanded === app.id}
            aria-controls={`respuestas-${app.id}`}
            className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-primary-700 transition-colors hover:text-primary-800 dark:text-primary-200"
          >
            <LineIcon
              name={expanded === app.id ? "chevron-down" : "chevron-right"}
              size={20}
              strokeWidth={2}
            />
            {expanded === app.id
              ? "Ocultar respuestas"
              : "Ver las 3 respuestas"}
          </button>

          {expanded === app.id && (
            <div
              id={`respuestas-${app.id}`}
              className="mb-4 flex flex-col gap-4 rounded-lg border border-rule bg-paper p-6"
            >
              <div>
                <p className="mb-2 text-base font-bold text-ink">
                  ¿Qué hiciste?
                </p>
                <p className="text-base text-ink-soft">
                  {app.did}
                </p>
              </div>
              <div>
                <p className="mb-2 text-base font-bold text-ink">
                  ¿Qué sabés hacer?
                </p>
                <p className="text-base text-ink-soft">
                  {app.canDo}
                </p>
              </div>
              <div>
                <p className="mb-2 text-base font-bold text-ink">
                  ¿Qué te gustaría hacer?
                </p>
                <p className="text-base text-ink-soft">
                  {app.wantToDo}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {/* Contacto: acciones secundarias, con borde en vez de relleno.
                Antes los tres iban en solido —uno verde, dos azules— y competian
                con "Marcar como contactado", que es la accion real de esta
                pantalla. El verde ademas estaba fuera de los tokens.

                Los botones abren el canal; el dato (numero, mail) no hace falta
                repetirlo dentro del boton. */}
            {app.user.whatsappNumber && (
              <a
                href={`https://wa.me/${app.user.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex min-h-[48px] items-center gap-2 rounded-md border border-rule px-4 text-base font-semibold text-ink transition-colors hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/25"
              >
                <LineIcon name="whatsapp" size={20} />
                WhatsApp
                <span className="sr-only">
                  {" "}
                  a {app.user.name || "el candidato"} (se abre en otra pestaña)
                </span>
              </a>
            )}
            {app.user.phoneNumber && (
              <a
                href={`tel:${app.user.phoneNumber}`}
                className="press inline-flex min-h-[48px] items-center gap-2 rounded-md border border-rule px-4 text-base font-semibold text-ink transition-colors hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/25"
              >
                <LineIcon name="phone" size={20} />
                {app.user.phoneNumber}
              </a>
            )}
            <a
              href={`mailto:${app.user.email}`}
              className="press inline-flex min-h-[48px] items-center gap-2 rounded-md border border-rule px-4 text-base font-semibold text-ink transition-colors hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/25"
            >
              <LineIcon name="mail" size={20} />
              Escribir un correo
            </a>

            {app.status !== "CONTACTED" && (
              <button
                onClick={() => handleContact(app.id)}
                disabled={contacting === app.id}
                className="rounded-lg bg-primary-600 px-4 py-2 text-base font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50"
              >
                {contacting === app.id
                  ? "Enviando..."
                  : "Solicitar contacto (enviar email)"}
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

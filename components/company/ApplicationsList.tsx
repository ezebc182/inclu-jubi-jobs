"use client";

import { useState } from "react";
import { APP_STATUS_LABELS, formatDate } from "@/lib/constants";
import { contactCandidate } from "@/app/actions/applications";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      toast.success("✅ ¡Solicitud enviada exitosamente!", {
        description: `${candidateName} recibirá un email con tus datos de contacto y podrá comunicarse con vos`,
        duration: 6000,
      });
      router.refresh();
    } catch (error: any) {
      toast.error("❌ No se pudo enviar la solicitud", {
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
      <div className="rounded-xl border-2 border-dashed border-rule bg-white p-12 text-center shadow-sm transition-colors">
        <p className="text-xl font-semibold text-ink-soft">
          No hay postulaciones todavía
        </p>
        <p className="mt-2 text-lg text-ink-soft">
          Cuando alguien se postule a tus empleos, aparecerán acá.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {applications.map((app) => (
        <article
          key={app.id}
          className="rounded-xl border-2 border-rule bg-white p-6 shadow-sm transition-colors"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-bold text-ink">
                {app.user.name || "Candidato"}
              </h3>
              <p className="mb-2 text-lg text-ink-soft">
                Postulación para: <strong>{app.job.title}</strong>
              </p>
              <div className="flex flex-wrap gap-4 text-base text-ink-soft">
                {app.user.location && <span>📍 {app.user.location}</span>}
                {app.user.birthYear && (
                  <span>
                    👤 {new Date().getFullYear() - app.user.birthYear} años
                  </span>
                )}
                {app.user.isDisabled && (
                  <span className="font-semibold text-purple-700 dark:text-purple-400">
                    ♿ Persona con discapacidad
                  </span>
                )}
                <span>📅 {formatDate(app.createdAt)}</span>
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

          {app.user.isDisabled && app.user.accessibilityNeeds && (
            <div className="mb-4 rounded-lg bg-purple-50 p-4 transition-colors dark:bg-purple-950">
              <p className="text-base font-semibold text-purple-900 dark:text-purple-400">
                Necesidades de accesibilidad:
              </p>
              <p className="text-base text-purple-800 dark:text-purple-300">
                {app.user.accessibilityNeeds}
              </p>
            </div>
          )}

          <button
            onClick={() => setExpanded(expanded === app.id ? null : app.id)}
            className="mb-4 text-lg font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {expanded === app.id
              ? "▼ Ocultar respuestas"
              : "▶ Ver respuestas (3 preguntas)"}
          </button>

          {expanded === app.id && (
            <div className="mb-4 flex flex-col gap-4 rounded-lg bg-paper p-6 transition-colors">
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
            {app.user.whatsappNumber && (
              <a
                href={`https://wa.me/${app.user.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-4 py-2 text-base font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                💬 WhatsApp
              </a>
            )}
            {app.user.phoneNumber && (
              <a
                href={`tel:${app.user.phoneNumber}`}
                className="rounded-lg bg-primary-700 px-4 py-2 text-base font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                📞 {app.user.phoneNumber}
              </a>
            )}
            <a
              href={`mailto:${app.user.email}`}
              className="rounded-lg bg-primary-700 px-4 py-2 text-base font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
            >
              ✉️ {app.user.email}
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

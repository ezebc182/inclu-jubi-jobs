import Link from "next/link";
import { formatCurrency } from "@/lib/constants";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  province: string;
  city?: string | null;
  modality: string;
  schedule: string;
  salaryArsMin?: number | null;
  salaryArsMax?: number | null;
  /** Condiciones de accesibilidad, relevantes sobre todo en IncluJobs. */
  hasAccessibleSite?: boolean;
  supportsFlexHours?: boolean;
  isRemoteFriendly?: boolean;
}

const MODALITY_LABELS: Record<string, string> = {
  PRESENCIAL: "Presencial",
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
};

const SCHEDULE_LABELS: Record<string, string> = {
  PART_TIME: "Part-time",
  FLEX: "Horario flexible",
  POR_DIA: "Por día",
};

export function JobCard({
  id,
  title,
  company,
  province,
  city,
  modality,
  schedule,
  salaryArsMin,
  salaryArsMax,
  hasAccessibleSite,
  supportsFlexHours,
  isRemoteFriendly,
}: JobCardProps) {
  const location = city ? `${city}, ${province}` : province;

  const salary =
    salaryArsMin && salaryArsMax
      ? `${formatCurrency(salaryArsMin)} a ${formatCurrency(salaryArsMax)}`
      : salaryArsMin
        ? `Desde ${formatCurrency(salaryArsMin)}`
        : null;

  const accessibility = [
    hasAccessibleSite && "Instalaciones adaptadas",
    supportsFlexHours && "Horario ajustable",
    isRemoteFriendly && "Se puede remoto",
  ].filter(Boolean) as string[];

  return (
    <article className="interactive-surface group relative h-full border-transparent bg-surface">
      <div className="flex h-full flex-col p-6">
        {/* Sin `font-display`: el h3 ya hereda la familia del portal desde
            globals.css, que es Fraunces en JubiJobs y Atkinson en IncluJobs.
            Fijarla acá dejaba a IncluJobs con la serif que justamente no
            queremos en un portal de baja visión. */}
        <h3 className="text-xl font-semibold leading-snug">
          {/* El enlace cubre toda la tarjeta vía ::after, pero el área
              accesible sigue siendo el título: el lector de pantalla
              anuncia el puesto, no "enlace, tarjeta". */}
          <Link
            href={`/empleos/${id}`}
            className="after:absolute after:inset-0 after:content-[''] group-hover:text-primary-700 dark:group-hover:text-primary-200"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-1.5 text-base text-ink-soft">{company}</p>

        {/* Los datos hablan solos: nadie necesita que le aclaren que
            "Córdoba" es una ubicación.

            Los separadores van con `aria-hidden`: un lector de pantalla leía
            "Córdoba barra vertical Presencial barra vertical Part-time". Las
            comas del `sr-only` le devuelven la pausa natural. */}
        <p className="mt-4 text-base text-ink">
          {location}
          <span className="mx-2 text-rule" aria-hidden="true">
            |
          </span>
          <span className="sr-only">, </span>
          {MODALITY_LABELS[modality]}
          <span className="mx-2 text-rule" aria-hidden="true">
            |
          </span>
          <span className="sr-only">, </span>
          {SCHEDULE_LABELS[schedule]}
        </p>

        {accessibility.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {accessibility.map((label) => (
              <li
                key={label}
                className="rounded-sm bg-secondary-50 px-2.5 py-1 text-sm font-medium text-secondary-700 dark:bg-secondary-700/20 dark:text-secondary-300"
              >
                {label}
              </li>
            ))}
          </ul>
        )}

        {salary && (
          <p className="mt-auto border-t border-rule pt-4 text-lg font-semibold text-primary-700 dark:text-primary-200">
            {salary}
            <span className="ml-1.5 text-base font-normal text-ink-soft">
              por mes
            </span>
          </p>
        )}
      </div>
    </article>
  );
}

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
}

const MODALITY_LABELS: Record<string, string> = {
  PRESENCIAL: "Presencial",
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
};

const SCHEDULE_LABELS: Record<string, string> = {
  PART_TIME: "Part-time",
  FLEX: "Flexible",
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
}: JobCardProps) {
  const location = city ? `${city}, ${province}` : province;
  const salary =
    salaryArsMin && salaryArsMax
      ? `${formatCurrency(salaryArsMin)} - ${formatCurrency(salaryArsMax)}`
      : "A convenir";

  return (
    <Link
      href={`/empleos/${id}`}
      className="block rounded-lg border-2 border-gray-300 bg-white p-6 transition-all hover:border-primary-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-400"
    >
      <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">{company}</p>
      <div className="flex flex-col gap-2 text-base text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Ubicación:</span>
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Modalidad:</span>
          <span>{MODALITY_LABELS[modality]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Jornada:</span>
          <span>{SCHEDULE_LABELS[schedule]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Salario:</span>
          <span className="font-bold text-primary-700 dark:text-primary-400">{salary}</span>
        </div>
      </div>
    </Link>
  );
}

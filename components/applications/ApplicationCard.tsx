import Link from "next/link";
import { formatDate, APP_STATUS_LABELS } from "@/lib/constants";

interface ApplicationCardProps {
  id: string;
  jobTitle: string;
  companyName: string;
  status: keyof typeof APP_STATUS_LABELS;
  createdAt: Date | string;
}

const STATUS_COLORS = {
  SUBMITTED: "bg-blue-100 text-blue-800",
  REVIEWED: "bg-yellow-100 text-yellow-800",
  CONTACTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export function ApplicationCard({
  id,
  jobTitle,
  companyName,
  status,
  createdAt,
}: ApplicationCardProps) {
  return (
    <div className="rounded-lg border-2 border-rule bg-white p-6">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="mb-1 text-xl font-bold text-ink">{jobTitle}</h3>
          <p className="text-lg text-ink-soft">{companyName}</p>
        </div>
        <span
          className={`rounded-full px-4 py-2 text-base font-bold ${STATUS_COLORS[status]}`}
        >
          {APP_STATUS_LABELS[status]}
        </span>
      </div>
      <p className="mb-4 text-base text-ink-soft">
        Postulado el {formatDate(createdAt)}
      </p>
      <Link
        href={`/empleos/${id}`}
        className="inline-block rounded-lg bg-primary-600 px-4 py-2 text-base font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
      >
        Ver empleo
      </Link>
    </div>
  );
}

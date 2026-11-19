import Link from "next/link";
import { formatDate, APP_STATUS_LABELS } from "@/lib/constants";
import { LineIcon } from "@/components/ui/LineIcon";

interface ApplicationCardProps {
  id: string;
  jobTitle: string;
  companyName: string;
  status: keyof typeof APP_STATUS_LABELS;
  createdAt: Date | string;
  reviewedAt: Date | string | null;
  contactedAt: Date | string | null;
}

const STATUS_COLORS = {
  SUBMITTED: "bg-blue-100 text-blue-800",
  REVIEWED: "bg-yellow-100 text-yellow-800",
  CONTACTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

// El color acompaña; lo que informa es el texto y el ícono.
const STATUS_ICONS = {
  SUBMITTED: "mail",
  REVIEWED: "eye",
  CONTACTED: "chat",
  REJECTED: "mail",
} as const;

export function ApplicationCard({
  id,
  jobTitle,
  companyName,
  status,
  createdAt,
  reviewedAt,
  contactedAt,
}: ApplicationCardProps) {
  const statusDate =
    status === "CONTACTED"
      ? contactedAt
      : status === "REVIEWED"
        ? reviewedAt
        : null;

  return (
    <div className="rounded-lg border border-rule bg-surface p-6">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="mb-1 text-xl font-bold text-ink">{jobTitle}</h3>
          <p className="text-lg text-ink-soft">{companyName}</p>
        </div>
        <p
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold ${STATUS_COLORS[status]}`}
        >
          <LineIcon name={STATUS_ICONS[status]} size={20} strokeWidth={2} />
          <span className="sr-only">Estado: </span>
          {APP_STATUS_LABELS[status]}
          {statusDate && (
            <span className="font-normal"> el {formatDate(statusDate)}</span>
          )}
        </p>
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

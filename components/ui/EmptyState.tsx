import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mb-6 max-w-md text-lg text-gray-600 dark:text-gray-400">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

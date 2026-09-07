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
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-rule bg-paper p-8 text-center transition-colors dark:bg-primary-700">
      <h3 className="mb-2 text-2xl font-bold text-ink-soft">
        {title}
      </h3>
      <p className="mb-6 max-w-md text-lg text-ink-soft">
        {description}
      </p>
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

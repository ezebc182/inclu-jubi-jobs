export function JobCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-xl border-2 border-rule bg-white p-6 shadow-sm transition-colors dark:bg-primary-700"
      role="status"
      aria-label="Cargando empleo..."
    >
      {/* Title skeleton */}
      <div className="mb-4 h-8 w-3/4 rounded bg-rule dark:bg-primary-700" />

      {/* Company skeleton */}
      <div className="mb-4 h-6 w-1/2 rounded bg-rule dark:bg-primary-700" />

      {/* Tags skeleton */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="h-6 w-24 rounded-full bg-rule dark:bg-primary-700" />
        <div className="h-6 w-20 rounded-full bg-rule dark:bg-primary-700" />
        <div className="h-6 w-28 rounded-full bg-rule dark:bg-primary-700" />
      </div>

      {/* Salary skeleton */}
      <div className="mb-4 h-6 w-1/3 rounded bg-rule dark:bg-primary-700" />

      {/* Button skeleton */}
      <div className="h-12 w-full rounded-lg bg-rule dark:bg-primary-700" />

      <span className="sr-only">Cargando información del empleo...</span>
    </div>
  );
}

export function JobListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

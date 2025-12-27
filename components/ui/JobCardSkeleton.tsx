export function JobCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800"
      role="status"
      aria-label="Cargando empleo..."
    >
      {/* Title skeleton */}
      <div className="mb-4 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

      {/* Company skeleton */}
      <div className="mb-4 h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />

      {/* Tags skeleton */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Salary skeleton */}
      <div className="mb-4 h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />

      {/* Button skeleton */}
      <div className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />

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

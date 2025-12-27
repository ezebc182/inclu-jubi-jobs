import { JobListSkeleton } from "@/components/ui/JobCardSkeleton";

export default function EmpleosLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 transition-colors dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        {/* Title skeleton */}
        <div className="mb-6 h-12 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

        {/* Count skeleton */}
        <div className="mb-12 h-7 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters skeleton */}
          <aside className="lg:col-span-1">
            <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-6 transition-colors dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

              {/* Filter items */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-4">
                  <div className="mb-2 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}

              {/* Buttons skeleton */}
              <div className="flex gap-3">
                <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </aside>

          {/* Jobs list skeleton */}
          <main className="lg:col-span-3">
            <JobListSkeleton count={5} />
          </main>
        </div>
      </div>
    </div>
  );
}

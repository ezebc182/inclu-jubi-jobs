import { JobListSkeleton } from "@/components/ui/JobCardSkeleton";

export default function EmpleosLoading() {
  return (
    <div className="min-h-screen bg-paper py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4">
        {/* Title skeleton */}
        <div className="mb-6 h-12 w-64 animate-pulse rounded bg-rule" />

        {/* Count skeleton */}
        <div className="mb-12 h-7 w-48 animate-pulse rounded bg-rule" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters skeleton */}
          <aside className="lg:col-span-1">
            <div className="rounded-lg border-2 border-rule bg-paper p-6 transition-colors">
              <div className="mb-4 h-8 w-48 animate-pulse rounded bg-rule" />

              {/* Filter items */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-4">
                  <div className="mb-2 h-6 w-32 animate-pulse rounded bg-rule" />
                  <div className="h-12 w-full animate-pulse rounded-lg bg-rule" />
                </div>
              ))}

              {/* Buttons skeleton */}
              <div className="flex gap-3">
                <div className="h-12 flex-1 animate-pulse rounded-lg bg-rule" />
                <div className="h-12 flex-1 animate-pulse rounded-lg bg-rule" />
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

export default function EmpleoDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 transition-colors dark:bg-gray-900">
      <article className="animate-pulse">
        <header className="mb-8">
          {/* Title skeleton */}
          <div className="mb-4 h-12 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

          {/* Details skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </header>

        {/* Tags skeleton */}
        <div className="mb-8 flex flex-wrap gap-2">
          <div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Description skeleton */}
        <section className="mb-12">
          <div className="mb-4 h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-3">
            <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </section>

        {/* Company info skeleton */}
        <section className="mb-12 rounded-lg border-2 border-gray-200 bg-gray-50 p-8 transition-colors dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-8 w-56 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-3">
            <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </section>

        {/* Form/Button skeleton */}
        <div className="rounded-lg border-2 border-gray-300 bg-gray-100 p-8 transition-colors dark:border-gray-700 dark:bg-gray-700">
          <div className="mb-6 h-8 w-64 rounded bg-gray-200 dark:bg-gray-600" />
          <div className="h-14 w-full rounded-lg bg-gray-200 dark:bg-gray-600" />
        </div>
      </article>

      <div className="mt-8 text-center">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300" role="status">
          Cargando información del empleo...
        </p>
      </div>
    </div>
  );
}

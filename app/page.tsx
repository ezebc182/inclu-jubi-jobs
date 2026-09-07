import Link from "next/link";
import { BigCTAButton } from "@/components/ui/BigCTAButton";
import { getCurrentPortal, getPortalConfig } from "@/lib/portal";
import { getPortalCopy } from "@/lib/portal-copy";

export default async function HomePage() {
  const portalId = await getCurrentPortal();
  const portal = getPortalConfig(portalId);
  const copy = getPortalCopy(portalId);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white px-4 py-20 transition-colors dark:from-gray-800 dark:to-gray-900 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 whitespace-pre-line text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100 md:text-5xl lg:text-6xl">
            {copy.heroTitle}
          </h1>
          <p className="mb-10 text-xl leading-relaxed text-gray-700 dark:text-gray-300 md:text-2xl">
            {copy.heroSubtitle}
          </p>
          <div className="flex flex-col justify-center gap-5 sm:flex-row">
            <BigCTAButton href="/empleos">Buscar empleos</BigCTAButton>
            <BigCTAButton href="/empresas" variant="secondary">
              Publicar empleo
            </BigCTAButton>
          </div>
          <p className="mt-8 text-lg text-gray-600 dark:text-gray-400">
            {copy.heroNote}
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section
        aria-labelledby="beneficios"
        className="px-4 py-20 dark:bg-gray-900"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="beneficios"
            className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-gray-100"
          >
            {copy.benefitsTitle}
          </h2>
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {copy.benefits.map((benefit) => (
              <li
                key={benefit.title}
                className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 text-4xl" aria-hidden="true">
                  {benefit.emoji}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {benefit.title}
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {benefit.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section
        aria-labelledby="promesas"
        className="bg-gradient-to-b from-white to-primary-50 px-4 py-20 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="promesas"
            className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-gray-100"
          >
            {copy.promiseTitle}
          </h2>
          <ul className="space-y-6">
            {copy.promises.map((promise) => (
              <li
                key={promise.label}
                className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm dark:border dark:border-gray-600 dark:bg-gray-700"
              >
                <span
                  className="text-3xl text-success-600 dark:text-success-400"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div>
                  <strong className="text-xl text-gray-900 dark:text-gray-100">
                    {promise.label}
                  </strong>
                  <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
                    {promise.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Puente al otro portal.
          No es marketing cruzado: si alguien llegó al portal equivocado,
          mandarlo al que le corresponde es el mejor servicio que le podemos
          hacer. Los avisos no se mezclan, pero las personas se orientan. */}
      <section
        aria-labelledby="otro-portal"
        className="bg-white px-4 py-20 dark:bg-gray-900"
      >
        <div className="mx-auto max-w-5xl text-center">
          {portalId === "JUBI" ? (
            <>
              <h2
                id="otro-portal"
                className="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100"
              >
                ¿Buscás empleo inclusivo?
              </h2>
              <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                Si tenés una discapacidad, en InclúJobs cada aviso declara sus
                condiciones de accesibilidad antes de que te postules.
              </p>
              <a
                href="https://inclujobs.com"
                className="inline-flex min-h-[56px] items-center rounded-lg bg-secondary-500 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-secondary-600 focus:outline-none focus:ring-4 focus:ring-secondary-300"
              >
                Ir a InclúJobs
              </a>
            </>
          ) : (
            <>
              <h2
                id="otro-portal"
                className="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100"
              >
                ¿Estás jubilado o jubilada?
              </h2>
              <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                En JubiJobs vas a encontrar trabajos part-time y por día
                pensados para personas mayores de 60.
              </p>
              <a
                href="https://jubijobs.com"
                className="inline-flex min-h-[56px] items-center rounded-lg bg-secondary-500 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-secondary-600 focus:outline-none focus:ring-4 focus:ring-secondary-300"
              >
                Ir a JubiJobs
              </a>
            </>
          )}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-to-b from-primary-100 to-white px-4 py-20 dark:from-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
            {copy.ctaTitle}
          </h2>
          <p className="mb-10 text-xl text-gray-700 dark:text-gray-300">
            {copy.ctaSubtitle}
          </p>
          <div className="flex flex-col justify-center gap-5 sm:flex-row">
            <BigCTAButton href="/empleos">Ver empleos disponibles</BigCTAButton>
            <Link
              href="/como-funciona"
              className="inline-flex min-h-[56px] items-center justify-center rounded-lg border-2 border-primary-600 bg-white px-8 py-4 text-lg font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:border-primary-400 dark:bg-gray-800 dark:text-primary-300 dark:hover:bg-gray-700"
            >
              Cómo funciona
            </Link>
          </div>
          <p className="mt-10 text-base text-gray-600 dark:text-gray-400">
            {portal.name} · {portal.audience}
          </p>
        </div>
      </section>
    </div>
  );
}

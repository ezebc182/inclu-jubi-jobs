import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { LineIcon } from "@/components/ui/LineIcon";
import {
  getCurrentPortal,
  getPortalConfig,
  publicJobFilter,
} from "@/lib/portal";
import { getPortalCopy } from "@/lib/portal-copy";
import { formatCurrency } from "@/lib/constants";

/**
 * Datos vivos para el hero.
 *
 * Un portal de empleo que no muestra un solo empleo en la portada no
 * convence a nadie. Estos números salen de la base: si hay diez avisos,
 * dice diez.
 */
async function loadSnapshot(portal: Awaited<ReturnType<typeof getCurrentPortal>>) {
  const where = publicJobFilter(portal);

  const [jobCount, companyCount, latest] = await Promise.all([
    prisma.job.count({ where }),
    prisma.company.count({ where: { jobs: { some: where } } }),
    prisma.job.findMany({
      where,
      select: {
        id: true,
        title: true,
        province: true,
        city: true,
        salaryArsMin: true,
        company: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return { jobCount, companyCount, latest };
}

export default async function HomePage() {
  const portalId = await getCurrentPortal();
  const portal = getPortalConfig(portalId);
  const copy = getPortalCopy(portalId);
  const { jobCount, companyCount, latest } = await loadSnapshot(portalId);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────
          Asimétrico 7/5: el texto manda, la foto acompaña. Rompe la
          verticalidad centrada que hacía ver todo como un folleto. */}
      <section className="border-b border-rule bg-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-7 lg:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl">
              {copy.heroTitle}
            </h1>

            <p className="mt-6 max-w-measure text-lg leading-relaxed text-ink-soft md:text-xl">
              {copy.heroLead}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/empleos"
                className="inline-flex min-h-[56px] items-center justify-center rounded-md bg-primary-600 px-8 text-lg font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:outline-3"
              >
                Ver empleos
              </Link>
              <Link
                href="/empresas"
                className="inline-flex min-h-[56px] items-center justify-center rounded-md border border-primary-600 px-8 text-lg font-semibold text-primary-700 transition-colors hover:bg-primary-50 dark:border-primary-300 dark:text-primary-200 dark:hover:bg-primary-900/40"
              >
                Publicar un empleo
              </Link>
            </div>

            <p className="mt-5 text-base text-ink-soft">{copy.heroFootnote}</p>

            {/* Cifras reales de la base, no promesas. */}
            {jobCount > 0 && (
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-rule pt-8">
                <div>
                  <dd className="font-display text-3xl font-semibold text-primary-700 dark:text-primary-200">
                    {jobCount.toLocaleString("es-AR")}
                  </dd>
                  <dt className="mt-1 text-base text-ink-soft">
                    {jobCount === 1 ? "empleo publicado" : "empleos publicados"}
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-3xl font-semibold text-primary-700 dark:text-primary-200">
                    {companyCount.toLocaleString("es-AR")}
                  </dd>
                  <dt className="mt-1 text-base text-ink-soft">
                    {companyCount === 1
                      ? "empresa buscando"
                      : "empresas buscando"}
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-3xl font-semibold text-primary-700 dark:text-primary-200">
                    3
                  </dd>
                  <dt className="mt-1 text-base text-ink-soft">
                    preguntas para postularse
                  </dt>
                </div>
              </dl>
            )}
          </div>

          <div className="lg:col-span-5 lg:self-stretch">
            {/* aspect-auto con altura completa en desktop: la foto acompaña
                al bloque de texto en vez de flotar con su propio ritmo. */}
            <figure className="relative aspect-[4/3] overflow-hidden rounded-lg bg-primary-50 sm:aspect-[16/10] lg:h-full lg:aspect-auto dark:bg-primary-900/30">
              <Image
                src={copy.heroImage.src}
                alt={copy.heroImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ── Avisos recientes ────────────────────────────────────
          Prueba antes que promesa: si hay trabajo, se muestra acá. */}
      {latest.length > 0 && (
        <section
          aria-labelledby="recientes"
          className="border-b border-rule bg-paper"
        >
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="recientes" className="text-2xl md:text-3xl">
                Publicados esta semana
              </h2>
              <Link
                href="/empleos"
                className="text-lg font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800 dark:text-primary-200"
              >
                Ver los {jobCount.toLocaleString("es-AR")} avisos
              </Link>
            </div>

            <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-3">
              {latest.map((job) => (
                <li key={job.id} className="bg-surface">
                  <Link
                    href={`/empleos/${job.id}`}
                    className="flex h-full flex-col p-6 transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  >
                    <h3 className="font-display text-xl font-semibold">
                      {job.title}
                    </h3>
                    <p className="mt-2 text-base text-ink-soft">
                      {job.company.name}
                    </p>
                    <p className="mt-1 text-base text-ink-soft">
                      {job.city ? `${job.city}, ${job.province}` : job.province}
                    </p>
                    {job.salaryArsMin && (
                      <p className="mt-4 text-base font-semibold text-primary-700 dark:text-primary-200">
                        Desde {formatCurrency(job.salaryArsMin)}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Beneficios ──────────────────────────────────────── */}
      <section
        aria-labelledby="beneficios"
        className="border-b border-rule bg-surface"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-measure">
            <h2 id="beneficios" className="text-2xl md:text-3xl">
              {copy.benefitsTitle}
            </h2>
            <p className="mt-4 text-lg text-ink-soft">{copy.benefitsLead}</p>
          </div>

          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {copy.benefits.map((benefit) => (
              <li key={benefit.title} className="md:pr-6">
                <span className="inline-flex text-primary-600 dark:text-primary-300">
                  <LineIcon name={benefit.icon} size={32} />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">
                  {benefit.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Cómo postularse ─────────────────────────────────────
          Acá los números SÍ corresponden: es una secuencia real. */}
      <section
        aria-labelledby="pasos"
        className="border-b border-rule bg-paper"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <h2 id="pasos" className="text-2xl md:text-3xl">
            {copy.stepsTitle}
          </h2>

          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-primary-600 pt-5">
                <span className="font-display text-lg font-semibold text-primary-600 dark:text-primary-300">
                  Paso {index + 1}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Confianza ───────────────────────────────────────── */}
      <section
        aria-labelledby="confianza"
        className="border-b border-rule bg-surface"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-12 lg:py-20">
          <h2 id="confianza" className="text-2xl md:text-3xl lg:col-span-4">
            {copy.trustTitle}
          </h2>

          <ul className="lg:col-span-8 lg:pl-8">
            {copy.trustPoints.map((point, index) => (
              <li
                key={point.label}
                className={`flex gap-5 py-6 ${
                  index > 0 ? "border-t border-rule" : "pt-0"
                }`}
              >
                <span className="mt-0.5 shrink-0 text-secondary-600 dark:text-secondary-300">
                  <LineIcon name={point.icon} size={26} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    {point.label}
                  </h3>
                  <p className="mt-1.5 text-base text-ink-soft">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Cierre ──────────────────────────────────────────── */}
      <section className="bg-primary-700 dark:bg-primary-900">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-measure">
            <h2 className="text-2xl text-white md:text-3xl">{copy.ctaTitle}</h2>
            <p className="mt-4 text-lg text-primary-100">{copy.ctaLead}</p>
            <Link
              href="/empleos"
              className="mt-8 inline-flex min-h-[56px] items-center justify-center rounded-md bg-white px-8 text-lg font-semibold text-primary-700 transition-colors hover:bg-primary-50"
            >
              Ver empleos disponibles
            </Link>
          </div>

          {/* Puente al otro portal: si alguien llegó al equivocado,
              orientarlo es el mejor servicio. El contenido no se
              mezcla, pero las personas sí se guían. */}
          <div className="mt-12 border-t border-primary-500/40 pt-8">
            <p className="text-base text-primary-100">
              {portalId === "JUBI" ? (
                <>
                  ¿Tenés una discapacidad? En{" "}
                  <a
                    href="https://inclujobs.com"
                    className="font-semibold text-white underline underline-offset-4"
                  >
                    InclúJobs
                  </a>{" "}
                  cada aviso declara sus condiciones de accesibilidad antes de
                  que te postules.
                </>
              ) : (
                <>
                  ¿Estás jubilado o jubilada? En{" "}
                  <a
                    href="https://jubijobs.com"
                    className="font-semibold text-white underline underline-offset-4"
                  >
                    JubiJobs
                  </a>{" "}
                  vas a encontrar trabajos part-time y por día para mayores de
                  60.
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

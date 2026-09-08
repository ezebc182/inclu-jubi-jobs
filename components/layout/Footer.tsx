import Link from "next/link";
import type { BrandSlug } from "@/lib/brand-assets";

const BLURB: Record<BrandSlug, string> = {
  jubi: "Conectamos tu experiencia con empresas que la valoran. Trabajos part-time, flexibles y por día en toda la Argentina.",
  inclu:
    "Empleo inclusivo en Argentina. Cada aviso declara sus condiciones de accesibilidad antes de que te postules.",
};

export function Footer({
  portalName,
  brand,
}: {
  portalName: string;
  brand: BrandSlug;
}) {
  return (
    <footer
      role="contentinfo"
      className="border-t border-rule bg-surface py-12"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-primary-700 dark:text-primary-300">
              {portalName}
            </h3>
            <p className="text-lg leading-relaxed text-ink-soft">
              {BLURB[brand]}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold text-ink">
              Enlaces
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/como-funciona"
                  className="text-lg text-ink-soft transition-colors hover:text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 dark:hover:text-primary-400"
                >
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/preguntas-frecuentes"
                  className="text-lg text-ink-soft transition-colors hover:text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 dark:hover:text-primary-400"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              {/* En InclúJobs la inclusión es el portal entero, no una
                  sección aparte: el link solo tiene sentido en JubiJobs. */}
              {brand === "jubi" && (
                <li>
                  <Link
                    href="/discapacidad"
                    className="text-lg text-ink-soft transition-colors hover:text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 dark:hover:text-primary-400"
                  >
                    Trabajo inclusivo
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/accesibilidad"
                  className="text-lg text-ink-soft transition-colors hover:text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 dark:hover:text-primary-400"
                >
                  Accesibilidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold text-ink">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/privacidad"
                  className="text-lg text-ink-soft transition-colors hover:text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 dark:hover:text-primary-400"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-lg text-ink-soft transition-colors hover:text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 dark:hover:text-primary-400"
                >
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-rule pt-8 text-center">
          <p className="text-lg text-ink-soft">
            © {new Date().getFullYear()} {portalName}. Todos los derechos
            reservados.
          </p>
          <p className="mt-2 text-lg text-ink-soft">
            Hecho en Argentina con 💙
          </p>
        </div>
      </div>
    </footer>
  );
}

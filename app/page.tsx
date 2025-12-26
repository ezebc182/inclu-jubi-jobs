import { BigCTAButton } from "@/components/ui/BigCTAButton";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white px-4 py-20 transition-colors dark:from-gray-800 dark:to-gray-900 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100 md:text-5xl lg:text-6xl">
            Trabajos para jubilados.
            <br />
            Simple, claro y sin vueltas.
          </h1>
          <p className="mb-10 text-xl leading-relaxed text-gray-700 dark:text-gray-300 md:text-2xl">
            Conectamos tu experiencia con empresas que la valoran. Sin LinkedIn,
            sin complicaciones. Solo tres preguntas y un click.
          </p>
          <div className="flex flex-col justify-center gap-5 sm:flex-row">
            <BigCTAButton href="/empleos">Buscar empleos</BigCTAButton>
            <BigCTAButton href="/empresas" variant="secondary">
              Publicar empleo
            </BigCTAButton>
          </div>
          <p className="mt-8 text-lg text-gray-600 dark:text-gray-400">
            🔒 Ingresá con Google o Microsoft. Sin contraseñas, sin formularios
            eternos.
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="px-4 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
            ¿Por qué JubiJobs?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 text-4xl">🤝</div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Mantenete activo
              </h3>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Seguí en movimiento, conocé gente nueva y mantenete involucrado
                en la vida laboral. Trabajar no es solo dinero, es propósito.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 text-4xl">💰</div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Complementá tu jubilación
              </h3>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Generá ingresos extra con trabajos flexibles, part-time o por
                día. Vos decidís cuánto querés trabajar.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 text-4xl">🏆</div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Tu experiencia vale
              </h3>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Las empresas buscan tu conocimiento, responsabilidad y dedicación.
                Décadas de experiencia tienen valor real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sin LinkedIn, sin vueltas */}
      <section className="bg-gradient-to-b from-white to-primary-50 px-4 py-20 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
            Sin LinkedIn, sin vueltas
          </h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-700 dark:border dark:border-gray-600">
              <span className="text-3xl text-success-600 dark:text-success-400">✓</span>
              <div>
                <strong className="text-xl text-gray-900 dark:text-gray-100">3 preguntas simples:</strong>
                <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
                  ¿Qué hiciste? ¿Qué sabés hacer? ¿Qué te gustaría hacer? Eso
                  es todo.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-700 dark:border dark:border-gray-600">
              <span className="text-3xl text-success-600 dark:text-success-400">✓</span>
              <div>
                <strong className="text-xl text-gray-900 dark:text-gray-100">Registro en 1 paso:</strong>
                <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
                  Ingresá con Google o Microsoft y listo. Sin contraseñas
                  que recordar.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-700 dark:border dark:border-gray-600">
              <span className="text-3xl text-success-600 dark:text-success-400">✓</span>
              <div>
                <strong className="text-xl text-gray-900 dark:text-gray-100">Diseño accesible:</strong>
                <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
                  Tipografía grande, alto contraste, navegación simple. Pensado
                  para vos.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-700 dark:border dark:border-gray-600">
              <span className="text-3xl text-success-600 dark:text-success-400">✓</span>
              <div>
                <strong className="text-xl text-gray-900 dark:text-gray-100">Para empresas también:</strong>
                <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
                  Publicá empleos en minutos y recibí postulaciones claras. Gratis.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Sección Inclusiva */}
      <section className="bg-white px-4 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100">
            Trabajo inclusivo
          </h2>
          <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
            Oportunidades laborales para personas con discapacidad. Tu experiencia
            y talento importan.
          </p>
          <p className="mb-10 text-lg text-gray-700 dark:text-gray-400">
            En JubiJobs podés indicar tu tipo de discapacidad y necesidades de
            accesibilidad. Las empresas ven tu perfil completo antes de
            contactarte, para que el espacio de trabajo esté preparado según tus
            necesidades.
          </p>
          <Link
            href="/discapacidad"
            className="inline-flex min-h-[48px] items-center rounded-lg bg-secondary-500 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-secondary-600 focus:outline-none focus:ring-4 focus:ring-secondary-300 dark:bg-secondary-400 dark:hover:bg-secondary-500"
          >
            Conocer más sobre inclusión →
          </Link>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-b from-primary-100 to-white px-4 py-20 dark:from-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
            ¿Listo para empezar?
          </h2>
          <p className="mb-10 text-xl text-gray-700 dark:text-gray-300">
            Encontrá tu próximo trabajo en menos de 5 minutos.
          </p>
          <div className="flex flex-col justify-center gap-5 sm:flex-row">
            <BigCTAButton href="/empleos">Ver empleos disponibles</BigCTAButton>
            <Link
              href="/como-funciona"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-primary-600 bg-white px-8 py-4 text-lg font-semibold text-primary-600 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:border-primary-400 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700"
            >
              Cómo funciona
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

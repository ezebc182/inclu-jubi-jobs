import { BigCTAButton } from "@/components/ui/BigCTAButton";

export const metadata = {
  title: "Trabajo Inclusivo - JubiJobs",
  description:
    "Oportunidades laborales para personas con discapacidad en Argentina",
};

export default function DiscapacidadPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 transition-colors">
      <section className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-ink md:text-5xl">
          Trabajo inclusivo
        </h1>
        <p className="mb-8 text-xl text-ink-soft md:text-2xl">
          Oportunidades laborales para personas con discapacidad. Tu experiencia
          y talento importan.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <BigCTAButton href="/empleos">Ver empleos inclusivos</BigCTAButton>
          <BigCTAButton href="/onboarding" variant="secondary">
            Crear mi perfil
          </BigCTAButton>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-ink">
          ¿Por qué JubiJobs es inclusivo?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6 transition-colors dark:border-purple-700 dark:bg-purple-950">
            <h3 className="mb-3 text-2xl font-bold text-purple-900 dark:text-purple-300">
              ♿ Campo específico en tu perfil
            </h3>
            <p className="text-lg text-purple-800 dark:text-purple-200">
              Podés indicar tu tipo de discapacidad y necesidades de
              accesibilidad. Las empresas lo ven antes de contactarte.
            </p>
          </div>

          <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6 transition-colors dark:border-purple-700 dark:bg-purple-950">
            <h3 className="mb-3 text-2xl font-bold text-purple-900 dark:text-purple-300">
              ♿ Diseño accesible
            </h3>
            <p className="text-lg text-purple-800 dark:text-purple-200">
              Tipografía grande, alto contraste, navegación simple, compatible
              con lectores de pantalla.
            </p>
          </div>

          <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6 transition-colors dark:border-purple-700 dark:bg-purple-950">
            <h3 className="mb-3 text-2xl font-bold text-purple-900 dark:text-purple-300">
              ♿ Empresas informadas
            </h3>
            <p className="text-lg text-purple-800 dark:text-purple-200">
              Las empresas ven tu perfil completo y pueden preparar el espacio
              de trabajo según tus necesidades.
            </p>
          </div>

          <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6 transition-colors dark:border-purple-700 dark:bg-purple-950">
            <h3 className="mb-3 text-2xl font-bold text-purple-900 dark:text-purple-300">
              ♿ Sin discriminación
            </h3>
            <p className="text-lg text-purple-800 dark:text-purple-200">
              Todas las postulaciones son revisadas. Tu experiencia y
              habilidades son lo más importante.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16 rounded-lg bg-primary-50 p-8 transition-colors">
        <h2 className="mb-6 text-center text-3xl font-bold text-ink">
          Cómo funciona
        </h2>
        <div className="mx-auto max-w-3xl">
          <ol className="space-y-6 text-lg text-ink-soft">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white dark:bg-purple-500">
                1
              </span>
              <div>
                <strong>Creá tu perfil:</strong> Ingresá con Google o Microsoft.
                Indicá que sos una persona con discapacidad.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white dark:bg-purple-500">
                2
              </span>
              <div>
                <strong>Detallá tus necesidades:</strong> Tipo de discapacidad,
                necesidades de accesibilidad (rampas, baños adaptados, etc.).
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white dark:bg-purple-500">
                3
              </span>
              <div>
                <strong>Respondé 3 preguntas:</strong> ¿Qué hiciste? ¿Qué sabés
                hacer? ¿Qué te gustaría hacer?
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white dark:bg-purple-500">
                4
              </span>
              <div>
                <strong>Postulate y esperá contacto:</strong> Las empresas ven
                tu perfil completo y se comunican si hay match.
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-ink">
          Ley de inclusión laboral
        </h2>
        <div className="mx-auto max-w-3xl rounded-lg border-2 border-rule bg-white p-8 transition-colors">
          <p className="mb-4 text-lg text-ink-soft">
            En Argentina, la Ley 22.431 establece el sistema de protección
            integral de las personas con discapacidad.
          </p>
          <p className="mb-4 text-lg text-ink-soft">
            Las empresas y organismos públicos están obligados a contratar
            personas con discapacidad en un porcentaje mínimo de su planta de
            personal.
          </p>
          <p className="text-lg text-ink-soft">
            <strong>JubiJobs facilita esta conexión</strong> entre personas con
            discapacidad que buscan trabajo y empresas comprometidas con la
            inclusión.
          </p>
        </div>
      </section>

      <section className="text-center">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          Empezá a buscar trabajo hoy
        </h2>
        <BigCTAButton href="/onboarding">
          Crear mi perfil inclusivo
        </BigCTAButton>
      </section>
    </div>
  );
}

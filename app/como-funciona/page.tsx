import { BigCTAButton } from "@/components/ui/BigCTAButton";

export const metadata = {
  title: "Cómo funciona - JubiJobs",
  description: "Aprende cómo funciona JubiJobs para candidatos y empresas",
};

export default function ComoFuncionaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold text-ink">
        ¿Cómo funciona JubiJobs?
      </h1>
      <p className="mb-12 text-center text-xl text-ink-soft">
        Simple, claro y sin vueltas. En 3 pasos estás listo.
      </p>

      <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section>
          <h2 className="mb-6 text-3xl font-bold text-primary-700 dark:text-primary-400">
            Para candidatos (jubilados)
          </h2>
          <ol className="space-y-6 text-lg text-ink-soft">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                1
              </span>
              <div>
                <strong>Ingresá con tu cuenta de Google:</strong> No necesitás
                crear usuario ni contraseña.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                2
              </span>
              <div>
                <strong>Completá 3 preguntas:</strong> ¿Qué hiciste? ¿Qué sabés
                hacer? ¿Qué te gustaría hacer? Eso es todo.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                3
              </span>
              <div>
                <strong>Buscá y postulate:</strong> Filtrá empleos por
                provincia, modalidad y jornada. Un click y estás postulado.
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-6 text-3xl font-bold text-primary-700 dark:text-primary-400">
            Para empresas
          </h2>
          <ol className="space-y-6 text-lg text-ink-soft">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                1
              </span>
              <div>
                <strong>Ingresá y creá tu perfil de empresa:</strong> OAuth
                rápido, datos básicos de tu empresa.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                2
              </span>
              <div>
                <strong>Publicá empleos:</strong> Título, descripción,
                ubicación, modalidad, jornada, salario. 5 minutos.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                3
              </span>
              <div>
                <strong>Recibí postulaciones y contactá:</strong> Revisá las 3
                respuestas de cada candidato. Un botón para solicitar contacto.
              </div>
            </li>
          </ol>
        </section>
      </div>

      <section className="mb-16 rounded-lg bg-paper p-8">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          Sin LinkedIn, sin vueltas
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-surface p-6">
            <h3 className="mb-3 text-xl font-bold text-ink">
              ❌ Lo que NO necesitás
            </h3>
            <ul className="space-y-2 text-base text-ink-soft">
              <li>• CV en PDF</li>
              <li>• Perfil de LinkedIn</li>
              <li>• Carta de presentación</li>
              <li>• Foto profesional</li>
              <li>• Referencias laborales</li>
            </ul>
          </div>

          <div className="rounded-lg bg-primary-50 p-6 transition-colors dark:bg-primary-950">
            <h3 className="mb-3 text-xl font-bold text-primary-900 dark:text-primary-300">
              ✓ Lo que SÍ necesitás
            </h3>
            {/* "Cuenta de Google" a secas: decía "Google, Facebook, Microsoft
                o número de teléfono" y tres de esos cuatro no están
                disponibles. Enumerar métodos que no existen manda a la persona
                a buscar un botón que no va a encontrar. */}
            <ul className="space-y-2 text-base text-primary-800 dark:text-primary-200">
              <li>Una cuenta de Google</li>
              <li>3 respuestas honestas y simples</li>
              <li>Ganas de trabajar</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          ¿Listo para empezar?
        </h2>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <BigCTAButton href="/empleos">Buscar empleos</BigCTAButton>
          <BigCTAButton href="/empresas" variant="secondary">
            Publicar empleo
          </BigCTAButton>
        </div>
      </section>
    </div>
  );
}

import { BigCTAButton } from "@/components/ui/BigCTAButton";
import { PublishJobButton } from "@/components/ui/PublishJobButton";

export const metadata = {
  title: "Para Empresas - JubiJobs",
  description:
    "Publicá empleos y conectá con profesionales jubilados experimentados",
};

export default function EmpresasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 transition-colors">
      <section className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-ink md:text-5xl">
          Contratá talento con experiencia
        </h1>
        <p className="mb-8 text-xl text-ink-soft md:text-2xl">
          Personas jubiladas con conocimientos, responsabilidad y ganas de
          seguir activas.
        </p>
        <PublishJobButton>Publicar un empleo</PublishJobButton>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-ink">
          ¿Por qué contratar jubilados?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border-2 border-rule bg-white p-6 transition-colors">
            <h3 className="mb-3 text-2xl font-bold text-primary-700 dark:text-primary-400">
              Experiencia comprobada
            </h3>
            <p className="text-lg text-ink-soft">
              Décadas de trayectoria profesional en diversos rubros. Saben
              resolver problemas y tomar decisiones.
            </p>
          </div>

          <div className="rounded-lg border-2 border-rule bg-white p-6 transition-colors">
            <h3 className="mb-3 text-2xl font-bold text-primary-700 dark:text-primary-400">
              Responsabilidad y compromiso
            </h3>
            <p className="text-lg text-ink-soft">
              Alto nivel de compromiso con el trabajo. Puntualidad, dedicación y
              profesionalismo.
            </p>
          </div>

          <div className="rounded-lg border-2 border-rule bg-white p-6 transition-colors">
            <h3 className="mb-3 text-2xl font-bold text-primary-700 dark:text-primary-400">
              Flexibilidad horaria
            </h3>
            <p className="text-lg text-ink-soft">
              Ideales para puestos part-time, por día o con horarios flexibles
              que se adapten a tu negocio.
            </p>
          </div>

          <div className="rounded-lg border-2 border-rule bg-white p-6 transition-colors">
            <h3 className="mb-3 text-2xl font-bold text-primary-700 dark:text-primary-400">
              Trato con clientes
            </h3>
            <p className="text-lg text-ink-soft">
              Excelentes habilidades de comunicación y empatía. Generan
              confianza en clientes de todas las edades.
            </p>
          </div>

          <div className="rounded-lg border-2 border-rule bg-white p-6 transition-colors">
            <h3 className="mb-3 text-2xl font-bold text-primary-700 dark:text-primary-400">
              Transmiten conocimiento
            </h3>
            <p className="text-lg text-ink-soft">
              Pueden capacitar y guiar a empleados más jóvenes con su
              experiencia y sabiduría.
            </p>
          </div>

          <div className="rounded-lg border-2 border-rule bg-white p-6 transition-colors">
            <h3 className="mb-3 text-2xl font-bold text-primary-700 dark:text-primary-400">
              Costo-beneficio
            </h3>
            <p className="text-lg text-ink-soft">
              Complementan su jubilación, permitiendo esquemas laborales
              flexibles y mutuamente beneficiosos.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16 rounded-lg bg-primary-50 p-8 transition-colors">
        <h2 className="mb-6 text-center text-3xl font-bold text-ink">
          Cómo funciona para empresas
        </h2>
        <div className="mx-auto max-w-3xl">
          <ol className="space-y-6 text-lg text-ink-soft">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                1
              </span>
              <div>
                <strong>Creá tu perfil:</strong> Ingresá con Google, Facebook,
                Microsoft o tu teléfono y completá los datos de tu empresa.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                2
              </span>
              <div>
                <strong>Publicá empleos:</strong> Describí el puesto, ubicación,
                modalidad y jornada. En minutos.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                3
              </span>
              <div>
                <strong>Recibí postulaciones:</strong> Los candidatos responden
                3 preguntas simples sobre su experiencia.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white dark:bg-primary-500">
                4
              </span>
              <div>
                <strong>Contactá candidatos:</strong> Revisá los perfiles y
                solicitá contacto directo con un click.
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="text-center">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          Empezá hoy mismo
        </h2>
        <p className="mb-8 text-xl text-ink-soft">
          Publicar empleos es gratis. Sin costos ocultos, sin planes premium.
        </p>
        <PublishJobButton>Publicar mi primer empleo</PublishJobButton>
      </section>
    </div>
  );
}

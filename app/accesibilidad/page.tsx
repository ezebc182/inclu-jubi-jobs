export const metadata = {
  title: "Accesibilidad - JubiJobs",
  description: "Compromiso de JubiJobs con la accesibilidad web",
};

export default function AccesibilidadPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        Accesibilidad
      </h1>

      <section className="mb-12">
        <p className="mb-4 text-lg text-gray-700">
          JubiJobs está comprometido con hacer que nuestra plataforma sea accesible para todas las personas, incluyendo aquellas con discapacidades.
        </p>
        <p className="text-lg text-gray-700">
          Nos esforzamos por cumplir con las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 nivel AA.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">
          Características de accesibilidad
        </h2>
        <ul className="space-y-4 text-lg text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <strong>Tipografía grande:</strong> Tamaño base de 18-20px para facilitar la lectura.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <strong>Alto contraste:</strong> Colores con suficiente contraste entre texto y fondo.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <strong>Botones grandes:</strong> Controles de mínimo 44x44 píxeles para facilitar el click.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <strong>Navegación por teclado:</strong> Toda la plataforma es navegable sin mouse.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <strong>Indicadores de foco visibles:</strong> Resaltado claro del elemento enfocado.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <strong>Etiquetas ARIA:</strong> Etiquetas descriptivas para lectores de pantalla.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <strong>Skip to content:</strong> Enlace para saltar directamente al contenido principal.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <strong>Formularios claros:</strong> Labels grandes, mensajes de error descriptivos.
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">
          Lectores de pantalla
        </h2>
        <p className="mb-4 text-lg text-gray-700">
          JubiJobs es compatible con los siguientes lectores de pantalla:
        </p>
        <ul className="space-y-2 text-lg text-gray-700">
          <li>• NVDA (Windows)</li>
          <li>• JAWS (Windows)</li>
          <li>• VoiceOver (macOS, iOS)</li>
          <li>• TalkBack (Android)</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">
          Retroalimentación
        </h2>
        <p className="mb-4 text-lg text-gray-700">
          Si encontrás alguna barrera de accesibilidad en JubiJobs, por favor contactanos. Tu feedback es fundamental para mejorar.
        </p>
        <p className="text-lg text-gray-700">
          Estamos comprometidos a mejorar continuamente la accesibilidad de nuestra plataforma.
        </p>
      </section>

      <section className="rounded-lg bg-primary-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Trabajo inclusivo
        </h2>
        <p className="mb-4 text-lg text-gray-700">
          Además de la accesibilidad web, JubiJobs facilita la inclusión laboral de personas con discapacidad.
        </p>
        <a
          href="/discapacidad"
          className="text-lg font-semibold text-primary-700 underline hover:text-primary-800"
        >
          Conocé más sobre trabajo inclusivo →
        </a>
      </section>
    </div>
  );
}

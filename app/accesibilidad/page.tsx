import Link from "next/link";

export const metadata = {
  title: "Declaración de Accesibilidad - JubiJobs",
  description:
    "Nuestro compromiso con la accesibilidad web y la inclusión digital para personas mayores y con discapacidad",
};

export default function DeclaracionAccesibilidadPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 transition-colors">
      <h1 className="mb-6 text-center text-4xl font-bold text-ink">
        Declaración de Accesibilidad
      </h1>
      <p className="mb-12 text-center text-xl text-ink-soft">
        Nuestro compromiso con la accesibilidad e inclusión digital
      </p>

      {/* Sección 1: Nuestro Compromiso */}
      <section className="mb-16 rounded-xl border-2 border-primary-200 bg-gradient-to-b from-primary-50 to-white p-8 transition-colors dark:border-primary-800 dark:from-primary-950 dark:to-surface">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          Nuestro compromiso
        </h2>
        <div className="space-y-4 text-lg text-ink-soft">
          <p>
            <strong className="text-ink">
              JubiJobs
            </strong>{" "}
            se compromete a garantizar que nuestra plataforma sea accesible para
            todas las personas, incluyendo aquellas con discapacidades y
            personas mayores.
          </p>
          <p>
            Creemos que el acceso al empleo es un derecho fundamental, y
            trabajamos constantemente para mejorar la experiencia de todos
            nuestros usuarios, independientemente de sus capacidades o la
            tecnología que utilicen.
          </p>
          <p>
            Esta declaración fue actualizada el{" "}
            <strong>27 de diciembre de 2025</strong>.
          </p>
        </div>
      </section>

      {/* Sección 2: Estándares de Cumplimiento */}
      <section className="mb-16 rounded-xl border-2 border-rule bg-white p-8 transition-colors">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          Estándares de cumplimiento
        </h2>
        <div className="space-y-6">
          <div className="rounded-lg bg-green-50 p-6 transition-colors dark:bg-green-950">
            <h3 className="mb-3 flex items-center gap-3 text-2xl font-bold text-green-900 dark:text-green-200">
              <span className="text-3xl" aria-hidden="true">
                ✓
              </span>
              WCAG 2.1 Nivel AA
            </h3>
            <p className="text-lg text-green-800 dark:text-green-300">
              JubiJobs cumple con las Pautas de Accesibilidad para el Contenido
              Web (WCAG) 2.1 en el nivel AA. Estas pautas son reconocidas
              internacionalmente y garantizan que nuestro sitio sea usable por
              la mayor cantidad de personas posible.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-6 transition-colors dark:bg-blue-950">
            <h3 className="mb-3 flex items-center gap-3 text-2xl font-bold text-blue-900 dark:text-blue-200">
              <span className="text-3xl" aria-hidden="true">
                ✓
              </span>
              Diseño inclusivo para mayores de 60 años
            </h3>
            <p className="text-lg text-blue-800 dark:text-blue-300">
              Nuestra plataforma está diseñada específicamente pensando en
              personas mayores, con tipografía grande, contraste alto, y una
              interfaz simple y clara.
            </p>
          </div>
        </div>
      </section>

      {/* Sección 3: Características de Accesibilidad */}
      <section className="mb-16 rounded-xl border-2 border-rule bg-white p-8 transition-colors">
        <h2 className="mb-8 text-3xl font-bold text-ink">
          Características de accesibilidad implementadas
        </h2>

        <div className="space-y-8">
          {/* Tipografía y Legibilidad */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-primary-700 dark:text-primary-400">
              📖 Tipografía y Legibilidad
            </h3>
            <ul className="ml-6 space-y-3 text-lg text-ink-soft">
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Tamaño de fuente base: 18px</strong> - Más grande que
                  el estándar web (16px)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Control de tamaño de texto</strong> - Los usuarios
                  pueden aumentar el tamaño del texto hasta un 25% más
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Altura de línea: 1.7</strong> - Espaciado generoso
                  para mejor legibilidad
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Fuente sans-serif</strong> - Más fácil de leer en
                  pantallas
                </span>
              </li>
            </ul>
          </div>

          {/* Contraste y Colores */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-primary-700 dark:text-primary-400">
              🎨 Contraste y Colores
            </h3>
            <ul className="ml-6 space-y-3 text-lg text-ink-soft">
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Relación de contraste mínima: 4.5:1</strong> - Cumple
                  con WCAG AA para texto normal
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Modo oscuro completo</strong> - Reduce el cansancio
                  visual en ambientes con poca luz
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Sin dependencia del color</strong> - La información
                  nunca se transmite solo mediante colores
                </span>
              </li>
            </ul>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-primary-700 dark:text-primary-400">
              🧭 Navegación
            </h3>
            <ul className="ml-6 space-y-3 text-lg text-ink-soft">
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Enlace "Saltar al contenido"</strong> - Permite omitir
                  la navegación repetitiva
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Landmarks semánticos</strong> - Estructura clara para
                  lectores de pantalla (header, nav, main, footer)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Navegación por teclado completa</strong> - Todas las
                  funciones accesibles sin mouse
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Indicador de foco visible</strong> - Borde azul de 3px
                  en elementos activos
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Menú móvil responsive</strong> - Accesible en
                  dispositivos táctiles
                </span>
              </li>
            </ul>
          </div>

          {/* Formularios */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-primary-700 dark:text-primary-400">
              📝 Formularios
            </h3>
            <ul className="ml-6 space-y-3 text-lg text-ink-soft">
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Etiquetas claras y descriptivas</strong> - Cada campo
                  tiene una etiqueta visible
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Mensajes de error accesibles</strong> - Asociados
                  programáticamente con ARIA attributes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Tamaño de campos de entrada: mínimo 44px</strong> -
                  Cumple con WCAG para objetivos táctiles
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Validación en tiempo real</strong> - Feedback
                  inmediato sobre errores
                </span>
              </li>
            </ul>
          </div>

          {/* Botones e Interacción */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-primary-700 dark:text-primary-400">
              🔘 Botones e Interacción
            </h3>
            <ul className="ml-6 space-y-3 text-lg text-ink-soft">
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Tamaño mínimo de botones: 44x44px</strong> - Fáciles
                  de tocar en dispositivos móviles
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Espaciado generoso</strong> - Evita clics accidentales
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Estados hover y focus claros</strong> - Feedback
                  visual al pasar el cursor o seleccionar
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Textos descriptivos</strong> - Botones con etiquetas
                  claras ("Postularme" en lugar de "Enviar")
                </span>
              </li>
            </ul>
          </div>

          {/* Notificaciones */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-primary-700 dark:text-primary-400">
              🔔 Notificaciones y Feedback
            </h3>
            <ul className="ml-6 space-y-3 text-lg text-ink-soft">
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Toasts no bloqueantes</strong> - Mensajes de
                  éxito/error que no interrumpen el flujo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Tipografía grande en notificaciones: 18px</strong> -
                  Fácil de leer
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Duración extendida</strong> - 5-7 segundos para dar
                  tiempo a leer
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Anuncios para lectores de pantalla</strong> - Regiones
                  ARIA live para cambios dinámicos
                </span>
              </li>
            </ul>
          </div>

          {/* Seguridad */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-primary-700 dark:text-primary-400">
              🔒 Seguridad y Privacidad
            </h3>
            <ul className="ml-6 space-y-3 text-lg text-ink-soft">
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Sin contraseñas</strong> - Autenticación mediante
                  Google, Microsoft, Facebook o SMS
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>Rate limiting en OTP</strong> - Protección contra
                  abuso de códigos SMS (3 intentos / 15 minutos)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
                  •
                </span>
                <span>
                  <strong>HTTPS obligatorio</strong> - Todas las conexiones
                  cifradas
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 4: Tecnologías Asistivas */}
      <section className="mb-16 rounded-xl border-2 border-rule bg-white p-8 transition-colors">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          Compatibilidad con tecnologías asistivas
        </h2>
        <p className="mb-6 text-lg text-ink-soft">
          JubiJobs está diseñado para funcionar con las siguientes tecnologías
          asistivas:
        </p>
        <ul className="ml-6 space-y-3 text-lg text-ink-soft">
          <li className="flex items-start gap-3">
            <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
              ✓
            </span>
            <span>
              <strong>Lectores de pantalla:</strong> NVDA, JAWS, VoiceOver,
              TalkBack
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
              ✓
            </span>
            <span>
              <strong>Ampliadores de pantalla:</strong> ZoomText, Magnifier de
              Windows
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
              ✓
            </span>
            <span>
              <strong>Software de reconocimiento de voz:</strong> Dragon
              NaturallySpeaking
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
              ✓
            </span>
            <span>
              <strong>Navegación por teclado</strong> - Sin necesidad de mouse
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 font-bold text-primary-600 dark:text-primary-400">
              ✓
            </span>
            <span>
              <strong>Navegadores modernos:</strong> Chrome, Firefox, Safari,
              Edge (últimas 2 versiones)
            </span>
          </li>
        </ul>
      </section>

      {/* Sección 5: Limitaciones Conocidas */}
      <section className="mb-16 rounded-xl border-2 border-yellow-200 bg-yellow-50 p-8 transition-colors dark:border-yellow-800 dark:bg-yellow-950">
        <h2 className="mb-6 text-3xl font-bold text-ink dark:text-yellow-200">
          Limitaciones conocidas y mejoras en progreso
        </h2>
        <p className="mb-4 text-lg text-ink-soft dark:text-yellow-300">
          Estamos constantemente mejorando nuestra accesibilidad. Algunas áreas
          en las que seguimos trabajando:
        </p>
        <ul className="ml-6 space-y-3 text-lg text-ink-soft dark:text-yellow-300">
          <li className="flex items-start gap-3">
            <span className="mt-1 font-bold text-yellow-600 dark:text-yellow-400">
              ⚠️
            </span>
            <span>
              Mejora continua de descripciones alternativas para imágenes
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 font-bold text-yellow-600 dark:text-yellow-400">
              ⚠️
            </span>
            <span>Implementación de atajos de teclado personalizados</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 font-bold text-yellow-600 dark:text-yellow-400">
              ⚠️
            </span>
            <span>Compatibilidad con más idiomas y dialectos regionales</span>
          </li>
        </ul>
      </section>

      {/* Sección 6: Feedback */}
      <section className="mb-16 rounded-xl border-4 border-primary-300 bg-gradient-to-b from-primary-50 to-white p-10 text-center shadow-lg transition-colors dark:border-primary-700 dark:from-primary-950 dark:to-surface">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          Tu feedback es importante
        </h2>
        <p className="mb-8 text-xl text-ink-soft">
          Si encontrás alguna barrera de accesibilidad en nuestra plataforma,
          por favor contanos para que podamos mejorar.
        </p>
        <div className="space-y-4">
          <a
            href="mailto:accesibilidad@jubijobs.com.ar?subject=Feedback%20de%20Accesibilidad"
            className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            📧 Reportar problema de accesibilidad
          </a>
          <p className="text-base text-ink-soft">
            Nos comprometemos a responder en un plazo de 5 días hábiles
          </p>
        </div>
      </section>

      {/* Sección 7: Recursos */}
      <section className="rounded-xl border-2 border-rule bg-white p-8 transition-colors">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          Recursos de ayuda
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            href="/ayuda"
            className="group rounded-lg border-2 border-rule bg-paper p-6 transition-all hover:border-primary-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-300 dark:hover:border-primary-400"
          >
            <h3 className="mb-2 text-xl font-bold text-ink group-hover:text-primary-600 dark:group-hover:text-primary-400">
              📚 Centro de Ayuda
            </h3>
            <p className="text-base text-ink-soft">
              Guías paso a paso para usar JubiJobs
            </p>
          </Link>

          <Link
            href="/como-funciona"
            className="group rounded-lg border-2 border-rule bg-paper p-6 transition-all hover:border-primary-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-300 dark:hover:border-primary-400"
          >
            <h3 className="mb-2 text-xl font-bold text-ink group-hover:text-primary-600 dark:group-hover:text-primary-400">
              💡 Cómo Funciona
            </h3>
            <p className="text-base text-ink-soft">
              Resumen rápido de la plataforma
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

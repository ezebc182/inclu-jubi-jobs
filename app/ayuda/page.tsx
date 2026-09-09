import type { Metadata } from "next";
import { BigCTAButton } from "@/components/ui/BigCTAButton";
import Link from "next/link";
import { getCurrentPortalConfig } from "@/lib/portal";

/**
 * La marca sale del portal del request.
 *
 * Antes decía "JubiJobs" fijo en el título y en siete lugares del cuerpo, así
 * que en inclujobs.com la página mezclaba las dos marcas: el encabezado y el
 * pie decían IncluJobs y el contenido, JubiJobs. Y es justamente la página que
 * alguien abre cuando ya está confundido.
 */
export async function generateMetadata(): Promise<Metadata> {
  const portal = await getCurrentPortalConfig();
  return {
    title: "Ayuda",
    description: `Guía paso a paso para usar ${portal.name} y encontrar empleo.`,
  };
}

export default async function AyudaPage() {
  const portal = await getCurrentPortalConfig();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-6 text-center text-4xl font-bold text-ink">
        Centro de Ayuda
      </h1>
      <p className="mb-12 text-center text-xl text-ink-soft">
        Guía paso a paso para usar {portal.name}. Todo lo que necesitás saber.
      </p>

      {/* Sección 1: Primeros Pasos */}
      <section className="mb-16 rounded-xl border-2 border-primary-200 bg-gradient-to-b from-primary-50 to-white p-8 transition-colors dark:border-primary-800 dark:from-primary-950 dark:to-surface">
        <h2 className="mb-8 text-3xl font-bold text-primary-900 dark:text-primary-300">
          1. Primeros pasos
        </h2>

        <div className="space-y-8">
          <div className="rounded-lg bg-surface p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-ink">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl text-white dark:bg-primary-500">
                1
              </span>
              Ingresar a la plataforma
            </h3>
            {/* Una sola opción, que es la única que existe. Antes enumeraba
                cuatro —Google, Microsoft, Facebook y teléfono— y tres no están
                disponibles. En la página de ayuda eso es doblemente grave: la
                lee alguien que ya se trabó, y le describe botones que no va a
                encontrar. */}
            <div className="ml-15 space-y-3 text-lg text-ink-soft">
              <p>
                Hacé click en el botón{" "}
                <strong>&quot;Continuar con Google&quot;</strong>. Te va a pedir
                permiso para usar tu cuenta de Gmail: hacé click en
                &quot;Permitir&quot; y ya estás adentro.
              </p>
              <p>
                Si usás Gmail en el celular, ya tenés una cuenta de Google: es
                la misma dirección de correo. Si no tenés, se crea gratis desde
                ese mismo botón.
              </p>
              <p className="rounded-lg border border-rule bg-paper p-4 text-base">
                <strong className="text-ink">
                  No necesitás crear ninguna contraseña.
                </strong>{" "}
                Cada vez que quieras entrar, hacés click en ese botón y listo.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-surface p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-ink">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl text-white dark:bg-primary-500">
                2
              </span>
              Completar tu perfil
            </h3>
            <div className="ml-15 space-y-3 text-lg text-ink-soft">
              <p>
                Después de ingresar por primera vez, te vamos a pedir que
                respondas <strong>3 preguntas simples:</strong>
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>¿Qué hiciste?</strong> Contanos tu experiencia
                  laboral. Por ejemplo: "Trabajé 30 años como contador en una
                  empresa textil".
                </li>
                <li>
                  <strong>¿Qué sabés hacer?</strong> Mencioná tus habilidades.
                  Por ejemplo: "Sé usar Excel, atender clientes, manejar caja
                  registradora".
                </li>
                <li>
                  <strong>¿Qué te gustaría hacer?</strong> Decinos qué tipo de
                  trabajo buscás. Por ejemplo: "Me gustaría trabajar part-time
                  como recepcionista".
                </li>
              </ul>
              <p className="rounded-lg bg-yellow-50 p-4 text-base dark:bg-yellow-900">
                <strong>Importante:</strong> Escribí con tus propias palabras.
                No hace falta usar lenguaje técnico. Sé honesto y claro. Las
                empresas valoran la sinceridad.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-surface p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-ink">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl text-white dark:bg-primary-500">
                3
              </span>
              Buscar empleos
            </h3>
            <div className="ml-15 space-y-3 text-lg text-ink-soft">
              <p>
                Hacé click en el menú <strong>"Empleos"</strong> (arriba a la
                derecha). Vas a ver todos los trabajos disponibles.
              </p>
              <p>
                <strong>Podés filtrar por:</strong>
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Provincia:</strong> Elegí dónde querés trabajar (CABA,
                  Buenos Aires, Córdoba, etc.)
                </li>
                <li>
                  <strong>Modalidad:</strong> Presencial, remoto o híbrido
                </li>
                <li>
                  <strong>Jornada:</strong> Completa, part-time, por hora
                </li>
              </ul>
              <p className="rounded-lg bg-green-50 p-4 text-base dark:bg-green-900">
                <strong>Tip:</strong> Si no sabés qué filtro usar, dejá todo sin
                seleccionar y vas a ver todas las ofertas disponibles.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-surface p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-ink">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl text-white dark:bg-primary-500">
                4
              </span>
              Postularte a un empleo
            </h3>
            <div className="ml-15 space-y-3 text-lg text-ink-soft">
              <p>Cuando encuentres un empleo que te interesa:</p>
              <ol className="ml-6 list-decimal space-y-2">
                <li>
                  Hacé click en el título del empleo para ver todos los detalles
                </li>
                <li>
                  Leé la descripción completa, el salario y los requisitos
                </li>
                <li>
                  Si te interesa, hacé click en el botón{" "}
                  <strong>"Postularme"</strong>
                </li>
                <li>Confirmá tu postulación</li>
                <li>¡Listo! La empresa va a ver tu perfil</li>
              </ol>
              <p className="rounded-lg bg-primary-100 p-4 text-base dark:bg-primary-900">
                <strong>Recordá:</strong> Podés postularte a todos los empleos
                que quieras. No hay límite. Mientras más postulaciones, más
                chances de conseguir trabajo.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-surface p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-ink">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl text-white dark:bg-primary-500">
                5
              </span>
              Ver tus postulaciones
            </h3>
            <div className="ml-15 space-y-3 text-lg text-ink-soft">
              <p>
                Hacé click en <strong>"Mis postulaciones"</strong> en el menú
                superior. Ahí vas a ver:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Todos los empleos a los que te postulaste</li>
                <li>El estado de cada postulación (pendiente, vista, etc.)</li>
                <li>La fecha en que te postulaste</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Navegación por Teclado */}
      <section className="mb-16 rounded-xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white p-8 transition-colors dark:border-blue-800 dark:from-blue-950 dark:to-surface">
        <h2 className="mb-8 text-3xl font-bold text-ink">
          2. Navegación por teclado
        </h2>
        <p className="mb-6 text-lg text-ink-soft">
          Podés usar {portal.name} completamente con el teclado, sin necesidad
          de mouse. Esto es útil si te resulta más cómodo o si usás tecnologías
          asistivas.
        </p>

        <div className="space-y-6">
          <div className="rounded-lg bg-surface p-6 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold text-blue-900 dark:text-blue-200">
              Teclas principales
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <kbd className="min-w-[100px] rounded-lg border border-rule bg-paper px-4 py-2 text-center text-lg font-bold text-ink shadow-sm">
                  Tab
                </kbd>
                <p className="flex-1 text-lg text-ink-soft">
                  Moverse al siguiente elemento (botón, enlace, campo de texto)
                </p>
              </div>

              <div className="flex items-start gap-4">
                <kbd className="min-w-[100px] rounded-lg border border-rule bg-paper px-4 py-2 text-center text-lg font-bold text-ink shadow-sm">
                  Shift + Tab
                </kbd>
                <p className="flex-1 text-lg text-ink-soft">
                  Volver al elemento anterior
                </p>
              </div>

              <div className="flex items-start gap-4">
                <kbd className="min-w-[100px] rounded-lg border border-rule bg-paper px-4 py-2 text-center text-lg font-bold text-ink shadow-sm">
                  Enter
                </kbd>
                <p className="flex-1 text-lg text-ink-soft">
                  Activar un botón o enlace, enviar un formulario
                </p>
              </div>

              <div className="flex items-start gap-4">
                <kbd className="min-w-[100px] rounded-lg border border-rule bg-paper px-4 py-2 text-center text-lg font-bold text-ink shadow-sm">
                  Espacio
                </kbd>
                <p className="flex-1 text-lg text-ink-soft">
                  Activar un botón, marcar una casilla
                </p>
              </div>

              <div className="flex items-start gap-4">
                <kbd className="min-w-[100px] rounded-lg border border-rule bg-paper px-4 py-2 text-center text-lg font-bold text-ink shadow-sm">
                  Esc
                </kbd>
                <p className="flex-1 text-lg text-ink-soft">
                  Cerrar menús o diálogos
                </p>
              </div>

              <div className="flex items-start gap-4">
                <kbd className="min-w-[100px] rounded-lg border border-rule bg-paper px-4 py-2 text-center text-lg font-bold text-ink shadow-sm">
                  ↑ ↓
                </kbd>
                <p className="flex-1 text-lg text-ink-soft">
                  Navegar por opciones en menús desplegables
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-surface p-6 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold text-blue-900 dark:text-blue-200">
              Indicador de foco
            </h3>
            <p className="mb-4 text-lg text-ink-soft">
              Cuando navegás con el teclado, el elemento seleccionado se marca
              con un <strong>borde azul grueso</strong>. Esto te indica dónde
              estás en la página.
            </p>
            <div className="rounded-lg border-4 border-blue-600 bg-blue-50 p-4 transition-colors dark:border-blue-400 dark:bg-blue-950">
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                Ejemplo de elemento con foco ← Este borde azul
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-surface p-6 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold text-blue-900 dark:text-blue-200">
              Saltar al contenido principal
            </h3>
            <p className="mb-4 text-lg text-ink-soft">
              Al cargar cualquier página, presioná{" "}
              <kbd className="rounded border border-rule bg-paper px-2 py-1 font-mono">
                Tab
              </kbd>{" "}
              una vez y vas a ver un enlace especial:
            </p>
            <div className="rounded-lg bg-blue-600 p-4 text-center">
              <p className="text-lg font-semibold text-white">
                "Saltar al contenido principal"
              </p>
            </div>
            <p className="mt-4 text-lg text-ink-soft">
              Si presionás{" "}
              <kbd className="rounded border border-rule bg-paper px-2 py-1 font-mono">
                Enter
              </kbd>
              , vas directo al contenido sin tener que pasar por todos los
              enlaces del menú.
            </p>
          </div>
        </div>
      </section>

      {/* Sección 3: Herramientas de Accesibilidad */}
      <section className="mb-16 rounded-xl border border-rule bg-surface p-8">
        <h2 className="mb-8 text-3xl font-bold text-ink">
          3. Herramientas de accesibilidad
        </h2>

        <div className="space-y-8">
          <div className="rounded-lg bg-paper p-6">
            <h3 className="mb-4 text-2xl font-bold text-ink">
              Ajustar el tamaño del texto
            </h3>
            <div className="space-y-3 text-lg text-ink-soft">
              <p>
                Si las letras te parecen muy chicas o muy grandes, podés cambiar
                el tamaño:
              </p>
              <ol className="ml-6 list-decimal space-y-2">
                <li>
                  Buscá el control <strong>"Texto:"</strong> en la parte
                  superior derecha
                </li>
                <li>
                  Hacé click en el botón <strong>"-"</strong> para hacer las
                  letras más chicas
                </li>
                <li>
                  Hacé click en el botón <strong>"+"</strong> para hacer las
                  letras más grandes
                </li>
                <li>
                  Si querés volver al tamaño original, hacé click en el botón de
                  reiniciar (flecha circular)
                </li>
              </ol>
              <p className="rounded-lg bg-primary-100 p-4 text-base dark:bg-primary-900">
                <strong>Se guarda automáticamente:</strong> La próxima vez que
                ingreses, el tamaño de texto va a quedar como lo configuraste.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-paper p-6">
            <h3 className="mb-4 text-2xl font-bold text-ink">
              Cambiar entre modo claro y oscuro
            </h3>
            <div className="space-y-3 text-lg text-ink-soft">
              <p>
                Si te molesta la luz de la pantalla o preferís colores más
                oscuros:
              </p>
              <ol className="ml-6 list-decimal space-y-2">
                <li>
                  Buscá el botón de tema en la parte superior derecha (ícono de
                  sol/luna)
                </li>
                <li>
                  Hacé click para cambiar entre modo claro (fondo blanco) y modo
                  oscuro (fondo gris)
                </li>
              </ol>
              <p className="rounded-lg bg-paper p-4 text-base">
                <strong>Beneficios del modo oscuro:</strong> Cansa menos la
                vista, especialmente si usás la computadora de noche. Ahorra
                batería en celulares con pantalla OLED.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-paper p-6">
            <h3 className="mb-4 text-2xl font-bold text-ink">
              Navegación por teclado
            </h3>
            <div className="space-y-3 text-lg text-ink-soft">
              <p>
                Si te resulta más cómodo usar el teclado en lugar del mouse:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Presioná <strong>Tab</strong> para moverte entre botones y
                  enlaces
                </li>
                <li>
                  Presioná <strong>Enter</strong> o <strong>Espacio</strong>{" "}
                  para hacer click
                </li>
                <li>
                  Presioná <strong>Shift + Tab</strong> para retroceder
                </li>
                <li>
                  Los elementos seleccionados se marcan con un borde azul
                  visible
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Preguntas Frecuentes */}
      <section className="mb-16 rounded-xl border border-rule bg-surface p-8">
        <h2 className="mb-8 text-3xl font-bold text-ink">
          4. Preguntas frecuentes
        </h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-rule bg-paper p-6">
            <h3 className="mb-3 text-xl font-bold text-ink">
              ¿Es gratis usar {portal.name}?
            </h3>
            <p className="text-lg text-ink-soft">
              Sí, es <strong>100% gratis</strong> para candidatos. No cobramos
              nada por postularte ni por encontrar trabajo. Las empresas tampoco
              pagan por publicar empleos.
            </p>
          </div>

          <div className="rounded-lg border border-rule bg-paper p-6">
            <h3 className="mb-3 text-xl font-bold text-ink">
              ¿Por qué no necesito subir un CV?
            </h3>
            <p className="text-lg text-ink-soft">
              Porque queremos que sea más simple. Las 3 preguntas que respondés
              son suficientes para que las empresas sepan quién sos y qué podés
              hacer. Sin PDFs, sin formatos complicados.
            </p>
          </div>

          <div className="rounded-lg border border-rule bg-paper p-6">
            <h3 className="mb-3 text-xl font-bold text-ink">
              ¿Cuánto tiempo tarda en responder una empresa?
            </h3>
            <p className="text-lg text-ink-soft">
              Depende de cada empresa. Algunas responden en 1-2 días, otras
              pueden tardar una semana. Si pasa más de una semana sin respuesta,
              podés postularte a otros empleos.
            </p>
          </div>

          <div className="rounded-lg border border-rule bg-paper p-6">
            <h3 className="mb-3 text-xl font-bold text-ink">
              ¿Puedo modificar mi perfil después de crearlo?
            </h3>
            <p className="text-lg text-ink-soft">
              Sí. En la sección "Mis postulaciones" vas a encontrar un botón
              para editar tus respuestas. Podés cambiarlas cuando quieras.
            </p>
          </div>

          <div className="rounded-lg border border-rule bg-paper p-6">
            {/* Antes esta pregunta era "¿si no recibo el código por SMS?", que
                describe algo que hoy no puede pasar —no hay ingreso por
                teléfono— y remataba mandando a Microsoft, que tampoco está.
                La reemplaza la duda real de quien no tiene cuenta de Google. */}
            <h3 className="mb-3 text-xl font-bold text-ink">
              ¿Y si no tengo cuenta de Google?
            </h3>
            <p className="text-lg text-ink-soft">
              Si usás Gmail en el celular, ya tenés una: es la misma dirección
              de correo. Si no, se crea gratis desde el mismo botón de ingreso,
              en un par de minutos. Estamos sumando el ingreso con un código al
              celular para quien prefiera no usar correo.
            </p>
          </div>

          <div className="rounded-lg border border-rule bg-paper p-6">
            <h3 className="mb-3 text-xl font-bold text-ink">
              ¿Mis datos están seguros?
            </h3>
            <p className="text-lg text-ink-soft">
              Sí. Usamos los mismos sistemas de seguridad que los bancos. Tu
              información solo la ven las empresas a las que te postulás. Nunca
              compartimos ni vendemos tus datos a terceros.
            </p>
          </div>

          {/* La pregunta cambia según el portal: "¿hay límite de edad?" es la
              duda de alguien jubilado, no la de alguien con discapacidad, que
              se pregunta si el aviso va a respetar lo que necesita. Antes se
              mostraba la de JubiJobs en los dos. */}
          <div className="rounded-lg border border-rule bg-paper p-6">
            {portal.id === "JUBI" ? (
              <>
                <h3 className="mb-3 text-xl font-bold text-ink">
                  ¿Hay un límite de edad para usar {portal.name}?
                </h3>
                <p className="text-lg text-ink-soft">
                  No. {portal.name} está pensado para personas jubiladas y
                  mayores de 60, pero cualquiera puede usarlo. Descartar a
                  alguien por su edad es discriminación, y las empresas lo
                  aceptan por escrito al publicar.
                </p>
              </>
            ) : (
              <>
                <h3 className="mb-3 text-xl font-bold text-ink">
                  ¿Tengo que contar cuál es mi discapacidad?
                </h3>
                <p className="text-lg text-ink-soft">
                  No. Cargar esa información es opcional y podés postularte sin
                  completarla. Si la cargás, la empresa ve únicamente las
                  condiciones que el puesto tiene que garantizar —una rampa, un
                  horario ajustable, trabajo remoto—, no una etiqueta sobre vos.
                  Podés borrarla cuando quieras.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Sección 5: Problemas Comunes */}
      <section className="mb-16 rounded-xl border-2 border-yellow-200 bg-yellow-50 p-8 transition-colors dark:border-yellow-800 dark:bg-yellow-950">
        <h2 className="mb-8 text-3xl font-bold text-ink dark:text-yellow-200">
          5. Solución de problemas comunes
        </h2>

        <div className="space-y-6">
          <div className="rounded-lg border-2 border-yellow-300 bg-surface p-6 transition-colors dark:border-yellow-700">
            <h3 className="mb-3 text-xl font-bold text-ink">
              🔧 No puedo ver el botón "Postularme"
            </h3>
            <p className="mb-3 text-lg text-ink-soft">
              <strong>Solución:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 text-lg text-ink-soft">
              <li>
                Asegurate de haber iniciado sesión (arriba a la derecha debería
                decir tu nombre)
              </li>
              <li>Verificá que completaste las 3 preguntas de tu perfil</li>
              <li>
                Si ya te postulaste a ese empleo, el botón va a decir "Ya
                postulado"
              </li>
            </ul>
          </div>

          <div className="rounded-lg border-2 border-yellow-300 bg-surface p-6 transition-colors dark:border-yellow-700">
            <h3 className="mb-3 text-xl font-bold text-ink">
              🔧 Las letras se ven muy chicas
            </h3>
            <p className="mb-3 text-lg text-ink-soft">
              <strong>Solución:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 text-lg text-ink-soft">
              <li>
                Usá el control de tamaño de texto (arriba a la derecha, dice
                "Texto:")
              </li>
              <li>Hacé click en el botón "+" para agrandar las letras</li>
              <li>
                También podés acercar la página con Ctrl + "+" (Windows) o Cmd +
                "+" (Mac)
              </li>
            </ul>
          </div>

          <div className="rounded-lg border-2 border-yellow-300 bg-surface p-6 transition-colors dark:border-yellow-700">
            <h3 className="mb-3 text-xl font-bold text-ink">
              🔧 No encuentro el menú en el celular
            </h3>
            <p className="mb-3 text-lg text-ink-soft">
              <strong>Solución:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 text-lg text-ink-soft">
              <li>
                Buscá el ícono de las tres líneas (☰) arriba a la derecha
              </li>
              <li>Tocá ese ícono para abrir el menú</li>
              <li>
                Ahí vas a ver todas las opciones: Empleos, Empresas, Mis
                postulaciones, etc.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border-2 border-yellow-300 bg-surface p-6 transition-colors dark:border-yellow-700">
            <h3 className="mb-3 text-xl font-bold text-ink">
              🔧 La página se ve rara o no carga bien
            </h3>
            <p className="mb-3 text-lg text-ink-soft">
              <strong>Solución:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 text-lg text-ink-soft">
              <li>
                Probá recargar la página (botón de actualizar del navegador o
                F5)
              </li>
              <li>Cerrá el navegador y volvé a abrirlo</li>
              <li>
                Limpiá el caché del navegador (buscá "borrar caché" en la ayuda
                de tu navegador)
              </li>
              <li>
                Probá usar un navegador actualizado (Chrome, Firefox, Edge)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección 6: Contacto */}
      <section className="mb-16 rounded-xl border-2 border-green-200 bg-green-50 p-8 text-center transition-colors dark:border-green-800 dark:bg-green-950">
        <h2 className="mb-6 text-3xl font-bold text-ink dark:text-green-200">
          ¿Seguís necesitando ayuda?
        </h2>
        <p className="mb-8 text-xl text-ink-soft">
          Si no encontraste la respuesta que buscabas, contactanos y te
          ayudamos.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:ayuda@jubijobs.com.ar"
            className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            📧 Enviar email
          </a>
          <Link
            href="/accesibilidad"
            className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-lg border-2 border-primary-600 bg-surface px-8 py-4 text-lg font-semibold text-primary-600 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:border-primary-400 dark:text-primary-400"
          >
            Ver compromiso de accesibilidad
          </Link>
        </div>
      </section>

      {/* CTA Final */}
      <section className="text-center">
        <h2 className="mb-6 text-3xl font-bold text-ink">
          ¿Listo para buscar empleo?
        </h2>
        <p className="mb-8 text-xl text-ink-soft">
          Ahora que sabés cómo funciona, ¡empezá a buscar!
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <BigCTAButton href="/empleos">Ver empleos disponibles</BigCTAButton>
          <BigCTAButton href="/como-funciona" variant="secondary">
            Ver resumen rápido
          </BigCTAButton>
        </div>
      </section>
    </div>
  );
}

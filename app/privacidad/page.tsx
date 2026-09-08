import type { Metadata } from "next";
import { getCurrentPortalConfig } from "@/lib/portal";

/**
 * Política de privacidad.
 *
 * La marca sale del portal del request. Antes decía "JubiJobs" fijo: alguien
 * en inclujobs.com leía una política que nombra a otro sitio, y un documento
 * legal que identifica mal a la entidad no vale como tal.
 *
 * La fecha de última actualización es una CONSTANTE, no `new Date()`. Con
 * `new Date()` mostraba siempre el día de hoy, así que era imposible saber qué
 * versión aceptó una persona — justo lo que la fecha tiene que probar.
 * Actualizarla a mano al cambiar el texto es parte del cambio.
 */
const ULTIMA_ACTUALIZACION = "8 de septiembre de 2026";

export async function generateMetadata(): Promise<Metadata> {
  const portal = await getCurrentPortalConfig();
  return {
    title: "Política de privacidad",
    description: `Cómo se tratan tus datos personales en ${portal.name}.`,
  };
}

export default async function PrivacidadPage() {
  const portal = await getCurrentPortalConfig();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <h1 className="text-3xl md:text-4xl">Política de privacidad</h1>
      <p className="mt-3 text-base text-ink-soft">
        Última actualización: {ULTIMA_ACTUALIZACION}
      </p>

      <section className="mt-12">
        <h2 className="text-2xl">Qué información recopilamos</h2>
        <p className="mt-4 text-lg text-ink-soft">
          En {portal.name} recopilamos:
        </p>
        <ul className="mt-4 space-y-3 text-lg text-ink-soft">
          <li>
            <strong className="text-ink">Datos de la cuenta:</strong> nombre y
            correo electrónico, que nos entrega Google cuando ingresás con tu
            cuenta. No accedemos a tu contraseña ni al contenido de tu correo.
          </li>
          <li>
            <strong className="text-ink">Perfil de candidato:</strong>{" "}
            ubicación, año de nacimiento, teléfono si lo cargás, y tus
            respuestas a las tres preguntas.
          </li>
          <li>
            <strong className="text-ink">Perfil de empresa:</strong> nombre,
            sitio web, ubicación y descripción de la empresa.
          </li>
          <li>
            <strong className="text-ink">Avisos y postulaciones:</strong> los
            empleos publicados y las postulaciones que enviás.
          </li>
        </ul>
      </section>

      {/* Los datos de salud son categoría sensible bajo la Ley 25.326 (art. 7)
          y necesitan su propio apartado: por qué se piden, quién los ve y cómo
          se dan de baja. Antes iban listados junto a "ubicación" y "teléfono",
          como si fueran equivalentes. */}
      <section className="mt-12 rounded-lg border border-rule bg-paper p-6">
        <h2 className="text-2xl">Datos sobre discapacidad</h2>
        <p className="mt-4 text-lg text-ink-soft">
          La información sobre tu discapacidad y las condiciones de
          accesibilidad que necesitás es un{" "}
          <strong className="text-ink">dato sensible</strong> según la Ley
          25.326 de Protección de Datos Personales. Por eso:
        </p>
        <ul className="mt-4 space-y-3 text-lg text-ink-soft">
          <li>
            Cargarla es <strong className="text-ink">siempre opcional</strong>.
            Podés usar la plataforma y postularte sin completarla.
          </li>
          <li>
            Solo la ve la empresa a cuyo aviso te postulás, y únicamente como
            las condiciones que el puesto debe garantizar. No mostramos ninguna
            etiqueta que te identifique como persona con discapacidad.
          </li>
          <li>
            No la usamos para ordenar, filtrar ni priorizar candidatos, ni la
            compartimos con terceros.
          </li>
          <li>
            Podés borrarla en cualquier momento sin perder tu cuenta,
            escribiéndonos a {portal.contactEmail}.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Para qué la usamos</h2>
        <ul className="mt-4 space-y-2 text-lg text-ink-soft">
          <li>Conectar candidatos con empresas.</li>
          <li>Mostrar avisos según ubicación y preferencias.</li>
          <li>
            Enviar correos sobre tus postulaciones. No mandamos publicidad.
          </li>
          <li>Mejorar la plataforma.</li>
          <li>Cumplir obligaciones legales.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Con quién la compartimos</h2>
        <p className="mt-4 text-lg text-ink-soft">
          <strong className="text-ink">No vendemos tus datos.</strong> Los
          compartimos solo en estos casos:
        </p>
        <ul className="mt-4 space-y-2 text-lg text-ink-soft">
          <li>
            <strong className="text-ink">Con la empresa</strong> a cuyo aviso te
            postulás: tu perfil y tus tres respuestas.
          </li>
          <li>
            <strong className="text-ink">Con vos</strong>, los datos de contacto
            de la empresa cuando pide comunicarse.
          </li>
          <li>
            <strong className="text-ink">Con la autoridad</strong> que lo
            requiera legalmente.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Cómo la protegemos</h2>
        {/* Solo Google: decía "Google y Microsoft" y Microsoft no está
            habilitado. En un documento que describe el tratamiento de datos,
            nombrar un proveedor que no interviene es información falsa. */}
        <ul className="mt-4 space-y-2 text-lg text-ink-soft">
          <li>Ingreso con Google, sin que manejemos contraseñas tuyas.</li>
          <li>Conexión cifrada (HTTPS) en todo el sitio.</li>
          <li>Base de datos con acceso restringido.</li>
        </ul>
      </section>

      {/* Antes decía "tenés derecho a eliminar tu cuenta y exportar tus datos"
          sin que existiera forma de hacerlo. La Ley 25.326 los hace exigibles:
          prometerlos sin un canal real es incumplimiento. Ahora se ejercen por
          correo, con un plazo declarado. */}
      <section className="mt-12">
        <h2 className="text-2xl">Tus derechos</h2>
        <p className="mt-4 text-lg text-ink-soft">
          La Ley 25.326 te da derecho a acceder a tus datos, corregirlos,
          actualizarlos y pedir que los demos de baja.
        </p>
        <p className="mt-4 text-lg text-ink-soft">
          Para ejercerlos, escribinos a{" "}
          <a
            href={`mailto:${portal.contactEmail}`}
            className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800 dark:text-primary-200"
          >
            {portal.contactEmail}
          </a>{" "}
          desde el correo con el que te registraste. Respondemos dentro de los
          diez días hábiles: te enviamos una copia de tus datos o los damos de
          baja, según lo que pidas.
        </p>
        <p className="mt-4 text-base text-ink-soft">
          La Agencia de Acceso a la Información Pública, órgano de control de la
          Ley 25.326, atiende las denuncias de quien vea afectados sus derechos.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Cookies</h2>
        <p className="mt-4 text-lg text-ink-soft">
          Usamos únicamente las cookies necesarias para mantener tu sesión
          abierta. No usamos cookies de publicidad ni de seguimiento de
          terceros.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Cambios en esta política</h2>
        <p className="mt-4 text-lg text-ink-soft">
          Si la modificamos, actualizamos la fecha del encabezado y te avisamos
          por correo cuando el cambio sea significativo.
        </p>
      </section>

      <section className="mt-12 rounded-lg border border-rule bg-paper p-6">
        <h2 className="text-2xl">Contacto</h2>
        <p className="mt-3 text-lg text-ink-soft">
          Por cualquier consulta sobre esta política, escribinos a{" "}
          <a
            href={`mailto:${portal.contactEmail}`}
            className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800 dark:text-primary-200"
          >
            {portal.contactEmail}
          </a>
          .
        </p>
      </section>
    </div>
  );
}

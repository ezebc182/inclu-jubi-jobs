import type { Metadata } from "next";
import { getCurrentPortalConfig } from "@/lib/portal";

/**
 * Términos y condiciones.
 *
 * Igual que la política de privacidad: la marca sale del portal del request.
 * Antes decía "JubiJobs" fijo, así que en inclujobs.com alguien aceptaba los
 * términos de otro sitio — un contrato que identifica mal a la entidad no
 * cumple su función.
 *
 * La fecha es una constante y se actualiza a mano al cambiar el texto. Con
 * `new Date()` mostraba siempre hoy y no probaba qué versión se aceptó.
 */
const ULTIMA_ACTUALIZACION = "8 de septiembre de 2026";

export async function generateMetadata(): Promise<Metadata> {
  const portal = await getCurrentPortalConfig();
  return {
    title: "Términos y condiciones",
    description: `Condiciones de uso de ${portal.name}.`,
  };
}

export default async function TerminosPage() {
  const portal = await getCurrentPortalConfig();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <h1 className="text-3xl md:text-4xl">Términos y condiciones</h1>
      <p className="mt-3 text-base text-ink-soft">
        Última actualización: {ULTIMA_ACTUALIZACION}
      </p>

      <section className="mt-12">
        <h2 className="text-2xl">Aceptación</h2>
        <p className="mt-4 text-lg text-ink-soft">
          Al usar {portal.name} aceptás estas condiciones. Si no estás de
          acuerdo, no uses la plataforma.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Qué es {portal.name}</h2>
        <p className="mt-4 text-lg text-ink-soft">
          {portal.description}
        </p>
        <p className="mt-4 text-lg text-ink-soft">
          <strong className="text-ink">El servicio es gratuito</strong> para
          candidatos y para empresas. No cobramos comisiones.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Tu cuenta</h2>
        <ul className="mt-4 space-y-3 text-lg text-ink-soft">
          <li>Tenés que ser mayor de 18 años.</li>
          <li>La información que cargues debe ser veraz.</li>
          <li>
            Sos responsable de la seguridad de la cuenta con la que ingresás.
          </li>
          <li>No podés crear varias cuentas ni usar la de otra persona.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Si buscás trabajo</h2>
        <ul className="mt-4 space-y-3 text-lg text-ink-soft">
          <li>
            Contá tu experiencia con honestidad. Sos responsable de lo que
            escribís en tus postulaciones.
          </li>
          <li>
            {portal.name} no garantiza que una empresa te contacte ni que
            consigas trabajo.
          </li>
          <li>
            Podés retirar una postulación escribiéndonos, o avisándole
            directamente a la empresa.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Si publicás empleos</h2>
        <ul className="mt-4 space-y-3 text-lg text-ink-soft">
          <li>
            Tenés que estar autorizado a publicar en nombre de la empresa.
          </li>
          <li>
            Los avisos deben ser reales y cumplir la legislación laboral
            argentina.
          </li>
          <li>
            No podés discriminar por edad, género, origen, religión, orientación
            sexual ni discapacidad. La Ley 23.592 sanciona los actos
            discriminatorios, y el descarte de una persona por su edad o su
            discapacidad es uno de ellos.
          </li>
          <li>
            Las condiciones de accesibilidad que declarás en un aviso son un
            compromiso con quien se postula, no una preferencia.
          </li>
          <li>
            Sos responsable del proceso de selección y de la contratación.
          </li>
          <li>
            {portal.name} no es parte de la relación laboral entre la empresa y
            la persona contratada.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Qué no se puede publicar</h2>
        <ul className="mt-4 space-y-2 text-lg text-ink-soft">
          <li>Empleos falsos o fraudulentos.</li>
          <li>Contenido ofensivo, discriminatorio o ilegal.</li>
          <li>Publicidad ajena a una búsqueda laboral.</li>
          <li>Esquemas piramidales o de marketing multinivel.</li>
          <li>
            Ofertas que pidan un pago a la persona candidata por postularse,
            capacitarse o acceder al puesto.
          </li>
          <li>Empleos que violen la legislación laboral argentina.</li>
        </ul>
      </section>

      {/* Sin la mención a "licencia MIT en GitHub": el repositorio es privado y
          no tiene archivo de licencia, así que la frase declaraba públicamente
          una licencia que nunca se otorgó. */}
      <section className="mt-12">
        <h2 className="text-2xl">Propiedad intelectual</h2>
        <p className="mt-4 text-lg text-ink-soft">
          El contenido, el diseño y el código de {portal.name} están protegidos
          por derechos de autor. Lo que publicás sigue siendo tuyo: al cargarlo
          nos autorizás a mostrarlo dentro de la plataforma con el fin de
          conectar candidatos y empresas.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Límites de responsabilidad</h2>
        <p className="mt-4 text-lg text-ink-soft">
          {portal.name} se ofrece tal como está:
        </p>
        <ul className="mt-4 space-y-2 text-lg text-ink-soft">
          <li>No garantizamos que encuentres trabajo ni candidatos.</li>
          <li>
            No somos responsables de lo que ocurra entre empresas y candidatos
            fuera de la plataforma.
          </li>
          <li>
            Moderamos los avisos antes de publicarlos, pero no verificamos la
            identidad de todas las personas usuarias.
          </li>
          <li>No somos parte de ninguna relación laboral.</li>
        </ul>
        <p className="mt-4 text-lg text-ink-soft">
          Si te encontrás con un aviso sospechoso o con alguien que te pide
          dinero, escribinos a{" "}
          <a
            href={`mailto:${portal.contactEmail}`}
            className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800 dark:text-primary-200"
          >
            {portal.contactEmail}
          </a>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Suspensión de cuentas</h2>
        <p className="mt-4 text-lg text-ink-soft">
          Podemos suspender o dar de baja las cuentas que incumplan estas
          condiciones o hagan un uso indebido de la plataforma. Salvo casos de
          fraude o riesgo para otras personas, avisamos antes por correo.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Cambios</h2>
        <p className="mt-4 text-lg text-ink-soft">
          Podemos modificar estas condiciones. Los cambios significativos se
          avisan por correo y quedan reflejados en la fecha del encabezado.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl">Ley aplicable</h2>
        <p className="mt-4 text-lg text-ink-soft">
          Estas condiciones se rigen por las leyes de la República Argentina.
          Cualquier controversia se resuelve ante los tribunales ordinarios
          competentes.
        </p>
      </section>

      <section className="mt-12 rounded-lg border border-rule bg-paper p-6">
        <h2 className="text-2xl">Contacto</h2>
        <p className="mt-3 text-lg text-ink-soft">
          Por consultas sobre estas condiciones, escribinos a{" "}
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

import type { Metadata } from "next";
import { LoginOptions } from "@/components/auth/LoginOptions";
import { availableLoginMethods } from "@/lib/auth-providers";
import { getCurrentPortal, getCurrentPortalConfig } from "@/lib/portal";

/**
 * La metadata sale del portal del request, no de una constante.
 *
 * Antes decía "Ingresar - JubiJobs" fijo: en inclujobs.com la pestaña del
 * navegador mostraba la marca equivocada, y el `<h1>` también.
 */
export async function generateMetadata(): Promise<Metadata> {
  const portal = await getCurrentPortalConfig();

  return {
    title: "Ingresar",
    description: `Ingresá a tu cuenta de ${portal.name} sin contraseñas.`,
    // Una pantalla de login no aporta nada en un buscador y sí puede confundir.
    robots: { index: false, follow: true },
  };
}

export default async function LoginPage() {
  const portalId = await getCurrentPortal();
  const portal = await getCurrentPortalConfig();
  const { social, phone } = availableLoginMethods(portalId);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col justify-center px-6 py-16 lg:py-24">
      <div className="surface-raised rounded-xl p-8 sm:p-10">
        {/* El texto describe los métodos que REALMENTE están disponibles.
            Antes decía "o un código que te llega por WhatsApp" siempre, aunque
            el ingreso por teléfono estuviera apagado — y lo está mientras no se
            integre el envío (ver `lib/auth-providers.ts`). Alguien leía la
            promesa y después buscaba dónde poner su número, sin encontrarlo.
            Prometer un método que no existe es peor que no mencionarlo. */}
        <h1 className="text-3xl md:text-4xl">Ingresá a {portal.name}</h1>
        <p className="mt-3 text-lg text-ink-soft">
          {phone
            ? "Sin contraseñas: usás una cuenta que ya tenés, o un código que te llega por WhatsApp."
            : "Sin contraseñas: entrás con una cuenta que ya usás todos los días."}
        </p>

        <div className="mt-8">
          <LoginOptions providers={social} phoneEnabled={phone} />
        </div>

        <p className="mt-8 border-t border-rule pt-6 text-base leading-relaxed text-ink-soft">
          Al ingresar aceptás los{" "}
          <a
            href="/terminos"
            className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800 dark:text-primary-200"
          >
            Términos y condiciones
          </a>{" "}
          y la{" "}
          <a
            href="/privacidad"
            className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800 dark:text-primary-200"
          >
            Política de privacidad
          </a>
          .
        </p>
      </div>

      {/* Explicar la ausencia de contraseña, no solo omitirla: para parte de
          esta audiencia "no hay contraseña" suena a que el sitio es menos
          seguro, cuando es exactamente lo contrario. */}
      <aside className="mt-8 rounded-lg border border-rule bg-paper p-6">
        <h2 className="font-display text-lg font-semibold">
          ¿Por qué no pedimos una contraseña?
        </h2>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">
          Porque es una contraseña más que recordar, y las que se olvidan se
          terminan anotando en un papel. Entrás con una cuenta que ya usás todos
          los días
          {phone
            ? ", o con un código que te mandamos por WhatsApp en el momento."
            : ": la misma que usás para el correo."}
        </p>
        <a
          href="/como-funciona"
          className="mt-4 inline-block font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800 dark:text-primary-200"
        >
          Cómo funciona {portal.name}
        </a>
      </aside>
    </div>
  );
}

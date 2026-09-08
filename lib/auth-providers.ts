import "server-only";

import type { PortalId } from "./portal";

/**
 * Qué métodos de ingreso están REALMENTE disponibles.
 *
 * El motivo es concreto: hasta ahora la pantalla de ingreso pintaba Google,
 * Facebook y Microsoft siempre. Si un proveedor no tenía credenciales, el
 * usuario clickeaba y recibía un error de Google en la cara — sin saber que el
 * problema no era él.
 *
 * Para nuestras dos audiencias eso es especialmente caro: una persona de 70
 * años que ve un error de Google no vuelve a intentar. Cierra el sitio.
 *
 * Un botón que no funciona es peor que un botón que no está.
 */

export type SocialProviderId = "google" | "facebook" | "microsoft" | "github";

/**
 * Igual que `providerCredentials()` en `lib/auth.ts`: primero la variable con
 * sufijo de portal, después la genérica. Un proveedor está habilitado solo si
 * tiene client id Y secret.
 */
function isConfigured(provider: SocialProviderId, portal: PortalId): boolean {
  const upper = provider.toUpperCase();
  const suffix = portal === "JUBI" ? "JUBI" : "INCLU";

  const clientId =
    process.env[`BETTER_AUTH_${upper}_ID_${suffix}`] ||
    process.env[`BETTER_AUTH_${upper}_ID`];
  const clientSecret =
    process.env[`BETTER_AUTH_${upper}_SECRET_${suffix}`] ||
    process.env[`BETTER_AUTH_${upper}_SECRET`];

  return Boolean(clientId && clientSecret);
}

/**
 * Ingreso con código al celular.
 *
 * El canal va a ser WhatsApp vía Kapso, no SMS: esta audiencia ya tiene
 * WhatsApp abierto todo el día, y un SMS con un código puede confundirse con
 * los mensajes de estafa que reciben a diario.
 *
 * En producción exige `KAPSO_API_KEY` y el phone number id. Sin eso, `sendOTP`
 * genera el código y no lo manda a ningún lado — la persona espera un mensaje
 * que nunca llega, que es peor que no ofrecer el método.
 *
 * En desarrollo se habilita siempre: el código sale por consola.
 *
 * PENDIENTE: la integración en sí (`sendOTP` en lib/auth.ts) todavía no está.
 * Meta exige una plantilla de autenticación aprobada para mensajes iniciados
 * por el negocio — hay que confirmar si Kapso la administra o si hay que
 * crearla en Meta antes de que esto funcione.
 */
function isPhoneEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return Boolean(
    process.env.KAPSO_API_KEY && process.env.KAPSO_PHONE_NUMBER_ID
  );
}

/**
 * Proveedores que se ofrecen hoy: solo Google.
 *
 * Decisión de producto, no técnica. Microsoft, Facebook y GitHub siguen
 * soportados en `lib/auth.ts` — basta agregarlos acá cuando se decida
 * habilitarlos, sin tocar nada más.
 *
 * El motivo de dejar uno solo: cada botón extra es una decisión que la persona
 * tiene que tomar antes de entrar, y esta audiencia usa Google. Cuatro opciones
 * no son cuatro veces más acceso, son cuatro veces más duda.
 *
 * El segundo método de ingreso va a ser el código por WhatsApp (Kapso), no otro
 * botón social.
 */
const PROVIDER_ORDER: SocialProviderId[] = ["google"];

export interface AvailableLoginMethods {
  social: SocialProviderId[];
  phone: boolean;
  /** `true` cuando no hay NINGÚN método: la pantalla debe avisar, no fingir. */
  none: boolean;
}

export function availableLoginMethods(portal: PortalId): AvailableLoginMethods {
  const social = PROVIDER_ORDER.filter((id) => isConfigured(id, portal));
  const phone = isPhoneEnabled();

  return { social, phone, none: social.length === 0 && !phone };
}

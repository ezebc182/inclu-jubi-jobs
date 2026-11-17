/**
 * Registro solo desde Argentina.
 *
 * Los avisos, las provincias y la moderación son argentinos: una cuenta creada
 * desde otro país casi siempre es spam o alguien que no va a poder tomar el
 * trabajo. El país sale de `x-vercel-ip-country`, que Vercel calcula a partir
 * de la IP. Guardamos solo el código de país, nunca la IP.
 *
 * Sin imports a propósito: es lógica pura que usan el servidor, el cliente y
 * los tests de `tests/unit` (Node la carga directo, sin compilar).
 */

export const COUNTRY_HEADER = "x-vercel-ip-country";

/** Código que viaja en `?error=` del OAuth y en el error del login por teléfono. */
export const COUNTRY_NOT_ALLOWED = "country_not_allowed";

export type CountryDecision = { allowed: boolean; country: string | null };

export function decideCountry(
  header: string | null | undefined
): CountryDecision {
  const value = header?.trim().toUpperCase();
  // shortcut: sin header (dev local, `next start` fuera de Vercel) se permite y
  // se guarda null. Si algún día se sale de Vercel, el proxy nuevo tiene que
  // mandar el país o esta puerta queda abierta.
  if (!value) return { allowed: true, country: null };
  const country = /^[A-Z]{2}$/.test(value) ? value : null;
  return { allowed: country === "AR", country };
}

/** Mensaje para quien se conecta desde afuera. JUBI trata de usted, INCLU de vos. */
export function countryNotAllowedMessage(portal: "JUBI" | "INCLU"): {
  titulo: string;
  detalle: string;
} {
  return portal === "JUBI"
    ? {
        titulo: "Por ahora funcionamos solo en Argentina",
        detalle:
          "Vemos que se está conectando desde otro país, así que todavía no podemos crear su cuenta. Si está en Argentina y usa una VPN o un servicio que cambia su ubicación, desactívelo y vuelva a intentar. Si cree que es un error, escríbanos.",
      }
    : {
        titulo: "Por ahora funcionamos solo en Argentina",
        detalle:
          "Vemos que te estás conectando desde otro país, así que todavía no podemos crear tu cuenta. Si estás en Argentina y usás una VPN o un servicio que cambia tu ubicación, desactivalo y volvé a intentar. Si creés que es un error, escribinos.",
      };
}

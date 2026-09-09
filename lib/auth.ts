import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import { headers } from "next/headers";
import { prisma } from "./db";
import {
  allPortals,
  getPortalConfig,
  resolvePortalFromHost,
  type PortalId,
} from "./portal";

/**
 * Autenticación multi-dominio.
 *
 * EL PROBLEMA
 * ───────────
 * JubiJobs e IncluJobs se sirven desde el MISMO deployment de Vercel, pero
 * OAuth no tolera ambigüedad de origen:
 *
 *   1. El `redirect_uri` que se le manda a Google tiene que ser el del dominio
 *      por el que entró el usuario. Si entra por inclujobs.com y le mandamos
 *      jubijobs.com, Google responde `redirect_uri_mismatch` — o peor, lo
 *      devuelve al portal equivocado con una sesión que no le sirve.
 *
 *   2. Cada portal usa su PROPIO OAuth Client en Google Cloud Console, con su
 *      client id y su secret. Mandar el par del otro portal da `invalid_client`.
 *
 * `betterAuth()` resuelve su config UNA sola vez, al evaluarse el módulo. Una
 * variable de entorno en Vercel también tiene un valor único por deployment.
 * Entonces NINGÚN valor de `.env` puede cubrir los dos dominios a la vez: es
 * una limitación física, no un olvido de configuración.
 *
 * LA SOLUCIÓN
 * ───────────
 * Una instancia de `betterAuth` POR PORTAL, construidas al arrancar y elegidas
 * por request según el `Host`. Cada una lleva su `baseURL` y sus credenciales.
 *
 * `trustedOrigins` sigue listando ambos dominios: valida quién puede LLAMAR a
 * la API, que es un problema distinto del `redirect_uri`. Confundir las dos
 * cosas es el error clásico acá — declarar `trustedOrigins` no cambia la URL
 * que se le manda a Google.
 */

/**
 * Credenciales de un proveedor social para un portal.
 *
 * Busca primero la variable con sufijo de portal y cae a la variable sin
 * sufijo. Ese fallback es deliberado: mientras haya un solo OAuth Client
 * configurado, ambos portales lo comparten y nada se rompe. Cuando se cargan
 * las variables por portal, cada uno toma las suyas sin cambiar código.
 *
 *   BETTER_AUTH_GOOGLE_ID_JUBI   → solo JubiJobs
 *   BETTER_AUTH_GOOGLE_ID_INCLU  → solo IncluJobs
 *   BETTER_AUTH_GOOGLE_ID        → los dos (fallback)
 */
function providerCredentials(provider: string, portal: PortalId) {
  const upper = provider.toUpperCase();
  const suffix = portal === "JUBI" ? "JUBI" : "INCLU";

  const clientId =
    process.env[`BETTER_AUTH_${upper}_ID_${suffix}`] ||
    process.env[`BETTER_AUTH_${upper}_ID`] ||
    "";
  const clientSecret =
    process.env[`BETTER_AUTH_${upper}_SECRET_${suffix}`] ||
    process.env[`BETTER_AUTH_${upper}_SECRET`] ||
    "";

  return {
    clientId,
    clientSecret,
    // Sin credenciales el proveedor queda apagado. Es preferible que el botón
    // no aparezca a que aparezca y tire un error de Google en la cara.
    enabled: Boolean(clientId && clientSecret),
  };
}

/**
 * URL base del portal, la que define el `redirect_uri` de OAuth.
 *
 * Usa `canonicalHost` y NO `domain`. La diferencia importa:
 *
 *   JubiJobs   canoniza a www   (jubijobs.com → 308 → www.jubijobs.com)
 *   IncluJobs  canoniza sin www (www.inclujobs.com → 307 → inclujobs.com)
 *
 * Antes esta función devolvía `https://${config.domain}`, o sea siempre sin
 * `www`. En JubiJobs eso mandaba a Google un `redirect_uri` que redirige: la
 * cookie `__Secure-better-auth.state` se guardaba en `jubijobs.com`, Google
 * devolvía ahí, el 308 llevaba a `www.jubijobs.com` y el navegador ya no
 * mandaba esa cookie —es de otro host—. Better-Auth no encontraba el `state`,
 * descartaba el callback y la persona volvía a la pantalla de ingreso sin
 * ningún error visible.
 *
 * El override solo se respeta cuando no apunta a un dominio productivo, para
 * poder trabajar en local y en previews de Vercel.
 */
function resolveBaseUrl(portal: PortalId): string {
  const config = getPortalConfig(portal);
  const override = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");

  if (override) {
    const pointsAtProduction = allPortals().some((p) =>
      override.includes(p.domain)
    );
    if (!pointsAtProduction) return override;
  }

  return `https://${config.canonicalHost}`;
}

/** Orígenes autorizados a llamar a la API de auth. Ambos dominios, siempre. */
const TRUSTED_ORIGINS = [
  "https://jubijobs.com",
  "https://www.jubijobs.com",
  "https://inclujobs.com",
  "https://www.inclujobs.com",
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000"] : []),
];

function createAuthForPortal(portal: PortalId) {
  const config = getPortalConfig(portal);

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: false, // Solo OAuth y teléfono: menos fricción, menos soporte.
    },

    /**
     * Vinculación de cuentas.
     *
     * Sin esta configuración, Better-Auth toma el camino más restrictivo: si ya
     * existe un usuario con ese correo y no tiene cuenta OAuth asociada, se
     * niega a vincular y devuelve `unable_to_link_account`. La persona vuelve a
     * la portada con un error en la URL y sin sesión.
     *
     * La negativa por defecto protege de un ataque real: si cualquiera pudiera
     * vincular su Google a un correo ya registrado, se apropiaría de esa cuenta.
     *
     * Acá la habilitamos SOLO para Google, y eso es seguro por un motivo
     * concreto: Google verifica que la persona sea dueña del correo antes de
     * entregárnoslo. Quien llega con `alguien@gmail.com` es dueño de esa
     * casilla — no hay suplantación posible.
     *
     * Se limita a `trustedProviders`. Un proveedor que no verifique el correo
     * NO debe entrar en esta lista.
     */
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google"],
      },
    },
    socialProviders: {
      google: providerCredentials("google", portal),
      github: providerCredentials("github", portal),
      microsoft: providerCredentials("microsoft", portal),
      facebook: providerCredentials("facebook", portal),
    },
    plugins: [
      phoneNumber({
        otpLength: 6,
        expiresIn: 300, // 5 minutos
        sendOTP: async ({ phoneNumber: phone, code }) => {
          if (process.env.NODE_ENV !== "production") {
            console.log(
              `[auth:${portal}] OTP para ${phone}: ${code} (solo desarrollo)`
            );
            return;
          }
          // TODO: integrar proveedor de SMS antes de habilitar el login por
          // teléfono en producción. Hoy el código se genera y nunca se envía.
        },
        signUpOnVerification: {
          // El dominio del email temporal identifica el portal de origen del
          // registro, que es dato útil cuando hay que auditar una cuenta.
          getTempEmail: (phone) => `${phone}@${config.domain}`,
          getTempName: (phone) => phone,
        },
      }),
    ],
    secret: process.env.AUTH_SECRET || "development-secret-min-32-chars-long",
    baseURL: resolveBaseUrl(portal),
    trustedOrigins: TRUSTED_ORIGINS,
  });
}

/**
 * Una instancia por portal, creadas al cargar el módulo.
 *
 * Construirlas acá y no por request es intencional: `betterAuth()` arma el
 * adapter de Prisma y registra los plugins, trabajo que no hace falta repetir
 * en cada pedido.
 */
const AUTH_BY_PORTAL: Record<PortalId, ReturnType<typeof betterAuth>> = {
  JUBI: createAuthForPortal("JUBI"),
  INCLU: createAuthForPortal("INCLU"),
};

/** Instancia de auth de un portal concreto. */
export function getAuthForPortal(portal: PortalId) {
  return AUTH_BY_PORTAL[portal];
}

/**
 * Instancia de auth del request actual, resuelta por `Host`.
 *
 * Es la que debe usar todo código de servidor. La sesión se comparte entre
 * portales (misma base, misma cookie de dominio propio); lo que cambia son las
 * credenciales de OAuth y el `redirect_uri`.
 */
export async function getAuth() {
  const h = await headers();
  return getAuthForPortal(resolvePortalFromHost(h.get("host")));
}

/**
 * Sesión del request actual.
 *
 * Atajo para el patrón que repetían veinte archivos:
 *   `auth.api.getSession({ headers: await headers() })`
 */
export async function getSession() {
  const h = await headers();
  const instance = getAuthForPortal(resolvePortalFromHost(h.get("host")));
  return instance.api.getSession({ headers: h });
}

/**
 * Instancia por defecto (JubiJobs).
 *
 * Se mantiene exportada para no romper los archivos que ya la importan. Sirve
 * para leer sesión, que no depende del portal.
 *
 * NO la use para OAuth: lleva las credenciales y el `redirect_uri` de
 * JubiJobs. Para eso está `getAuth()`, que resuelve por `Host`.
 */
export const auth = AUTH_BY_PORTAL.JUBI;

export type Session = Awaited<ReturnType<typeof getSession>>;

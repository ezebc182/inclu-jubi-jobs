import "server-only";

import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./db";
import { getCurrentPortal, type PortalId } from "./portal";

/**
 * Sesión del request, validada contra el portal del dominio.
 *
 * EL PROBLEMA
 * ───────────
 * Los dos portales comparten deployment y base, así que una sesión iniciada en
 * jubijobs.com es técnicamente válida en inclujobs.com: son cookies de hosts
 * distintos, pero el usuario existe en la misma tabla. Sin una comprobación
 * explícita, quien se registró en un portal quedaba operando en el otro —y el
 * onboarding lo mandaba al flujo equivocado.
 *
 * Eso contradice la premisa del producto, que `lib/portal.ts` declara así:
 * "un candidato solo ve avisos de su portal". Una persona jubilada y una
 * persona con discapacidad son audiencias separadas, no intercambiables.
 *
 * LA REGLA
 * ────────
 * El portal de la persona se sella al registrarse y no cambia. Si entra por el
 * otro dominio, la sesión no aplica: hay que ofrecerle registrarse ahí, no
 * arrastrarla a un flujo que no es el suyo.
 *
 * Los administradores son la excepción: moderan avisos de los dos portales.
 */
export interface PortalSession {
  userId: string;
  email: string;
  name: string | null;
  image: string | null;
  role: "CANDIDATE" | "COMPANY" | "ADMIN" | null;
  /** Portal en el que se registró la persona. */
  userPortal: PortalId;
  /** Portal del dominio por el que está entrando ahora. */
  currentPortal: PortalId;
  /** `true` cuando los dos coinciden, o cuando es admin. */
  belongsHere: boolean;
}

/**
 * Devuelve la sesión con el portal resuelto, o `null` si no hay sesión.
 *
 * No redirige ni lanza: quien la usa decide qué hacer. Una página pública
 * puede querer mostrar el header con el nombre aunque la persona sea del otro
 * portal, mientras que el onboarding necesita frenarla.
 */
export async function getPortalSession(): Promise<PortalSession | null> {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) return null;

  const [currentPortal, user] = await Promise.all([
    getCurrentPortal(),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, portal: true },
    }),
  ]);

  // La sesión existe pero el usuario no: cuenta borrada con la cookie viva.
  if (!user) return null;

  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
    role: user.role ?? null,
    userPortal: user.portal,
    currentPortal,
    /**
     * Cualquier persona puede usar los dos portales con la misma cuenta.
     *
     * Ser jubilado y tener una discapacidad NO son categorías excluyentes: la
     * discapacidad aumenta con la edad, así que alguien de 68 años con artrosis
     * severa o pérdida auditiva pertenece a las dos audiencias. Obligarlo a
     * tener dos correos para ver los avisos de los dos lados sería una barrera
     * inventada, y justo para quien más ayuda necesita.
     *
     * Y el aislamiento de contenido no depende de esto: `/empleos` filtra con
     * `getCurrentPortal()`, o sea el portal del DOMINIO. En jubijobs.com se ven
     * los avisos de JUBI y en inclujobs.com los de INCLU, sin importar dónde se
     * registró la persona. `user.portal` no protege nada — solo deja constancia
     * de por dónde entró la primera vez.
     */
    belongsHere: true,
  };
}

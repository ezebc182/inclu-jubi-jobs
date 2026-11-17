import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Baja de la lista de espera sin iniciar sesión.
 *
 * Un lead no tiene cuenta: el link firmado ES la autorización. La firma es un
 * HMAC del id con `AUTH_SECRET` (el mismo secreto de Better-Auth, ver
 * DEPLOY.md). El prefijo separa este uso de cualquier otro HMAC con ese
 * secreto: una firma de baja no sirve para nada más.
 *
 * No vence a propósito: la gente abre mails viejos para darse de baja, y un
 * link vencido ahí es justo lo que hace marcar el correo como spam.
 */

const PURPOSE = "lead-unsubscribe:v1:";

export function signLeadId(leadId: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(PURPOSE + leadId)
    .digest("base64url");
}

export function verifyLeadToken(
  leadId: string,
  token: string,
  secret: string
): boolean {
  const expected = Buffer.from(signLeadId(leadId, secret));
  const given = Buffer.from(token);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** El secreto real. En producción sin secreto no se firma nada. */
export function unsubscribeSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET no está configurado");
  }
  return "development-secret-min-32-chars-long";
}

import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { unsubscribeSecret, verifyLeadToken } from "@/lib/unsubscribe";

/**
 * Baja en un clic (RFC 8058). Gmail, Outlook y compañía mandan acá un POST
 * con `List-Unsubscribe=One-Click` cuando la persona toca "Anular
 * suscripción" en su cliente de correo. El link visible del mail va a /baja,
 * que pide confirmar: un GET nunca borra, porque los antivirus de correo
 * abren todos los links.
 */
export async function POST(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const token = request.nextUrl.searchParams.get("t") ?? "";

  if (!id || !verifyLeadToken(id, token, unsubscribeSecret())) {
    return new Response("Link inválido", { status: 400 });
  }

  // deleteMany y no delete: si ya se había dado de baja, no es un error.
  await prisma.lead.deleteMany({ where: { id } });
  return new Response("Listo", { status: 200 });
}

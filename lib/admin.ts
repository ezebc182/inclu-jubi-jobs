import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { PortalId } from "@/lib/portal";

/**
 * Autorización del panel de administración.
 *
 * El rol se lee SIEMPRE de la base, nunca de la sesión: si a alguien le
 * revocan el rol admin, la sesión cacheada no debe seguir dándole acceso.
 */
export interface AdminActor {
  id: string;
  name: string | null;
  email: string;
}

/** Devuelve el admin actual, o `null` si quien pide no lo es. */
export async function getAdminActor(): Promise<AdminActor | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  if (!user || user.role !== "ADMIN" || !user.isActive) return null;

  return { id: user.id, name: user.name, email: user.email };
}

/**
 * Exige rol admin. Usar al principio de cada página bajo /admin.
 * Redirige en vez de lanzar, para que el usuario vea algo útil.
 */
export async function requireAdmin(): Promise<AdminActor> {
  const actor = await getAdminActor();
  if (!actor) redirect("/");
  return actor;
}

/**
 * Igual que `requireAdmin` pero para server actions: acá sí conviene lanzar,
 * porque un redirect dentro de una mutación esconde el problema.
 */
export async function requireAdminActor(): Promise<AdminActor> {
  const actor = await getAdminActor();
  if (!actor) throw new Error("No autorizado");
  return actor;
}

/** Registra una acción administrativa. Toda mutación del panel pasa por acá. */
export async function recordAudit(input: {
  actorId: string;
  action: string;
  targetType: "Job" | "Company" | "User";
  targetId: string;
  portal?: PortalId | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      portal: input.portal ?? null,
      metadata: input.metadata as never,
    },
  });
}

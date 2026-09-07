"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { recordAudit, requireAdminActor } from "@/lib/admin";

type Result = { success: boolean; error?: string };

function fail(error: string): Result {
  return { success: false, error };
}

/** Aprueba un aviso y lo publica. */
export async function approveJob(
  jobId: string,
  note?: string
): Promise<Result> {
  try {
    const actor = await requireAdminActor();

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, portals: true, moderationStatus: true },
    });
    if (!job) return fail("Aviso no encontrado");

    await prisma.job.update({
      where: { id: jobId },
      data: {
        moderationStatus: "APPROVED",
        status: "PUBLISHED",
        moderatedAt: new Date(),
        moderatedById: actor.id,
        moderationNote: note?.trim() || null,
      },
    });

    await recordAudit({
      actorId: actor.id,
      action: "job.approve",
      targetType: "Job",
      targetId: jobId,
      portal: job.portals[0] ?? null,
      metadata: { previousStatus: job.moderationStatus, note: note ?? null },
    });

    revalidatePath("/admin/moderacion");
    revalidatePath("/empleos");
    revalidatePath(`/empleos/${jobId}`);
    return { success: true };
  } catch (error) {
    console.error("approveJob:", error);
    return fail("No se pudo aprobar el aviso");
  }
}

/** Rechaza un aviso. El motivo es obligatorio: la empresa merece saber por qué. */
export async function rejectJob(
  jobId: string,
  reason: string
): Promise<Result> {
  try {
    const actor = await requireAdminActor();

    const trimmed = reason.trim();
    if (trimmed.length < 10) {
      return fail("Escribí un motivo de al menos 10 caracteres");
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, portals: true, moderationStatus: true },
    });
    if (!job) return fail("Aviso no encontrado");

    await prisma.job.update({
      where: { id: jobId },
      data: {
        moderationStatus: "REJECTED",
        status: "DRAFT",
        moderatedAt: new Date(),
        moderatedById: actor.id,
        moderationNote: trimmed,
      },
    });

    await recordAudit({
      actorId: actor.id,
      action: "job.reject",
      targetType: "Job",
      targetId: jobId,
      portal: job.portals[0] ?? null,
      metadata: { reason: trimmed, previousStatus: job.moderationStatus },
    });

    revalidatePath("/admin/moderacion");
    revalidatePath("/empleos");
    return { success: true };
  } catch (error) {
    console.error("rejectJob:", error);
    return fail("No se pudo rechazar el aviso");
  }
}

/**
 * Verifica una empresa. Opcionalmente le habilita auto-aprobación, para que
 * sus avisos no vuelvan a hacer cola.
 */
export async function setCompanyVerification(
  companyId: string,
  input: { isVerified: boolean; autoApproveJobs: boolean }
): Promise<Result> {
  try {
    const actor = await requireAdminActor();

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, isVerified: true, autoApproveJobs: true },
    });
    if (!company) return fail("Empresa no encontrada");

    await prisma.company.update({
      where: { id: companyId },
      data: {
        isVerified: input.isVerified,
        // Auto-aprobar sin verificar sería abrir la puerta sin mirar.
        autoApproveJobs: input.isVerified ? input.autoApproveJobs : false,
      },
    });

    await recordAudit({
      actorId: actor.id,
      action: "company.verify",
      targetType: "Company",
      targetId: companyId,
      metadata: { from: company, to: input },
    });

    revalidatePath("/admin/empresas");
    return { success: true };
  } catch (error) {
    console.error("setCompanyVerification:", error);
    return fail("No se pudo actualizar la empresa");
  }
}

/**
 * Suspende o reactiva una empresa. Al suspender, sus avisos se pausan:
 * dejar avisos vivos de una empresa suspendida sería engañar al candidato.
 */
export async function setCompanySuspension(
  companyId: string,
  input: { suspend: boolean; reason?: string }
): Promise<Result> {
  try {
    const actor = await requireAdminActor();

    if (input.suspend && (input.reason?.trim().length ?? 0) < 10) {
      return fail("Escribí un motivo de al menos 10 caracteres");
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, isActive: true },
    });
    if (!company) return fail("Empresa no encontrada");

    await prisma.$transaction(async (tx) => {
      await tx.company.update({
        where: { id: companyId },
        data: {
          isActive: !input.suspend,
          suspendedAt: input.suspend ? new Date() : null,
          suspendedReason: input.suspend ? input.reason!.trim() : null,
        },
      });

      if (input.suspend) {
        await tx.job.updateMany({
          where: { companyId, status: "PUBLISHED" },
          data: { status: "PAUSED" },
        });
      }
    });

    await recordAudit({
      actorId: actor.id,
      action: input.suspend ? "company.suspend" : "company.reactivate",
      targetType: "Company",
      targetId: companyId,
      metadata: { reason: input.reason ?? null },
    });

    revalidatePath("/admin/empresas");
    revalidatePath("/empleos");
    return { success: true };
  } catch (error) {
    console.error("setCompanySuspension:", error);
    return fail("No se pudo actualizar la empresa");
  }
}

/** Suspende o reactiva una cuenta de usuario. */
export async function setUserSuspension(
  userId: string,
  input: { suspend: boolean; reason?: string }
): Promise<Result> {
  try {
    const actor = await requireAdminActor();

    if (userId === actor.id) {
      return fail("No podés suspender tu propia cuenta");
    }
    if (input.suspend && (input.reason?.trim().length ?? 0) < 10) {
      return fail("Escribí un motivo de al menos 10 caracteres");
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, portal: true },
    });
    if (!target) return fail("Usuario no encontrado");

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          isActive: !input.suspend,
          suspendedAt: input.suspend ? new Date() : null,
          suspendedReason: input.suspend ? input.reason!.trim() : null,
        },
      });

      // Cerramos sus sesiones activas: suspender sin expulsar no suspende nada.
      if (input.suspend) {
        await tx.session.deleteMany({ where: { userId } });
      }
    });

    await recordAudit({
      actorId: actor.id,
      action: input.suspend ? "user.suspend" : "user.reactivate",
      targetType: "User",
      targetId: userId,
      portal: target.portal,
      metadata: { reason: input.reason ?? null, role: target.role },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("setUserSuspension:", error);
    return fail("No se pudo actualizar el usuario");
  }
}

/** Cambia el rol de un usuario. */
export async function setUserRole(
  userId: string,
  role: "CANDIDATE" | "COMPANY" | "ADMIN"
): Promise<Result> {
  try {
    const actor = await requireAdminActor();

    if (userId === actor.id) {
      return fail("No podés cambiar tu propio rol");
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, portal: true },
    });
    if (!target) return fail("Usuario no encontrado");
    if (target.role === role) return { success: true };

    // Quitarle el rol al último admin activo dejaría el panel sin dueño.
    if (target.role === "ADMIN" && role !== "ADMIN") {
      const remainingAdmins = await prisma.user.count({
        where: { role: "ADMIN", isActive: true, id: { not: userId } },
      });
      if (remainingAdmins === 0) {
        return fail("No se puede quitar el último administrador activo");
      }
    }

    await prisma.user.update({ where: { id: userId }, data: { role } });

    await recordAudit({
      actorId: actor.id,
      action: "user.role_change",
      targetType: "User",
      targetId: userId,
      portal: target.portal,
      metadata: { from: target.role, to: role },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("setUserRole:", error);
    return fail("No se pudo cambiar el rol");
  }
}

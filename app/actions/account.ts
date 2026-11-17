"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * Baja de la cuenta propia. Solo actúa sobre la sesión del request: no recibe
 * ningún id, así que no hay forma de pedir la baja de otra persona.
 *
 * El borrado va en cascada desde User (ver schema.prisma): sesiones, cuentas
 * OAuth, postulaciones, búsquedas guardadas y, si es dueña de una empresa, la
 * empresa, sus avisos y las postulaciones que OTROS candidatos hicieron a esos
 * avisos. La página lo advierte antes de confirmar.
 */
export async function deleteMyAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session)
    return {
      success: false,
      error: "La sesión se cerró: hay que ingresar de nuevo.",
    };

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        portal: true,
        company: {
          select: {
            _count: { select: { jobs: true } },
            jobs: { select: { _count: { select: { applicants: true } } } },
          },
        },
      },
    });
    if (!user) return { success: false, error: "No encontramos la cuenta." };

    const otherApplications =
      user.company?.jobs.reduce((n, job) => n + job._count.applicants, 0) ?? 0;

    await prisma.$transaction([
      // Sin datos personales: solo el id (ya huérfano) y los conteos, para
      // poder explicar después por qué desaparecieron avisos y postulaciones.
      prisma.auditLog.create({
        data: {
          actorId: userId,
          action: "user.self_delete",
          targetType: "User",
          targetId: userId,
          portal: user.portal,
          metadata: {
            hadCompany: Boolean(user.company),
            jobsDeleted: user.company?._count.jobs ?? 0,
            otherApplicationsDeleted: otherApplications,
          },
        },
      }),
      // El mismo correo en la lista de espera también es dato suyo.
      prisma.lead.deleteMany({ where: { email: user.email } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("deleteMyAccount:", error);
    return {
      success: false,
      error: "No se pudo eliminar la cuenta en este momento.",
    };
  }
}

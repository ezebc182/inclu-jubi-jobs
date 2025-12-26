"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitApplication(
  jobId: string,
  answers: {
    did: string;
    canDo: string;
    wantToDo: string;
  }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, error: "No autorizado" };
    }

    // Verificar el rol directamente desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "CANDIDATE") {
      return { success: false, error: "No autorizado" };
    }

    // Verificar que el empleo existe
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.status !== "PUBLISHED") {
      return { success: false, error: "Empleo no disponible" };
    }

    // Verificar que no se haya postulado ya
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: session.user.id,
        },
      },
    });

    if (existingApplication) {
      return { success: false, error: "Ya te postulaste a este empleo" };
    }

    // Actualizar las respuestas del usuario
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        did: answers.did,
        canDo: answers.canDo,
        wantToDo: answers.wantToDo,
      },
    });

    // Crear la postulación
    await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
        did: answers.did,
        canDo: answers.canDo,
        wantToDo: answers.wantToDo,
        status: "SUBMITTED",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error al crear postulación:", error);
    return { success: false, error: "Error al procesar la postulación" };
  }
}

export async function contactCandidate(applicationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("No autorizado");
  }

  // Verificar el rol directamente desde la base de datos para evitar problemas de caché de sesión
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "COMPANY") {
    throw new Error("Solo las empresas pueden contactar candidatos");
  }

  // Obtener la empresa del usuario
  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!company) {
    throw new Error("No se encontró la empresa");
  }

  // Verificar que la postulación pertenezca a un empleo de la empresa
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: true,
      user: true,
    },
  });

  if (!application) {
    throw new Error("Postulación no encontrada");
  }

  if (application.job.companyId !== company.id) {
    throw new Error("No tenés permiso para contactar este candidato");
  }

  // Actualizar el estado de la postulación
  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "CONTACTED" },
  });

  // TODO: Aquí se podría implementar el envío de email al candidato
  // Por ahora solo actualizamos el estado

  // Revalidar la página de empresa para reflejar los cambios
  revalidatePath("/empresa");
}

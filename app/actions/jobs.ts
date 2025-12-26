"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { jobFormSchema } from "@/lib/validations";

export async function updateJobStatus(
  jobId: string,
  newStatus: "PUBLISHED" | "PAUSED" | "CLOSED"
) {
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
    throw new Error("Solo las empresas pueden actualizar empleos");
  }

  // Obtener la empresa del usuario
  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!company) {
    throw new Error("No se encontró la empresa");
  }

  // Verificar que el empleo pertenezca a la empresa
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new Error("Empleo no encontrado");
  }

  if (job.companyId !== company.id) {
    throw new Error("No tenés permiso para actualizar este empleo");
  }

  // Actualizar el estado del empleo
  await prisma.job.update({
    where: { id: jobId },
    data: { status: newStatus },
  });

  // Revalidar la página de empresa para reflejar los cambios
  revalidatePath("/empresa");
}

export async function createJob(formData: FormData) {
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
    throw new Error("Solo las empresas pueden crear empleos");
  }

  // Obtener la empresa del usuario
  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!company) {
    throw new Error("No se encontró la empresa");
  }

  // Parsear y validar los datos del formulario
  const tags = JSON.parse(formData.get("tags") as string);

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    province: formData.get("province") as string,
    city: (formData.get("city") as string) || undefined,
    schedule: formData.get("schedule") as "PART_TIME" | "FLEX" | "POR_DIA",
    modality: formData.get("modality") as "PRESENCIAL" | "REMOTO" | "HIBRIDO",
    salaryArsMin: formData.get("salaryArsMin")
      ? parseInt(formData.get("salaryArsMin") as string)
      : undefined,
    salaryArsMax: formData.get("salaryArsMax")
      ? parseInt(formData.get("salaryArsMax") as string)
      : undefined,
    tags,
  };

  // Validar con el schema
  const validated = jobFormSchema.parse(data);

  // Crear el empleo
  await prisma.job.create({
    data: {
      companyId: company.id,
      title: validated.title,
      description: validated.description,
      province: validated.province,
      city: validated.city,
      schedule: validated.schedule,
      modality: validated.modality,
      salaryArsMin: validated.salaryArsMin,
      salaryArsMax: validated.salaryArsMax,
      tags: validated.tags,
      status: "PUBLISHED",
    },
  });

  // Revalidar las páginas relevantes
  revalidatePath("/empresa");
  revalidatePath("/empleos");

  return { success: true };
}

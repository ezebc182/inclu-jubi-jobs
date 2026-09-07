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
    select: { id: true, isActive: true, autoApproveJobs: true },
  });

  if (!company) {
    throw new Error("No se encontró la empresa");
  }

  if (!company.isActive) {
    throw new Error(
      "Tu empresa está suspendida. Escribinos para regularizar la situación."
    );
  }

  const parseOptionalInt = (value: FormDataEntryValue | null) => {
    if (typeof value !== "string" || value.trim() === "") return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  // `tags` y `portals` llegan como JSON desde el formulario.
  const parseJsonArray = (value: FormDataEntryValue | null): unknown[] => {
    if (typeof value !== "string" || value.trim() === "") return [];
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    province: formData.get("province") as string,
    city: (formData.get("city") as string) || undefined,
    schedule: formData.get("schedule") as "PART_TIME" | "FLEX" | "POR_DIA",
    modality: formData.get("modality") as "PRESENCIAL" | "REMOTO" | "HIBRIDO",
    salaryArsMin: parseOptionalInt(formData.get("salaryArsMin")),
    salaryArsMax: parseOptionalInt(formData.get("salaryArsMax")),
    tags: parseJsonArray(formData.get("tags")),
    portals: parseJsonArray(formData.get("portals")),
    accessibilityNotes:
      (formData.get("accessibilityNotes") as string) || undefined,
    isRemoteFriendly: formData.get("isRemoteFriendly") === "true",
    hasAccessibleSite: formData.get("hasAccessibleSite") === "true",
    supportsFlexHours: formData.get("supportsFlexHours") === "true",
  };

  const validated = jobFormSchema.parse(data);

  // Las empresas verificadas con auto-aprobación publican directo; el resto
  // pasa por la cola de moderación.
  const approved = company.autoApproveJobs;

  const job = await prisma.job.create({
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
      portals: validated.portals,
      accessibilityNotes: validated.accessibilityNotes,
      isRemoteFriendly: validated.isRemoteFriendly,
      hasAccessibleSite: validated.hasAccessibleSite,
      supportsFlexHours: validated.supportsFlexHours,
      status: approved ? "PUBLISHED" : "DRAFT",
      moderationStatus: approved ? "APPROVED" : "PENDING",
      moderatedAt: approved ? new Date() : null,
    },
    select: { id: true },
  });

  revalidatePath("/empresa");
  revalidatePath("/empleos");
  revalidatePath("/admin/moderacion");

  return {
    success: true,
    jobId: job.id,
    // La UI necesita saber si el aviso ya está visible o quedó en revisión.
    pendingReview: !approved,
  };
}

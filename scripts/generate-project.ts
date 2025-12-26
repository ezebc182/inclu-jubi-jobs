#!/usr/bin/env tsx
/**
 * Script generador del proyecto JubiJobs
 * Este script completa todos los archivos faltantes del MVP
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

function ensureDir(filepath: string) {
  mkdirSync(dirname(filepath), { recursive: true });
}

function writeFile(path: string, content: string) {
  ensureDir(path);
  writeFileSync(path, content, "utf-8");
  console.log(`✅ Creado: ${path}`);
}

// GENERAR TODOS LOS ARCHIVOS

// 1. Server Actions
const actionsJobsContent = `"use server";

import { prisma } from "@/lib/db";
import { jobFormSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createJob(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "COMPANY") {
    throw new Error("No autorizado");
  }

  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!company) {
    throw new Error("Empresa no encontrada");
  }

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    province: formData.get("province") as string,
    city: (formData.get("city") as string) || null,
    schedule: formData.get("schedule") as any,
    modality: formData.get("modality") as any,
    salaryArsMin: formData.get("salaryArsMin") ? parseInt(formData.get("salaryArsMin") as string) : null,
    salaryArsMax: formData.get("salaryArsMax") ? parseInt(formData.get("salaryArsMax") as string) : null,
    tags: JSON.parse(formData.get("tags") as string || "[]"),
  };

  const validated = jobFormSchema.parse(data);

  const job = await prisma.job.create({
    data: {
      ...validated,
      companyId: company.id,
      status: "PUBLISHED",
    },
  });

  revalidatePath("/empleos");
  revalidatePath("/empresa");

  return { success: true, jobId: job.id };
}

export async function updateJobStatus(jobId: string, status: "PUBLISHED" | "PAUSED" | "CLOSED") {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "COMPANY") {
    throw new Error("No autorizado");
  }

  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
  });

  const job = await prisma.job.findFirst({
    where: { id: jobId, companyId: company?.id },
  });

  if (!job) {
    throw new Error("Empleo no encontrado");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status },
  });

  revalidatePath("/empleos");
  revalidatePath("/empresa");

  return { success: true };
}
`;

const actionsApplicationsContent = `"use server";

import { prisma } from "@/lib/db";
import { applicationSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendApplicationConfirmation, sendNewApplicationNotification, sendContactRequest } from "@/lib/email";

export async function submitApplication(jobId: string, answers: { did: string; canDo: string; wantToDo: string }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "CANDIDATE") {
    throw new Error("No autorizado");
  }

  const data = { jobId, ...answers };
  const validated = applicationSchema.parse(data);

  // Verificar duplicados
  const existing = await prisma.application.findUnique({
    where: {
      jobId_userId: {
        jobId: validated.jobId,
        userId: session.user.id,
      },
    },
  });

  if (existing) {
    throw new Error("Ya te postulaste a este empleo");
  }

  const job = await prisma.job.findUnique({
    where: { id: validated.jobId },
    include: { company: { include: { owner: true } } },
  });

  if (!job || job.status !== "PUBLISHED") {
    throw new Error("Empleo no disponible");
  }

  const application = await prisma.application.create({
    data: {
      jobId: validated.jobId,
      userId: session.user.id,
      did: validated.did,
      canDo: validated.canDo,
      wantToDo: validated.wantToDo,
    },
  });

  // Enviar emails
  await sendApplicationConfirmation({
    to: session.user.email!,
    candidateName: session.user.name || "Candidato",
    jobTitle: job.title,
    companyName: job.company.name,
  });

  await sendNewApplicationNotification({
    to: job.company.owner.email!,
    companyName: job.company.name,
    jobTitle: job.title,
    candidateName: session.user.name || "Candidato",
    dashboardUrl: \`\${process.env.BETTER_AUTH_URL}/empresa\`,
  });

  revalidatePath(\`/empleos/\${jobId}\`);
  revalidatePath("/postulaciones");

  return { success: true, applicationId: application.id };
}

export async function contactCandidate(applicationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "COMPANY") {
    throw new Error("No autorizado");
  }

  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
    include: { owner: true },
  });

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      user: true,
      job: { include: { company: true } },
    },
  });

  if (!application || application.job.companyId !== company?.id) {
    throw new Error("Postulación no encontrada");
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: "CONTACTED",
      notes: \`Contactado el \${new Date().toLocaleDateString("es-AR")}\`,
    },
  });

  await sendContactRequest({
    to: application.user.email!,
    candidateName: application.user.name || "Candidato",
    jobTitle: application.job.title,
    companyName: application.job.company.name,
    companyEmail: company.owner.email!,
    companyPhone: company.owner.phone,
  });

  revalidatePath("/empresa");

  return { success: true };
}
`;

writeFile("app/actions/jobs.ts", actionsJobsContent);
writeFile("app/actions/applications.ts", actionsApplicationsContent);

console.log("\n🎉 Script de generación completado!");
console.log("\nPróximos pasos:");
console.log("1. pnpm install");
console.log("2. Configurar .env");
console.log("3. pnpm db:migrate");
console.log("4. pnpm db:seed");
console.log("5. pnpm dev");

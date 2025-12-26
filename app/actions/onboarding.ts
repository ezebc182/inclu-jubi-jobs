"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { candidateOnboardingSchema, companyProfileSchema } from "@/lib/validations";

export async function completeOnboardingCandidate(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("No autorizado");
  }

  const data = {
    name: formData.get("name") as string,
    phoneNumber: (formData.get("phone") as string) || "",
    location: formData.get("location") as string,
    birthYear: formData.get("birthYear") ? parseInt(formData.get("birthYear") as string) : undefined,
    isDisabled: formData.get("isDisabled") === "true",
    disabilityType: (formData.get("disabilityType") as any) || undefined,
    accessibilityNeeds: (formData.get("accessibilityNeeds") as string) || undefined,
    did: formData.get("did") as string,
    canDo: formData.get("canDo") as string,
    wantToDo: formData.get("wantToDo") as string,
  };

  const validated = candidateOnboardingSchema.parse(data);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...validated,
      role: "CANDIDATE",
    },
  });

  redirect("/empleos");
}

export async function completeOnboardingCompany(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("No autorizado");
  }

  const data = {
    name: formData.get("companyName") as string,
    website: (formData.get("website") as string) || "",
    about: (formData.get("about") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
  };

  const validated = companyProfileSchema.parse(data);

  // Verificar si ya existe una empresa para este usuario
  const existingCompany = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
  });

  if (existingCompany) {
    // Si ya existe, actualizar los datos
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { role: "COMPANY" },
      });

      await tx.company.update({
        where: { ownerId: session.user.id },
        data: {
          name: validated.name,
          website: validated.website,
          about: validated.about,
          location: validated.location,
        },
      });
    });
  } else {
    // Si no existe, crear nueva empresa
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { role: "COMPANY" },
      });

      await tx.company.create({
        data: {
          ownerId: session.user.id,
          name: validated.name,
          website: validated.website,
          about: validated.about,
          location: validated.location,
        },
      });
    });
  }

  // Redirigir a una página de confirmación que luego redirige al dashboard
  redirect("/onboarding/empresa/completado");
}

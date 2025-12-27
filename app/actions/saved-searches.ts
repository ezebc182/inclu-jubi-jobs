"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveSearch(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, error: "No autorizado" };
  }

  const name = formData.get("name") as string;
  const province = (formData.get("province") as string) || null;
  const modality = (formData.get("modality") as string) || null;
  const schedule = (formData.get("schedule") as string) || null;

  if (!name || name.trim().length < 3) {
    return { success: false, error: "El nombre debe tener al menos 3 caracteres" };
  }

  // Verificar que al menos un filtro esté seleccionado
  if (!province && !modality && !schedule) {
    return { success: false, error: "Seleccioná al menos un filtro para guardar" };
  }

  try {
    await prisma.savedSearch.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        province,
        modality: modality as any,
        schedule: schedule as any,
      },
    });

    revalidatePath("/empleos");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving search:", error);
    return { success: false, error: "Error al guardar la búsqueda" };
  }
}

export async function deleteSavedSearch(searchId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, error: "No autorizado" };
  }

  try {
    // Verificar que la búsqueda pertenece al usuario
    const search = await prisma.savedSearch.findUnique({
      where: { id: searchId },
    });

    if (!search || search.userId !== session.user.id) {
      return { success: false, error: "Búsqueda no encontrada" };
    }

    await prisma.savedSearch.delete({
      where: { id: searchId },
    });

    revalidatePath("/empleos");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting search:", error);
    return { success: false, error: "Error al eliminar la búsqueda" };
  }
}

export async function getSavedSearches() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return [];
  }

  try {
    const searches = await prisma.savedSearch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return searches;
  } catch (error) {
    console.error("Error getting saved searches:", error);
    return [];
  }
}

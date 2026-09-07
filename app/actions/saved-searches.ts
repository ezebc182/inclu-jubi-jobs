"use server";

import type { Modality, Schedule } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getCurrentPortal } from "@/lib/portal";

const MODALITIES: Modality[] = ["PRESENCIAL", "HIBRIDO", "REMOTO"];
const SCHEDULES: Schedule[] = ["PART_TIME", "FLEX", "POR_DIA"];

/** Descarta valores que no pertenezcan al enum antes de tocar la base. */
function asModality(value: string | null): Modality | null {
  return value && MODALITIES.includes(value as Modality)
    ? (value as Modality)
    : null;
}

function asSchedule(value: string | null): Schedule | null {
  return value && SCHEDULES.includes(value as Schedule)
    ? (value as Schedule)
    : null;
}

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
    return {
      success: false,
      error: "El nombre debe tener al menos 3 caracteres",
    };
  }

  // Verificar que al menos un filtro esté seleccionado
  if (!province && !modality && !schedule) {
    return {
      success: false,
      error: "Seleccioná al menos un filtro para guardar",
    };
  }

  try {
    await prisma.savedSearch.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        province,
        modality: asModality(modality),
        schedule: asSchedule(schedule),
        // La búsqueda queda atada al portal donde se creó: sus filtros solo
        // tienen sentido contra los avisos de ese portal.
        portal: await getCurrentPortal(),
      },
    });

    revalidatePath("/empleos");
    return { success: true };
  } catch (error) {
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
  } catch (error) {
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
    return await prisma.savedSearch.findMany({
      where: { userId: session.user.id, portal: await getCurrentPortal() },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error getting saved searches:", error);
    return [];
  }
}

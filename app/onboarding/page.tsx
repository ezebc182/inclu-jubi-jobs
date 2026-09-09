import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingSelector } from "@/components/onboarding/OnboardingSelector";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Si no hay sesión, redirigir a login
  if (!session) {
    redirect("/ingresar");
  }

  // Verificar el rol directamente desde la base de datos para evitar problemas de caché de sesión
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user) {
    redirect("/ingresar");
  }

  // Con rol elegido, cada quien va a lo suyo. Sin rol, se muestra el selector
  // de abajo — que antes era código muerto: como el schema ponía CANDIDATE por
  // defecto a todo usuario nuevo, esta condición se cumplía siempre y nadie
  // llegaba a elegir.
  if (user.role === "CANDIDATE") {
    redirect("/empleos");
  }

  if (user.role === "COMPANY") {
    // Verificar si ya tiene empresa creada
    const company = await prisma.company.findUnique({
      where: { ownerId: session.user.id },
    });

    if (company) {
      // Ya tiene empresa, ir al dashboard
      redirect("/empresa");
    } else {
      // No tiene empresa, ir a completar onboarding de empresa
      redirect("/onboarding/empresa");
    }
  }

  // Si llega aquí, el usuario no tiene rol asignado, mostrar selector
  return <OnboardingSelector />;
}

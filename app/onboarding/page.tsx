import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPortalSession } from "@/lib/session-portal";
import { OnboardingSelector } from "@/components/onboarding/OnboardingSelector";

export default async function OnboardingPage() {
  const session = await getPortalSession();

  if (!session) {
    redirect("/ingresar");
  }

  // Con rol elegido, cada quien va a lo suyo. Sin rol se muestra el selector de
  // abajo — que era código muerto mientras el schema ponía CANDIDATE por
  // defecto a todo usuario nuevo.
  if (session.role === "CANDIDATE") {
    redirect("/empleos");
  }

  if (session.role === "COMPANY") {
    const company = await prisma.company.findUnique({
      where: { ownerId: session.userId },
      select: { id: true },
    });

    redirect(company ? "/empresa" : "/onboarding/empresa");
  }

  return <OnboardingSelector />;
}

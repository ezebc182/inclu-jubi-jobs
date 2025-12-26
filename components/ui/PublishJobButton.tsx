import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { BigCTAButton } from "./BigCTAButton";

interface PublishJobButtonProps {
  children: React.ReactNode;
}

export async function PublishJobButton({ children }: PublishJobButtonProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Si no hay sesión, ir a login
  if (!session) {
    return <BigCTAButton href="/ingresar">{children}</BigCTAButton>;
  }

  // Verificar el rol del usuario desde la base de datos
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  // Si ya es empresa con perfil completo, ir directo al dashboard
  if (user?.role === "COMPANY") {
    const company = await prisma.company.findUnique({
      where: { ownerId: session.user.id },
    });

    if (company) {
      return <BigCTAButton href="/empresa">{children}</BigCTAButton>;
    } else {
      // Es empresa pero no completó el perfil
      return <BigCTAButton href="/onboarding/empresa">{children}</BigCTAButton>;
    }
  }

  // Si es candidato, ir a onboarding para cambiar de rol o crear nueva cuenta
  if (user?.role === "CANDIDATE") {
    return <BigCTAButton href="/ingresar">{children}</BigCTAButton>;
  }

  // Si no tiene rol, ir a onboarding
  return <BigCTAButton href="/onboarding">{children}</BigCTAButton>;
}

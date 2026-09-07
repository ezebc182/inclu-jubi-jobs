/**
 * Promueve una cuenta existente a ADMIN.
 *
 *   pnpm admin:grant tu-email@ejemplo.com
 *
 * El primer admin no puede crearse desde la interfaz — sería un agujero de
 * seguridad — así que se hace acá, con acceso a la base.
 *
 * La cuenta tiene que existir: primero iniciá sesión normalmente en el sitio
 * y después corré este comando con ese email.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    console.error("Uso: pnpm admin:grant <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    console.error(`\nNo existe una cuenta con el email "${email}".`);
    console.error("Iniciá sesión en el sitio con ese email y volvé a intentar.\n");
    process.exit(1);
  }

  if (user.role === "ADMIN") {
    console.log(`\n${user.email} ya es administrador. Nada que hacer.\n`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN", isActive: true },
  });

  console.log(`\n✓ ${user.email} ahora es administrador (antes: ${user.role}).`);
  console.log("  Entrá a /admin para usar el panel.\n");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

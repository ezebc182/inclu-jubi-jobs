import { PrismaClient } from "@prisma/client";

/**
 * En producción, `DATABASE_URL` ausente hace que Prisma falle recién en la
 * primera consulta, con un error enterrado en el stack. Avisarlo al arrancar
 * ahorra el rato de mirar un 500 sin saber por qué.
 *
 * No lanzamos: cortar el arranque dejaría el sitio entero sin responder,
 * cuando las páginas que no tocan la base pueden servirse igual.
 */
if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  console.error(
    "[db] Falta DATABASE_URL. Las páginas que consultan la base van a " +
      "responder vacías. Configurala en el entorno del deploy."
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

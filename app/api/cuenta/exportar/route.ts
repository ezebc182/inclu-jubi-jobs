import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * "Descargar mis datos" (derecho de acceso, Ley 25.326). Solo la sesión
 * actual, sin parámetros. Quedan afuera los tokens (de sesión y de OAuth) y
 * los datos de OTROS: de las postulaciones recibidas por una empresa va el
 * conteo, no quién se postuló.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return new Response("No autorizado", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: { select: { providerId: true, createdAt: true } },
      sessions: {
        select: {
          createdAt: true,
          expiresAt: true,
          ipAddress: true,
          userAgent: true,
        },
      },
      applications: {
        include: { job: { select: { id: true, title: true } } },
      },
      savedSearches: true,
      company: {
        include: {
          // Quién moderó es un admin: dato de otra persona.
          jobs: {
            omit: { moderatedById: true },
            include: { _count: { select: { applicants: true } } },
          },
        },
      },
    },
  });
  if (!user) return new Response("No encontrado", { status: 404 });

  const leads = await prisma.lead.findMany({ where: { email: user.email } });

  const body = JSON.stringify(
    { exportedAt: new Date().toISOString(), user, waitlist: leads },
    null,
    2
  );

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mis-datos.json"',
      "Cache-Control": "private, no-store",
    },
  });
}

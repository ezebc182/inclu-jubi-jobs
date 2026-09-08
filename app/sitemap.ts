import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getCurrentPortal, portalBaseUrl, publicJobFilter } from "@/lib/portal";

/** Se resuelve por dominio: cada portal indexa solo sus propios avisos. */
export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/empleos", priority: 0.9, changeFrequency: "hourly" as const },
  { path: "/empresas", priority: 0.8, changeFrequency: "weekly" as const },
  {
    path: "/como-funciona",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/accesibilidad",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/preguntas-frecuentes",
    priority: 0.5,
    changeFrequency: "monthly" as const,
  },
  { path: "/ayuda", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/terminos", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const portal = await getCurrentPortal();
  const baseUrl = portalBaseUrl(portal);

  // Si la base no responde igual servimos el sitemap con las páginas
  // estáticas: un sitemap incompleto es mucho mejor que un 500, que le
  // dice al buscador que el sitio está roto.
  let jobs: Array<{ id: string; updatedAt: Date }> = [];
  try {
    jobs = await prisma.job.findMany({
      where: publicJobFilter(portal),
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 5000,
    });
  } catch (error) {
    console.error("[sitemap] No se pudieron listar los avisos:", error);
  }

  return [
    ...STATIC_PATHS.map((entry) => ({
      url: `${baseUrl}${entry.path}`,
      lastModified: new Date(),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...jobs.map((job) => ({
      url: `${baseUrl}/empleos/${job.id}`,
      lastModified: job.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}

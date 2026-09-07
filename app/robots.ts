import type { MetadataRoute } from "next";
import { getCurrentPortal, portalBaseUrl } from "@/lib/portal";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const portal = await getCurrentPortal();
  const baseUrl = portalBaseUrl(portal);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Zonas privadas y de gestión: nada que un buscador deba indexar.
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/empresa",
          "/empresa/",
          "/postulaciones",
          "/onboarding",
          "/onboarding/",
          "/offline",
          "/ingresar",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

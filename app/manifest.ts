import type { MetadataRoute } from "next";
import { getCurrentPortalConfig } from "@/lib/portal";

/**
 * Manifest PWA resuelto por dominio.
 *
 * jubijobs.com e inclujobs.com son PWAs distintas: distinto nombre, distintos
 * iconos y distinto color. El usuario instala la app de SU portal.
 *
 * `force-dynamic` es obligatorio: sin esto Next lo cachea en build y los dos
 * dominios terminan sirviendo el mismo manifest.
 */
export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const portal = await getCurrentPortalConfig();
  const slug = portal.dataAttr; // "jubi" | "inclu"

  return {
    id: `/?portal=${slug}`,
    name: `${portal.name} — Empleos en Argentina`,
    short_name: portal.name,
    description: portal.description,
    start_url: "/empleos?utm_source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: portal.themeColor,
    background_color: portal.backgroundColor,
    lang: "es-AR",
    dir: "ltr",
    categories: ["business", "productivity"],

    icons: [
      {
        src: `/icons/${slug}-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `/icons/${slug}-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // Maskable: Android recorta el icono a la forma del launcher.
        // Sin esta variante el logo sale mutilado.
        src: `/icons/${slug}-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    // Accesos directos del menú contextual del icono instalado.
    shortcuts: [
      {
        name: "Buscar empleos",
        short_name: "Empleos",
        url: "/empleos",
        description: "Ver los empleos disponibles",
      },
      {
        name: "Mis postulaciones",
        short_name: "Postulaciones",
        url: "/postulaciones",
        description: "Seguir el estado de tus postulaciones",
      },
    ],
  };
}

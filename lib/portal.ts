import "server-only";

import { headers } from "next/headers";

/**
 * Portales del producto.
 *
 * IMPORTANTE: JubiJobs e IncluJobs son audiencias SEPARADAS, no intercambiables.
 * Un aviso pensado para una persona con discapacidad visual no es lo mismo que
 * uno pensado para una persona jubilada de 68 años. Comparten infraestructura
 * (código, base de datos, auth, panel admin) pero NO comparten contenido:
 * un candidato solo ve avisos de su portal.
 *
 * Las empresas sí operan en ambos y eligen, por aviso, dónde publicarlo.
 */
export type PortalId = "JUBI" | "INCLU";

/** Header interno que el middleware inyecta en cada request. */
export const PORTAL_HEADER = "x-portal";

export const DEFAULT_PORTAL: PortalId = "JUBI";

export interface PortalConfig {
  id: PortalId;
  /** Nombre corto de marca, para UI. */
  name: string;
  /** Nombre completo, para metadata y documentos legales. */
  legalName: string;
  /** Dominio productivo canónico. */
  domain: string;
  /** Audiencia, en una línea. Se usa en el admin y en la metadata. */
  audience: string;
  tagline: string;
  description: string;
  /** Color de marca en hex, para el manifest PWA y `theme-color`. */
  themeColor: string;
  backgroundColor: string;
  /**
   * Valor de `data-portal` en el `<html>`. globals.css redefine los tokens
   * de color en función de este atributo.
   */
  dataAttr: "jubi" | "inclu";
  /** Emoji de fallback para iconos, hasta tener los SVG definitivos. */
  emoji: string;
  contactEmail: string;
}

const PORTALS: Record<PortalId, PortalConfig> = {
  JUBI: {
    id: "JUBI",
    name: "JubiJobs",
    legalName: "JubiJobs",
    domain: "jubijobs.com",
    audience: "Personas jubiladas y mayores de 60 años",
    tagline: "Tu experiencia vale. Encontrá trabajo sin vueltas.",
    description:
      "Plataforma de empleo para personas jubiladas en Argentina. Trabajos part-time, flexibles y por día. Tres preguntas y listo: sin currículum, sin LinkedIn, sin complicaciones.",
    themeColor: "#1E40AF",
    backgroundColor: "#F9FAFB",
    dataAttr: "jubi",
    emoji: "💼",
    contactEmail: "hola@jubijobs.com",
  },
  INCLU: {
    id: "INCLU",
    name: "IncluJobs",
    legalName: "IncluJobs",
    domain: "inclujobs.com",
    audience: "Personas con discapacidad",
    tagline: "Trabajo real, con las condiciones que necesitás.",
    description:
      "Plataforma de empleo inclusivo en Argentina. Cada aviso declara sus condiciones de accesibilidad antes de que te postules: instalaciones adaptadas, horarios flexibles y trabajo remoto.",
    themeColor: "#6D28D9",
    backgroundColor: "#F9FAFB",
    dataAttr: "inclu",
    emoji: "♿",
    contactEmail: "hola@inclujobs.com",
  },
};

/** Mapa dominio → portal. Cubre producción, previews de Vercel y desarrollo. */
const HOST_MAP: ReadonlyArray<readonly [pattern: RegExp, portal: PortalId]> = [
  [/^(www\.)?inclujobs\.com$/i, "INCLU"],
  [/^(www\.)?jubijobs\.com$/i, "JUBI"],
  // Previews y desarrollo: inclujobs-algo.vercel.app, inclu.localhost:3000
  [/(^|[.-])inclu/i, "INCLU"],
  [/(^|[.-])jubi/i, "JUBI"],
];

/**
 * Resuelve el portal a partir del `Host`. Pura y sincrónica: la usan tanto el
 * middleware (runtime edge) como el código de servidor.
 */
export function resolvePortalFromHost(
  host: string | null | undefined
): PortalId {
  if (!host) return DEFAULT_PORTAL;
  // Descartamos el puerto: "inclu.localhost:3000" → "inclu.localhost"
  const hostname = host.split(":")[0]!.trim().toLowerCase();

  for (const [pattern, portal] of HOST_MAP) {
    if (pattern.test(hostname)) return portal;
  }
  return DEFAULT_PORTAL;
}

export function isPortalId(
  value: string | null | undefined
): value is PortalId {
  return value === "JUBI" || value === "INCLU";
}

export function getPortalConfig(id: PortalId): PortalConfig {
  return PORTALS[id];
}

export function allPortals(): PortalConfig[] {
  return [PORTALS.JUBI, PORTALS.INCLU];
}

/**
 * Portal del request actual, leído del header que inyecta el middleware.
 *
 * Es la única fuente de verdad para el contenido que ve el usuario. TODA query
 * pública de avisos debe filtrar por este valor — ver `publicJobFilter()`.
 */
export async function getCurrentPortal(): Promise<PortalId> {
  const h = await headers();
  const fromMiddleware = h.get(PORTAL_HEADER);
  if (isPortalId(fromMiddleware)) return fromMiddleware;

  // Fallback: si el middleware no corrió (p. ej. una route handler fuera del
  // matcher), resolvemos desde el Host antes que servir el default a ciegas.
  return resolvePortalFromHost(h.get("host"));
}

export async function getCurrentPortalConfig(): Promise<PortalConfig> {
  return getPortalConfig(await getCurrentPortal());
}

/**
 * Filtro Prisma que aísla los avisos de un portal.
 *
 * Sin esto, un candidato de JubiJobs ve avisos de IncluJobs — que es
 * exactamente lo que este producto NO debe hacer.
 */
export function portalJobFilter(portal: PortalId) {
  return { portals: { has: portal } } as const;
}

/** Avisos visibles al público: del portal, publicados y aprobados. */
export function publicJobFilter(portal: PortalId) {
  return {
    ...portalJobFilter(portal),
    status: "PUBLISHED",
    moderationStatus: "APPROVED",
  } as const;
}

/**
 * URL absoluta canónica del portal, para metadata, sitemap y Open Graph.
 *
 * Deriva del dominio de cada portal, NO de una variable de entorno. Motivo:
 * `NEXT_PUBLIC_*` se congela en tiempo de build con un solo valor, y ambos
 * dominios se sirven desde el mismo deployment — un override haría que
 * IncluJobs publicara canonical y sitemap apuntando a jubijobs.com.
 *
 * El override solo se respeta cuando NO es un dominio productivo, para poder
 * fijar una URL en previews de Vercel o en desarrollo local.
 */
export function portalBaseUrl(id: PortalId): string {
  const config = getPortalConfig(id);
  const override = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

  if (override) {
    const isProductionDomain = allPortals().some((portal) =>
      override.includes(portal.domain)
    );
    if (!isProductionDomain) return override;
  }

  return `https://${config.domain}`;
}

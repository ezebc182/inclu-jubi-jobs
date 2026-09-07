/**
 * Logos de marca, como SVG generado.
 *
 * Se definen acá una sola vez y los consumen tres lugares: el header, el
 * generador de iconos PWA y el favicon. Sin esto, cambiar el logo implica
 * tocar archivos binarios sueltos y que alguno quede viejo.
 *
 * Sin `server-only`: el header lo importa desde el cliente.
 */

export type BrandSlug = "jubi" | "inclu";

export interface BrandArt {
  /** Color principal de la marca. */
  primary: string;
  /** Acento, para el detalle que distingue cada símbolo. */
  accent: string;
  /** Nombre mostrado junto al símbolo. */
  wordmark: string;
}

export const BRAND_ART: Record<BrandSlug, BrandArt> = {
  jubi: { primary: "#1E40AF", accent: "#F59E0B", wordmark: "JubiJobs" },
  inclu: { primary: "#6D28D9", accent: "#14B8A6", wordmark: "InclúJobs" },
};

/**
 * Símbolo de JubiJobs: tres escalones ascendentes y un sol naciente.
 *
 * Los escalones crecen de izquierda a derecha — la trayectoria sigue
 * subiendo, la carrera no terminó con la jubilación. El disco de acento
 * arriba a la derecha lee como amanecer, no como atardecer: es deliberado.
 *
 * Geometría centrada en el viewBox 64×64 con márgenes iguales de 10 px.
 */
function jubiSymbol(art: BrandArt, onDark: boolean): string {
  const solid = onDark ? "#FFFFFF" : art.primary;
  return `
  <g>
    <circle cx="45" cy="19" r="7" fill="${art.accent}"/>
    <rect x="10" y="40" width="13" height="14" rx="3" fill="${solid}"/>
    <rect x="25.5" y="32" width="13" height="22" rx="3" fill="${solid}"/>
    <rect x="41" y="32" width="13" height="22" rx="3" fill="${solid}"/>
  </g>`.trim();
}

/**
 * Símbolo de InclúJobs: cuatro figuras distintas alrededor de un centro común.
 *
 * La lectura es la idea entera de la marca: la inclusión no es que todos sean
 * iguales, es que piezas de formas diferentes tengan lugar en el mismo
 * conjunto. Cada figura tiene tamaño propio y ninguna es la "normal".
 *
 * Evita a propósito el pictograma de silla de ruedas: reduce toda la
 * discapacidad a la motriz y deja afuera a la mayoría de nuestros usuarios.
 */
function incluSymbol(art: BrandArt, onDark: boolean): string {
  const solid = onDark ? "#FFFFFF" : art.primary;
  return `
  <g>
    <circle cx="32" cy="32" r="7" fill="${art.accent}"/>
    <circle cx="32" cy="13" r="8" fill="${solid}"/>
    <circle cx="51" cy="32" r="6" fill="${solid}"/>
    <circle cx="32" cy="51" r="7.5" fill="${solid}"/>
    <circle cx="13" cy="32" r="5" fill="${solid}"/>
  </g>`.trim();
}

/** SVG completo del símbolo, en viewBox 64×64. */
export function brandSymbolSvg({
  slug,
  size = 64,
  onDark = false,
}: {
  slug: BrandSlug;
  size?: number;
  onDark?: boolean;
}): string {
  const art = BRAND_ART[slug];
  const symbol = slug === "jubi" ? jubiSymbol(art, onDark) : incluSymbol(art, onDark);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="${art.wordmark}">${symbol}</svg>`;
}

/**
 * Icono para la PWA: símbolo sobre fondo de marca.
 *
 * @param safeRatio Proporción del lienzo ocupada por el símbolo. Los iconos
 *   maskable necesitan 0.6: Android recorta hasta un 20% por lado según la
 *   forma del launcher, y un símbolo a sangre queda mutilado.
 */
export function brandIconSvg({
  slug,
  size,
  safeRatio = 1,
  rounded = true,
}: {
  slug: BrandSlug;
  size: number;
  safeRatio?: number;
  rounded?: boolean;
}): string {
  const art = BRAND_ART[slug];
  const symbol = slug === "jubi" ? jubiSymbol(art, true) : incluSymbol(art, true);

  const inner = size * safeRatio * 0.72;
  const offset = (size - inner) / 2;
  const scale = inner / 64;
  const radius = rounded ? Math.round(size * 0.22) : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${art.primary}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})">${symbol}</g>
</svg>`;
}

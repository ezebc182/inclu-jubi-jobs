import { BRAND_ART, brandSymbolSvg, type BrandSlug } from "@/lib/brand-assets";

/**
 * Logo de marca: símbolo + nombre.
 *
 * El SVG se inyecta inline en vez de usar <img>: hereda `currentColor` cuando
 * hace falta, no dispara una request extra y no parpadea en la primera carga
 * — que en un teléfono con red lenta se nota.
 */
export function BrandLogo({
  slug,
  className = "",
  symbolSize = 40,
  showWordmark = true,
}: {
  slug: BrandSlug;
  className?: string;
  symbolSize?: number;
  showWordmark?: boolean;
}) {
  const art = BRAND_ART[slug];
  const svg = brandSymbolSvg({ slug, size: symbolSize });

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className="shrink-0"
        style={{ width: symbolSize, height: symbolSize }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {showWordmark ? (
        <span className="text-3xl font-bold tracking-tight">{art.wordmark}</span>
      ) : (
        <span className="sr-only">{art.wordmark}</span>
      )}
    </span>
  );
}

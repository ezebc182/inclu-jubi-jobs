/**
 * Genera los iconos PWA y favicons de ambos portales a partir de los logos
 * definidos en lib/brand-assets.ts.
 *
 *   pnpm icons:generate
 *
 * Los SVG son la fuente de verdad; estos PNG son derivados. Si cambia el
 * logo, se toca brand-assets.ts y se vuelve a correr esto — nunca al revés.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { brandIconSvg, brandSymbolSvg, type BrandSlug } from "../lib/brand-assets";

const SLUGS: BrandSlug[] = ["jubi", "inclu"];
const OUT_DIR = path.join(process.cwd(), "public", "icons");

async function png(svg: string, name: string) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(OUT_DIR, name));
  console.log(`  ✓ ${name}`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const slug of SLUGS) {
    console.log(`${slug}:`);

    await png(brandIconSvg({ slug, size: 192 }), `${slug}-192.png`);
    await png(brandIconSvg({ slug, size: 512 }), `${slug}-512.png`);
    // Zona segura del 60%: sobrevive al recorte de cualquier launcher Android.
    await png(
      brandIconSvg({ slug, size: 512, safeRatio: 0.6 }),
      `${slug}-maskable-512.png`
    );
    // iOS aplica su propia máscara: el icono se entrega cuadrado.
    await png(
      brandIconSvg({ slug, size: 180, rounded: false }),
      `${slug}-apple-touch.png`
    );
    await png(brandIconSvg({ slug, size: 32 }), `${slug}-favicon.png`);

    // Símbolo suelto sobre fondo transparente, para el header y el OG.
    await writeFile(
      path.join(OUT_DIR, `${slug}-symbol.svg`),
      brandSymbolSvg({ slug, size: 64 }),
      "utf8"
    );
    console.log(`  ✓ ${slug}-symbol.svg`);
  }

  console.log("\nListo: public/icons/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

/**
 * Genera los iconos PWA de ambos portales.
 *
 *   pnpm icons:generate
 *
 * Produce placeholders tipográficos honestos, no arte final: cuando exista el
 * logo definitivo se reemplazan los PNG de public/icons/ y listo. Lo que
 * importa ahora es que el manifest apunte a archivos que existan — un icono
 * roto invalida la instalación de la PWA entera.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

interface IconSpec {
  slug: "jubi" | "inclu";
  label: string;
  bg: string;
  fg: string;
}

const SPECS: IconSpec[] = [
  { slug: "jubi", label: "JJ", bg: "#1E40AF", fg: "#FFFFFF" },
  { slug: "inclu", label: "IJ", bg: "#6D28D9", fg: "#FFFFFF" },
];

const OUT_DIR = path.join(process.cwd(), "public", "icons");

/**
 * @param safeRatio Proporción del lienzo que ocupa el contenido.
 *   Los iconos maskable necesitan margen: Android recorta hasta un 20% por
 *   borde según la forma del launcher.
 */
function svg({ size, spec, safeRatio }: { size: number; spec: IconSpec; safeRatio: number }) {
  const fontSize = Math.round(size * safeRatio * 0.42);
  const radius = Math.round(size * 0.18);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${spec.bg}"/>
  <text x="50%" y="50%" dy="0.35em"
        font-family="Inter, Helvetica, Arial, sans-serif"
        font-size="${fontSize}" font-weight="700"
        fill="${spec.fg}" text-anchor="middle">${spec.label}</text>
</svg>`;
}

async function render(spec: IconSpec, size: number, name: string, safeRatio: number) {
  const buffer = Buffer.from(svg({ size, spec, safeRatio }));
  const target = path.join(OUT_DIR, name);
  await sharp(buffer).png({ compressionLevel: 9 }).toFile(target);
  console.log(`  ✓ ${name}`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const spec of SPECS) {
    console.log(`${spec.slug}:`);
    await render(spec, 192, `${spec.slug}-192.png`, 1);
    await render(spec, 512, `${spec.slug}-512.png`, 1);
    // Zona segura del 60%: sobrevive a cualquier recorte de launcher.
    await render(spec, 512, `${spec.slug}-maskable-512.png`, 0.6);
    await render(spec, 180, `${spec.slug}-apple-touch.png`, 1);
    await render(spec, 32, `${spec.slug}-favicon.png`, 1);
  }

  console.log("\nIconos generados en public/icons/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

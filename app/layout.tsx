import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Fraunces, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { RootClientWrapper } from "@/components/layout/RootClientWrapper";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UserWayWidget } from "@/components/a11y/UserWayWidget";
import { auth } from "@/lib/auth";
import { getCurrentPortalConfig, portalBaseUrl } from "@/lib/portal";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Fraunces para títulos: serif contemporánea con carácter, elegida sobre
 * las serif de siempre. Da autoridad institucional sin sonar a notaría.
 *
 * `SOFT` y `WONK` en 0 mantienen la forma sobria; el eje óptico se ajusta
 * automáticamente al tamaño.
 */
const display = Fraunces({
  subsets: ["latin"],
  // Fuente variable: un solo archivo cubre todo el rango de pesos, así
  // que pesa menos que dos cortes fijos. `axes` solo es válido en este
  // modo, nunca junto a un `weight` concreto.
  weight: "variable",
  display: "swap",
  variable: "--font-display",
});

/**
 * Atkinson Hyperlegible — solo IncluJobs.
 *
 * No es una elección estética, es la razón por la que existe la fuente. La
 * diseñó el Braille Institute desambiguando las formas que se confunden a baja
 * visión: la I mayúscula, la l minúscula y el 1; la O y el 0; la b y la d.
 *
 * Para un portal donde parte de la audiencia tiene discapacidad visual, eso
 * cambia la tasa de error de lectura real — no es un gesto de marca.
 *
 * Se carga siempre y se aplica por `data-portal` en globals.css. Un `<link>`
 * condicional por portal obligaría a mover la carga de fuentes al cliente y
 * perderíamos el preload que hace next/font.
 */
const hyperlegible = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-hyperlegible",
});

export async function generateMetadata(): Promise<Metadata> {
  const portal = await getCurrentPortalConfig();
  const baseUrl = portalBaseUrl(portal.id);
  const slug = portal.dataAttr;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${portal.name} — ${portal.tagline}`,
      template: `%s — ${portal.name}`,
    },
    description: portal.description,
    applicationName: portal.name,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: portal.name,
      statusBarStyle: "default",
    },
    icons: {
      icon: [
        {
          url: `/icons/${slug}-favicon.png`,
          sizes: "32x32",
          type: "image/png",
        },
      ],
      apple: [{ url: `/icons/${slug}-apple-touch.png`, sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: portal.name,
      title: `${portal.name} — ${portal.tagline}`,
      description: portal.description,
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${portal.name} — ${portal.tagline}`,
      description: portal.description,
    },
    alternates: { canonical: baseUrl },
    robots: { index: true, follow: true },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const portal = await getCurrentPortalConfig();
  return {
    themeColor: portal.themeColor,
    width: "device-width",
    initialScale: 1,
    // Nunca bloqueamos el zoom: WCAG 1.4.4 exige poder ampliar hasta 200%,
    // y esta audiencia lo usa de verdad.
    maximumScale: 5,
    userScalable: true,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, portal] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getCurrentPortalConfig(),
  ]);

  return (
    <html
      lang="es-AR"
      data-portal={portal.dataAttr}
      suppressHydrationWarning
      className={`${inter.variable} ${display.variable} ${hyperlegible.variable}`}
    >
      {/* Sin `inter.className`: esa clase fija `font-family: Inter` en el body
          y le ganaba a `--font-body`, dejando a IncluJobs con Inter en vez de
          Atkinson. La familia la resuelve globals.css por `data-portal`; acá
          solo declaramos las variables (en el <html>, arriba). */}
      <body>
        <RootClientWrapper
          session={session}
          brand={portal.dataAttr}
          portalName={portal.name}
        >
          {children}
        </RootClientWrapper>
        <ServiceWorkerRegistrar />
        <InstallPrompt appName={portal.name} />
        <UserWayWidget />
      </body>
    </html>
  );
}

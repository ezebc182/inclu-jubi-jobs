import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
      className={inter.variable}
    >
      <head>
        {/* Aplicamos el tema antes del primer pintado para evitar el
            destello de fondo claro. Va inline por necesidad: cualquier
            script externo llegaría tarde. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (dark) document.documentElement.classList.add('dark');
                var f = localStorage.getItem('font-size');
                if (f) document.documentElement.classList.add('font-size-' + f);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
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

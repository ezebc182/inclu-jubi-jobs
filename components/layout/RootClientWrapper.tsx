"use client";

import { ClientHeader } from "./ClientHeader";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import type { BrandSlug } from "@/lib/brand-assets";

interface SessionUser {
  id: string;
  role?: "CANDIDATE" | "COMPANY" | "ADMIN";
  /** Los tres vienen de Google. `name` e `image` pueden faltar. */
  name: string | null;
  email: string;
  image: string | null;
}

export function RootClientWrapper({
  children,
  session,
  brand,
  portalName,
}: {
  children: ReactNode;
  session: { user: SessionUser } | null;
  brand: BrandSlug;
  portalName: string;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster
        position="top-center"
        richColors
        closeButton
        expand
        toastOptions={{
          // Notificaciones grandes y con tiempo suficiente para leerlas:
          // el default de sonner es chico para esta audiencia.
          style: {
            fontSize: "18px",
            minHeight: "80px",
            padding: "20px",
            fontWeight: "600",
            maxWidth: "600px",
          },
          duration: 6000,
        }}
      />
      <a href="#main-content" className="skip-to-content">
        Saltar al contenido principal
      </a>
      <ClientHeader session={session} brand={brand} />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer portalName={portalName} brand={brand} />
    </ThemeProvider>
  );
}

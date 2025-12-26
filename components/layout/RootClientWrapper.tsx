"use client";

import { ClientHeader } from "./ClientHeader";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export function RootClientWrapper({
  children,
  session
}: {
  children: ReactNode;
  session: any;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <a href="#main-content" className="skip-to-content">
        Saltar al contenido principal
      </a>
      <ClientHeader session={session} />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}

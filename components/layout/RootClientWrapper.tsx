"use client";

import { ClientHeader } from "./ClientHeader";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function RootClientWrapper({
  children,
  session
}: {
  children: ReactNode;
  session: any;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontSize: '16px',
            minHeight: '60px',
          },
          className: 'text-lg',
        }}
      />
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

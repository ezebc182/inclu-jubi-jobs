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
        position="top-center"
        richColors
        closeButton
        expand={true}
        toastOptions={{
          style: {
            fontSize: '18px',
            minHeight: '80px',
            padding: '20px',
            fontWeight: '600',
            maxWidth: '600px',
          },
          className: 'text-xl',
          duration: 5000,
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

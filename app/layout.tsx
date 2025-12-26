import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootClientWrapper } from "@/components/layout/RootClientWrapper";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JubiJobs - Trabajos para jubilados en Argentina",
  description:
    "Plataforma de empleos para personas jubiladas y con discapacidad en Argentina. Simple, claro y sin vueltas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="es-AR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('theme');
                const theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <RootClientWrapper session={session}>
          {children}
        </RootClientWrapper>
      </body>
    </html>
  );
}

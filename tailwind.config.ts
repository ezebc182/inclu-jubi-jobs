import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Habilitar dark mode con clase
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /**
         * `primary` sale de las CSS variables que define globals.css según
         * `<html data-portal>`. Así el MISMO componente se ve azul en
         * JubiJobs y violeta en InclúJobs, sin duplicar una sola clase.
         *
         * El formato `rgb(var(--x) / <alpha-value>)` es lo que permite que
         * sigan funcionando los modificadores de opacidad (bg-primary-600/20).
         */
        primary: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
          950: "rgb(var(--brand-900) / <alpha-value>)",
        },
        secondary: {
          50: "#fffbeb",
          100: "#FEF3C7", // Sunset Light
          200: "#fde68a",
          300: "#fcd34d",
          400: "#FBBF24", // Sunset Medium
          500: "#F59E0B", // Sunset Warm (Color secundario)
          600: "#D97706", // Sunset Dark
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        success: {
          50: "#ecfdf5",
          100: "#D1FAE5", // Success Light
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10B981", // Success Green
          600: "#059669", // Success Dark
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Tamaños según BRANDING.md
        sm: ["16px", { lineHeight: "1.6" }], // Body Small
        base: ["18px", { lineHeight: "1.7" }], // Body Regular - MÍNIMO
        lg: ["20px", { lineHeight: "1.7" }], // Body Large
        xl: ["24px", { lineHeight: "1.4" }], // H3
        "2xl": ["28px", { lineHeight: "1.3" }], // Mobile H2
        "3xl": ["36px", { lineHeight: "1.3" }], // H2
        "4xl": ["48px", { lineHeight: "1.2" }], // H1
      },
      spacing: {
        18: "4.5rem", // 72px
        22: "5.5rem", // 88px
      },
    },
  },
  plugins: [],
};
export default config;

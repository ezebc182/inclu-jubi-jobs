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
         * JubiJobs y violeta en IncluJobs, sin duplicar una sola clase.
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
        /**
         * Acento de marca. Reemplaza el naranja anterior, que competía
         * con el azul primario en vez de complementarlo.
         */
        secondary: {
          50: "rgb(var(--accent-50) / <alpha-value>)",
          100: "rgb(var(--accent-100) / <alpha-value>)",
          200: "rgb(var(--accent-100) / <alpha-value>)",
          300: "rgb(var(--accent-500) / <alpha-value>)",
          400: "rgb(var(--accent-500) / <alpha-value>)",
          500: "rgb(var(--accent-500) / <alpha-value>)",
          600: "rgb(var(--accent-600) / <alpha-value>)",
          700: "rgb(var(--accent-700) / <alpha-value>)",
          800: "rgb(var(--accent-700) / <alpha-value>)",
          900: "rgb(var(--accent-700) / <alpha-value>)",
        },

        /** Tokens semánticos: usar estos antes que gray-* fijos. */
        paper: "rgb(var(--paper) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
        },
        rule: "rgb(var(--rule) / <alpha-value>)",
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
        /**
         * Las dos apuntan a las variables que globals.css redefine según
         * `<html data-portal>`. Así `font-display` da Fraunces en JubiJobs y
         * Atkinson Hyperlegible en IncluJobs, sin tocar los 12 lugares que
         * ya usan la clase.
         *
         * Antes `display` apuntaba a `--font-display` (Fraunces) directo, y
         * cada `font-display` en un componente forzaba la serif también en
         * IncluJobs — anulando ahí la fuente elegida por legibilidad.
         */
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-heading)", "Georgia", "serif"],
      },
      fontSize: {
        /**
         * Escala tipográfica en proporción ~1.25 (tercera mayor), con el
         * cuerpo en 18px. No es "letra grande para gente mayor": es el
         * tamaño en que un texto largo se lee cómodo a cualquier edad.
         */
        xs: ["14px", { lineHeight: "1.5" }],
        sm: ["16px", { lineHeight: "1.6" }],
        base: ["18px", { lineHeight: "1.65" }],
        lg: ["20px", { lineHeight: "1.6" }],
        xl: ["24px", { lineHeight: "1.4" }],
        "2xl": ["30px", { lineHeight: "1.25" }],
        "3xl": ["38px", { lineHeight: "1.18" }],
        "4xl": ["48px", { lineHeight: "1.1" }],
        "5xl": ["60px", { lineHeight: "1.05" }],
        "6xl": ["72px", { lineHeight: "1" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        /**
         * Radios diferenciados por jerarquía. Un solo border-radius en
         * todo el sitio aplana la información: el botón y el panel no
         * son la misma clase de objeto.
         */
        sm: "3px",
        DEFAULT: "5px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      maxWidth: {
        measure: "62ch",
        "measure-tight": "46ch",
      },
    },
  },
  plugins: [],
};
export default config;

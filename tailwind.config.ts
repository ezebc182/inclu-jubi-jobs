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
        // Paleta JubiJobs basada en BRANDING.md
        primary: {
          50: "#eff6ff",
          100: "#DBEAFE", // Azure Light
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60A5FA", // Azure Medium
          500: "#3b82f6",
          600: "#2563EB", // Azure Trust (Color principal)
          700: "#1E40AF", // Azure Dark
          800: "#1e3a8a",
          900: "#1e293b",
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

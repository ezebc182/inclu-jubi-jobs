import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        // Fotografía de archivo provisoria. Reemplazar por imágenes
        // propias antes de una campaña: el stock se reconoce.
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Specify the root directory for Turbopack to avoid lockfile warnings
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;

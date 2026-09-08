import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so Vercel always has an `out/` directory to serve.
  // Fixes platform NOT_FOUND when Output Directory is mis-set on the project.
  output: "export",
  // SSH tunnel / 127.0.0.1 vs localhost — avoid blocked /_next assets in dev
  allowedDevOrigins: ["127.0.0.1", "192.168.1.17"],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "static.tildacdn.com" },
      { protocol: "https", hostname: "thb.tildacdn.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSH tunnel / 127.0.0.1 vs localhost — avoid blocked /_next assets in dev
  allowedDevOrigins: ["127.0.0.1", "192.168.1.17"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.tildacdn.com" },
      { protocol: "https", hostname: "thb.tildacdn.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/studio",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

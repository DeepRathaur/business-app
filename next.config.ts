import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',      // Generates an 'out' folder for Capacitor
  images: { unoptimized: true },
};

export default nextConfig;
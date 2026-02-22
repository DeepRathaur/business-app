import type { NextConfig } from "next";

const corsProxyTarget =
process.env.NEXT_PUBLIC_CORS_PROXY_TARGET || "https://abcliteuat.airtel.com.ng";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/cors-proxy/:path*",
        destination: `${corsProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
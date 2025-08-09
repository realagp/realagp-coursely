import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "realagp-coursely.fly.storage.tigris.dev",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 95],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uxiolrcthltgsyzybuxd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;

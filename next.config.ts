import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'saytamil.com' }],
        destination: 'https://www.saytamil.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mangadex.org',
      },
    ],
    minimumCacheTTL: 86400,
    formats: ['image/avif', 'image/webp'],
    qualities: [100, 80, 10],
  },
  rewrites: async () => {
    return [
      {
        source: '/mangadex/secure/:origin/:path*',
        destination: 'https://:origin/:path*',
      },
      {
        source: '/mangadex/insecure/:origin/:path*',
        destination: 'http://:origin/:path*',
      },
    ];
  },
  compress: false,
};

export default config;

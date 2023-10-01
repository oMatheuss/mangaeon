/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  images: {
    domains: ['uploads.mangadex.org'],
    minimumCacheTTL: 86400,
    formats: ['image/avif', 'image/webp'],
  },
  rewrites: async () => {
    /**
     * Attention!!!
     * In prod, remove this if block or set a reverse proxy like nginx
     */
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
};

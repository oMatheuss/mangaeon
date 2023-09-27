/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  images: {
    domains: ['uploads.mangadex.org'],
    minimumCacheTTL: 86400,
    formats: ['image/avif', 'image/webp'],
  },
  rewrites: async () => [
    {
      source: '/mangadex/secure/:origin/:path*',
      destination: 'https://:origin/:path*',
    },
    {
      source: '/mangadex/insecure/:origin/:path*',
      destination: 'http://:origin/:path*',
    },
  ],
};

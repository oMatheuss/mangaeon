/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  images: {
    domains: ['uploads.mangadex.org'],
    minimumCacheTTL: 86400,
    formats: ['image/avif', 'image/webp'],
  },
};

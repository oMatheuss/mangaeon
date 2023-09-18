/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      { source: '/api/:path*', destination: 'https://api.mangadex.org/:path*' },
    ];
  },
  images: {
    domains: ['uploads.mangadex.org'],
  },
};

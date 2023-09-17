/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      { source: '/api/:path*', destination: 'https://mangalivre.net/:path*' },
    ];
  },
  images: {
    domains: ['uploads.mangadex.org'],
  },
};

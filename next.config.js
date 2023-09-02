/** @type {import('next').NextConfig} */
export default {
  rewrites: async () => {
    return [
      { source: '/api/:path*', destination: 'https://mangalivre.net/:path*' },
    ];
  },
};

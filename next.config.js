/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      { source: '/api/:path*', destination: 'https://api.mangadex.org/:path*' },
      {
        source: '/covers/:path*',
        destination: 'https://uploads.mangadex.org/covers/:path*',
      },
      {
        source: '/mangadex/:path*',
        destination: 'https://api.mangadex.org/:path*',
      },
      // {
      //   source: '/proxy',
      //   has: [{ type: 'query', key: 'url', value: '(?<url>.*)' }],
      //   destination: '/:url',
      // },
    ];
  },
  images: {
    domains: ['uploads.mangadex.org'],
  },
};

export const config = {
  matcher: [
    '/mangadex/secure/:origin/:path*',
    '/mangadex/insecure/:origin/:path*',
  ],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const matches = /\/mangadex\/(in)?secure\/([^\/]*)(.*)/.exec(pathname);

  if (!matches) return new Response(null, { status: 404 });

  let targetUrl = '';

  if (matches[1] === 'in') targetUrl += 'http://';
  else targetUrl += 'https://';

  const origin = matches[2];

  targetUrl += origin + matches[3];

  return fetch(targetUrl, {
    method: 'GET',
    headers: {
      Host: origin,
    },
    next: { revalidate: 900 },
  });
}

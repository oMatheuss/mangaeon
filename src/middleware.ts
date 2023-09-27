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

  const headers: { [k: string]: string } = {
    host: origin,
  };

  if (request.headers.get('user-agent'))
    headers['user-agent'] = request.headers.get('user-agent')!;

  if (request.headers.get('accept'))
    headers['accept'] = request.headers.get('accept')!;

  if (request.headers.get('accept-encoding'))
    headers['accept-encoding'] = request.headers.get('accept-encoding')!;

  return fetch(targetUrl, {
    method: 'GET',
    headers,
    next: { revalidate: 900 },
  });
}

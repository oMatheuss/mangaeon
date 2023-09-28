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
    Host: origin,
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'no-cache',
  };

  if (request.headers.get('user-agent'))
    headers['User-Agent'] = request.headers.get('User-Agent')!;

  if (request.headers.get('accept'))
    headers['Accept'] = request.headers.get('Accept')!;

  if (request.headers.get('accept-encoding'))
    headers['Accept-Encoding'] = request.headers.get('Accept-Encoding')!;

  return fetch(targetUrl, {
    method: 'GET',
    headers,
    next: { revalidate: 900 },
  });
}

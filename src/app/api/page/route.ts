import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const url = search.get('url') ?? '';
  return fetch(url, {
    signal: request.signal,
  });
}

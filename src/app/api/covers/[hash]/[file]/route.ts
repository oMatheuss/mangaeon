import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string; file: string } }
) {
  const target = `/covers/${params.hash}/${params.file}`;
  const url = new URL(target, 'https://uploads.mangadex.org');
  return fetch(url, {
    signal: request.signal,
    next: { revalidate: 3600 },
  });
}

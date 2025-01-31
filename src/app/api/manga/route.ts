import { findOne } from '@/lib/data/manga';
import { isUUID } from '@/lib/utils';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mangaId = searchParams.get('mangaId');

  if (!mangaId || !isUUID(mangaId)) {
    return new Response('"mangaId" parameter is not a valid uuid', {
      status: 400,
    });
  }

  const manga = await findOne(mangaId);

  if (manga) {
    return Response.json(manga, { status: 200 });
  }

  return new Response(null, { status: 404 });
}

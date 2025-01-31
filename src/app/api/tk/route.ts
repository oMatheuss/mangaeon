import { mangadex } from '@/lib/api/mangadex/api';
import { findOne, save, setTakenDown } from '@/lib/data/manga';
import { isUUID } from '@/lib/utils';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  if (!process.env['API_SECRET']) return new Response(null, { status: 404 });

  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (token !== process.env['API_SECRET'])
    return new Response(null, { status: 403 });

  const mangaId = searchParams.get('mangaId');

  if (!mangaId || !isUUID(mangaId)) {
    return new Response('"mangaId" parameter is not a valid uuid', {
      status: 400,
    });
  }

  const manga = await findOne(mangaId);

  if (!manga) {
    const _manga = await mangadex.manga(mangaId);
    await save({
      id: _manga.id,
      title: _manga.title,
      cover_url: _manga.cover,
      tk: 1,
    });
  } else if (manga.tk === 0) {
    await setTakenDown(manga.id, true);
    manga.tk = 1;
  }

  return Response.json(manga, { status: 200 });
}

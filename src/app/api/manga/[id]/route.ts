import type { Manga, MangaResponse } from '@/lib/api/mangadex/manga';
import type { Manga as ExtractedManga } from '@/types/manga';
import { NextResponse, NextRequest } from 'next/server';

const extractManga = (data: Manga) => {
  const langs = 'pt-br,pt,en'.split(',');
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  let description = '';
  const descriptionLangs = Object.keys(data.attributes.description);
  for (let lang of langs) {
    if (descriptionLangs.includes('pt-br')) {
      description = data.attributes.description[lang];
    }
  }

  const artist =
    data.relationships.filter((x) => x.type === 'artist')[0]?.attributes
      ?.name ?? '';
  const author =
    data.relationships.filter((x) => x.type === 'author')[0]?.attributes
      ?.name ?? '';

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `/api/covers/${id}/${coverImage}.512.jpg`;

  const tags = data.attributes.tags
    .filter((x) => x.type === 'tag')
    .map((x) => x.attributes.name.en)
    .filter(Boolean);

  return <ExtractedManga>{
    id,
    title,
    cover,
    tags,
    description,
    artist,
    author,
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id)
    return NextResponse.json(
      { error: 'missing parameter id' },
      { status: 400 }
    );

  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
    signal: request.signal,
    next: { revalidate: 3600 },
  };

  const url = new URL('/manga', 'https://api.mangadex.org');
  const searchParams = url.searchParams;

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('includes[]', 'artist');
  searchParams.append('includes[]', 'author');
  searchParams.append('ids[]', params.id);
  searchParams.append('limit', '1');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  const manga = extractManga(json.data[0]);

  return NextResponse.json(manga, { status: 200 });
}

import type { Manga, MangaResponse } from '@/lib/api/mangadex/manga';
import type { Release } from '@/types/releases';
import { NextResponse, NextRequest } from 'next/server';

export const runtime = 'edge';

const extractReleases = (data: Manga) => {
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `/api/covers/${id}/${coverImage}.256.jpg`;

  const date = new Date(data.attributes.updatedAt);

  const tags = data.attributes.tags
    .filter((x) => x.type === 'tag')
    .map((x) => x.attributes.name.en)
    .filter(Boolean);

  return <Release>{
    id,
    title,
    cover,
    date,
    tags,
  };
};

export async function GET(request: NextRequest) {
  const reqSearchParams = request.nextUrl.searchParams;
  const strPage = reqSearchParams.get('page');

  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
    signal: request.signal,
    next: { revalidate: 3600 },
  };

  const url = new URL('/manga', 'https://api.mangadex.org');
  const searchParams = url.searchParams;

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('order[updatedAt]', 'desc');
  searchParams.append('contentRating[]', 'safe');
  searchParams.append('contentRating[]', 'suggestive');
  searchParams.append('availableTranslatedLanguage[]', 'pt-br');
  searchParams.append('availableTranslatedLanguage[]', 'pt');
  searchParams.append('hasAvailableChapters', 'true');
  searchParams.append('limit', '30');
  if (strPage && isFinite(parseInt(strPage))) {
    const page = parseInt(strPage);
    searchParams.append('offset', (30 * (page - 1)).toString());
  }

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  const result = json.data.map(extractReleases);

  return NextResponse.json(result, { status: 200 });
}

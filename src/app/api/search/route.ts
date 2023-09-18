import type { Manga, MangaResponse } from '@/lib/api/mangadex/manga';
import type { Search } from '@/types/search';
import { NextResponse, NextRequest } from 'next/server';

const extractSearch = (data: Manga) => {
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `/api/covers/${id}/${coverImage}.256.jpg`;

  const artist =
    data.relationships.filter((x) => x.type === 'artist')[0]?.attributes
      ?.name ?? '';
  const author =
    data.relationships.filter((x) => x.type === 'author')[0]?.attributes
      ?.name ?? '';

  const date = new Date(data.attributes.updatedAt);

  const tags = data.attributes.tags
    .filter((x) => x.type === 'tag')
    .map((x) => x.attributes.name.en)
    .filter(Boolean);

  return <Search>{
    id,
    title,
    cover,
    date,
    tags,
    artist,
    author,
  };
};

export async function GET(request: NextRequest) {
  const reqSearchParams = request.nextUrl.searchParams;
  const query = reqSearchParams.get('q');

  if (!query) return NextResponse.json([], { status: 200 });

  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
    signal: request.signal,
  };

  const url = new URL('/manga', 'https://api.mangadex.org');
  const searchParams = url.searchParams;

  searchParams.append('title', query);

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('includes[]', 'author');
  searchParams.append('includes[]', 'artist');
  searchParams.append('order[rating]', 'desc');

  searchParams.append('contentRating[]', 'safe');
  searchParams.append('contentRating[]', 'suggestive');
  searchParams.append('contentRating[]', 'erotica');
  searchParams.append('contentRating[]', 'pornographic');

  searchParams.append('limit', '15');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  const result = json.data.map(extractSearch);

  return NextResponse.json(result, { status: 200 });
}

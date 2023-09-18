import type { ChapterResponse } from '@/lib/api/mangadex/chapter';
import type { Chapter } from '@/types/manga';
import { NextResponse, NextRequest } from 'next/server';

export const runtime = 'edge';

const extractChapters = (data: ChapterResponse['volumes']) => {
  return Object.values(data)
    .map((volume) => {
      return Object.values(volume.chapters).map((chap) => {
        return <Chapter>{
          chapterId: chap.id,
          number: chap.chapter,
          volume: volume.volume,
          name: '',
        };
      });
    })
    .flat();
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

  const url = new URL(
    `/manga/${params.id}/aggregate`,
    'https://api.mangadex.org'
  );
  const searchParams = url.searchParams;

  searchParams.append('translatedLanguage[]', 'pt-br');
  searchParams.append('translatedLanguage[]', 'pt');

  const response = await fetch(url, requestOptions);
  const json: ChapterResponse = await response.json();

  const result = extractChapters(json.volumes).reverse();

  return NextResponse.json(result, { status: 200 });
}

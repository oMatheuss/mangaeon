import { PagesResponse } from '@/lib/api/mangadex/pages';
import { Images } from '@/types/images';
import { NextResponse, NextRequest } from 'next/server';

const extractPages = (baseUrl: string, hash: string, files: string[]) => {
  return <Images>{
    baseUrl,
    hash,
    srcs: files.map((file) => {
      const param = new URLSearchParams();
      param.append('url', `${baseUrl}/data/${hash}/${file}`);
      return `/api/page?${param.toString()}`;
    }),
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
    signal: request.signal,
  };

  const url = new URL(
    `/at-home/server/${params.id}`,
    'https://api.mangadex.org'
  );
  const response = await fetch(url, requestOptions);
  const json: PagesResponse = await response.json();

  const result = extractPages(
    json.baseUrl,
    json.chapter.hash,
    json.chapter.data
  );
  return NextResponse.json(result, { status: 200 });
}

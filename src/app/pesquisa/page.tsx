'use client';

import { Image } from '@/components/image';
import { SearchBar } from '@/components/search-bar';
import { StarButton } from '@/components/star-button';
import { toErrorReponse } from '@/lib/client/utils';
import { SearchResponse } from '@/types/search';
import { useQuery } from '@tanstack/react-query';
import { ImageOff, Loader2, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const fetchSearch = async (search: string): Promise<SearchResponse> => {
  const res = await fetch('/api/lib/search/series.json', {
    method: 'POST',
    body: new URLSearchParams({ search }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  if (!res.ok) throw toErrorReponse(res);
  return await res.json();
};

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const searchQuery = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSearch(query!),
    retry: false,
    enabled: searchParams.has('q') && query!.length > 0,
  });

  const series = searchQuery.data?.series || [];

  return (
    <>
      <SearchBar defaultValue={query || undefined} />
      <div className='flex flex-col space-y-2 my-2'>
        {searchQuery.isSuccess && series.length === 0 && (
          <div className='flex flex-col items-center self-center'>
            <SearchX className='h-12 w-12 text-red-600' />
            <div>Nenhum resultado para a pesquisa...</div>
          </div>
        )}
        {searchQuery.isLoading && searchQuery.isFetching && (
          <div className='flex flex-col items-center self-center'>
            <Loader2 className='animate-spin h-12 w-12' />
            <div>Carregando...</div>
          </div>
        )}
        {series.map((val) => (
          <div
            key={val.id_serie}
            className='relative overflow-hidden w-full h-36 md:h-48 flex flex-row bg-base-200 border border-base-content/20 rounded shadow'
          >
            <StarButton
              serie={{
                id: val.id_serie,
                image: val.cover,
                name: val.name,
              }}
            />
            <div className='min-w-fit mr-2'>
              <Image
                sources={[
                  [
                    { src: val.cover_avif, type: 'image/avif' },
                    { src: val.cover, type: 'image/jpg' },
                  ],
                  [
                    { src: val.cover_thumb_avif, type: 'image/avif' },
                    { src: val.cover_thumb, type: 'image/jpg' },
                  ],
                ]}
                alt={val.name}
                className='object-cover w-24 h-36 md:w-32 md:h-48 rounded-s'
                fallback={
                  <div className='w-24 h-36 md:w-32 md:h-48 flex justify-center items-center'>
                    <ImageOff className='h-10' />
                  </div>
                }
                loading='lazy'
              />
            </div>
            <div className='w-full p-2 overflow-auto flex flex-col justify-between leading-normal'>
              <div>
                <h2 className='font-bold text-lg line-clamp-3'>
                  <Link
                    href={`/manga/${val.id_serie}`}
                    className='hover:underline'
                  >
                    {val.name}
                  </Link>
                </h2>
                <h3 className='font-bold text-xs text-base-content/75 truncate'>
                  {val.author}; {val.artist}
                </h3>
              </div>
              <div className='inline-flex space-x-2 h-6 overflow-y-hidden flex-wrap'>
                {val.categories.map((x) => (
                  <span
                    key={x.id_category}
                    className='text-xs whitespace-nowrap p-1 rounded bg-neutral text-neutral-content max-w-fit'
                  >
                    {x.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

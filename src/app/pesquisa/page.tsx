'use client';

import { SearchBar } from '@/components/search-bar';
import { StarButton } from '@/components/star-button';
import { Search } from '@/types/search';
import { useQuery } from '@tanstack/react-query';
import { Loader2, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const searchQuery = useQuery({
    queryKey: ['search', query],
    queryFn: async () =>
      (await fetch(`/search?q=${query}`).then((d) => d.json())) as Search[],
    retry: false,
    enabled: searchParams.has('q') && query!.length > 0,
  });

  const series = searchQuery.data || [];

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
        {series.map((serie) => (
          <div
            key={serie.id}
            className='relative overflow-hidden w-full h-36 md:h-48 flex flex-row bg-base-200 border border-base-content/20 rounded shadow'
          >
            <StarButton
              serie={{
                id: serie.id,
                image: serie.cover,
                name: serie.title,
              }}
            />
            <div className='min-w-fit mr-2'>
              <img
                src={serie.cover}
                alt={`Image de capa de ${serie.title}`}
                className='object-cover w-24 h-36 md:w-32 md:h-48 rounded-s'
                loading='lazy'
              />
            </div>
            <div className='w-full p-2 overflow-auto flex flex-col justify-between leading-normal'>
              <div>
                <h2 className='font-bold text-lg line-clamp-3'>
                  <Link href={`/manga/${serie.id}`} className='hover:underline'>
                    {serie.title}
                  </Link>
                </h2>
                <h3 className='font-bold text-xs text-base-content/75 truncate'>
                  {serie.author}; {serie.artist}
                </h3>
              </div>
              <div className='inline-flex space-x-2 h-6 overflow-y-hidden flex-wrap'>
                {serie.tags.map((tag) => (
                  <span
                    key={tag}
                    className='text-xs whitespace-nowrap p-1 rounded bg-neutral text-neutral-content max-w-fit'
                  >
                    {tag}
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

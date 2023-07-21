import { SearchBar } from '@/components/search-bar';
import { toErrorReponse } from '@/lib/utils';
import { SearchResponse } from '@/types/search';
import { useQuery } from '@tanstack/react-query';
import { Loader2, SearchX } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

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

export const Search = () => {
  const [searchParams] = useSearchParams();
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
      <SearchBar replace defaultValue={query || undefined} />
      <div className='flex flex-col space-y-2 mt-4 mb-2'>
        {searchQuery.isSuccess && series.length === 0 && (
          <div className='flex flex-col items-center self-center'>
            <SearchX className='h-12 w-12 text-red-600' />
            <div>Nenhum resultado para a pesquisa...</div>
          </div>
        )}
        {searchQuery.isLoading && (
          <div className='flex flex-col items-center self-center'>
            <Loader2 className='animate-spin h-12 w-12' />
            <div>Carregando...</div>
          </div>
        )}
        {series.map((val) => (
          <div
            key={val.id_serie}
            className='relative overflow-hidden w-full h-24 sm:h-36 md:h-48 flex flex-row bg-slate-100 dark:bg-slate-900 rounded'
          >
            <Link
              to={val.link}
              className='min-w-fit mr-2 focus:outline outline-indigo-600 outline-1 -outline-offset-1'
            >
              <picture>
                <source srcSet={val.cover_avif} type='image/avif' />
                <img
                  src={val.cover}
                  alt={val.name}
                  className='object-contain h-24 sm:h-36 md:h-48 rounded-s'
                />
              </picture>
            </Link>
            <div className='p-2 overflow-auto flex flex-col justify-between leading-normal'>
              <div>
                <h2 className='font-bold text-lg truncate'>
                  <Link to={val.link} className='hover:underline'>
                    {val.name}
                  </Link>
                </h2>
                <h3 className='font-bold text-xs text-gray-600 truncate'>
                  {val.author}; {val.artist}
                </h3>
              </div>
              <div className='relative flex gap-3 scroll-smooth overflow-x-scroll text-xs'>
                {val.categories.map((cat) => (
                  <div className='shrink-0 bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700'>
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

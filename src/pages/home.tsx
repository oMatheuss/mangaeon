import { FeaturedScroll } from '@/components/featured-scroll';
import { Releases } from '@/components/releases';
import { SearchBar } from '@/components/search-bar';
import { type ErrorResponse, toErrorReponse } from '@/lib/utils';
import type { FeaturedResponse } from '@/types/featured';
import { useQuery } from '@tanstack/react-query';

const fetchFeatured = async (): Promise<FeaturedResponse> => {
  const res = await fetch('/api/home/getFeaturedSeries.json');
  if (!res.ok) throw toErrorReponse(res);
  return await res.json();
};

const ONE_HOUR = 1000 * 60 * 60;
const THIRTY_MIN = 1000 * 60 * 30;

export const Home = () => {
  const featuredQuery = useQuery<FeaturedResponse, ErrorResponse>({
    queryKey: ['featured'],
    queryFn: fetchFeatured,
    cacheTime: ONE_HOUR,
    staleTime: THIRTY_MIN,
  });

  const featured = featuredQuery.data?.featured ?? [];

  return (
    <div className='flex flex-col my-3'>
      <FeaturedScroll featured={featured} />
      <SearchBar />
      <h1 className='font-bold text-2xl my-4'>Lançamentos</h1>
      <Releases />
    </div>
  );
};

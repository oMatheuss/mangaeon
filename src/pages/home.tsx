import { FeaturedScroll } from '@/components/featured-scroll';
import { Releases } from '@/components/releases';
import { SearchBar } from '@/components/search-bar';
import { type ErrorResponse, toErrorReponse } from '@/lib/utils';
import type { FeaturedResponse } from '@/types/featured';
import type { ReleasesReponse } from '@/types/releases';
import { useQuery } from '@tanstack/react-query';

const fetchFeatured = async (): Promise<FeaturedResponse> => {
  const res = await fetch('/api/home/getFeaturedSeries.json');
  if (!res.ok) throw toErrorReponse(res);
  return await res.json();
};

const fetchReleases = async (): Promise<ReleasesReponse> => {
  const res = await fetch('/api/home/releases');
  if (!res.ok) throw toErrorReponse(res);
  return await res.json();
};

const ONE_DAY = 1000 * 60 * 60 * 24;

export const Home = () => {
  const featuredQuery = useQuery<FeaturedResponse, ErrorResponse>({
    queryKey: ['featured'],
    queryFn: fetchFeatured,
    cacheTime: ONE_DAY, // 1 dia
    enabled: true,
  });

  const releasesQuery = useQuery<ReleasesReponse, ErrorResponse>({
    queryKey: ['releases'],
    queryFn: fetchReleases,
    cacheTime: ONE_DAY, // 1 dia
    enabled: true,
  });

  const featured = featuredQuery.data?.featured ?? [];
  const releases = releasesQuery.data?.releases ?? [];

  return (
    <div className='flex flex-col'>
      <FeaturedScroll featured={featured} />
      <SearchBar />
      <h1 className='text-2xl mt-8 mb-4'>Lançamentos</h1>
      <Releases releases={releases} />
    </div>
  );
};

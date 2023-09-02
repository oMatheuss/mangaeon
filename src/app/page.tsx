import { FeaturedScroll } from '@/components/featured-scroll';
import { MostReadScroll } from '@/components/most-read-scroll';
import { Releases } from '@/components/releases';
import { SearchBar } from '@/components/search-bar';
import { toErrorReponse } from '@/lib/utils';

import type { FeaturedResponse } from '@/types/featured';
import { MostReadResponse } from '@/types/most-read';

const ONE_DAY = 86400;

const fetchFeatured = async (): Promise<FeaturedResponse> => {
  const res = await fetch(
    'https://mangalivre.net/home/getFeaturedSeries.json',
    {
      next: { revalidate: ONE_DAY },
    }
  );
  if (!res.ok) throw toErrorReponse(res);
  return (await res.json()) as FeaturedResponse;
};

const fetchMostRead = async (page: number) => {
  const res = await fetch(
    `https://mangalivre.net/home/most_read?page=${page}`,
    {
      next: { revalidate: ONE_DAY },
    }
  );
  if (!res.ok) throw toErrorReponse(res);
  return (await res.json()) as MostReadResponse;
};

export default async function Home() {
  const featRes = await fetchFeatured();
  const mostReadRes = await fetchMostRead(1);

  return (
    <div className='flex flex-col my-3'>
      <SearchBar />
      <FeaturedScroll featured={featRes.featured} />
      <MostReadScroll initialMostRead={mostReadRes.most_read || []} />
      <Releases />
    </div>
  );
}

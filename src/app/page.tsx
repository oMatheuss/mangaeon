import { FeaturedScroll } from '@/components/featured-scroll';
import { MostReadScroll } from '@/components/most-read-scroll';
import { Releases } from '@/components/releases';
import { SearchBar } from '@/components/search-bar';
import { toErrorReponse } from '@/lib/utils';

import type { FeaturedResponse } from '@/types/featured';

const fetchFeatured = async (): Promise<FeaturedResponse> => {
  const res = await fetch('https://mangalivre.net/home/getFeaturedSeries.json');
  if (!res.ok) throw toErrorReponse(res);
  return await res.json();
};

export default async function Home() {
  const featRes = await fetchFeatured();
  return (
    <div className='flex flex-col my-3'>
      <SearchBar />
      <FeaturedScroll featured={featRes.featured} />
      <MostReadScroll />
      <Releases />
    </div>
  );
}

import { FeaturedCard } from '@/components/featured-card';
import { FeaturedScroll } from '@/components/featured-scroll';
import { MostReadScroll } from '@/components/most-read-scroll';
import { Releases } from '@/components/releases';
import { SearchBar } from '@/components/search-bar';
import { mangadex } from '@/lib/api/mangadex/api';

export const revalidate = 21600;

export default async function Home() {
  const highLights = await mangadex.highlights!();
  const mostRead = await mangadex.mostRead!();

  return (
    <div className='flex flex-col my-3'>
      <SearchBar />
      <FeaturedScroll>
        {highLights.map((hl) => (
          <FeaturedCard key={hl.id} item={hl} />
        ))}
      </FeaturedScroll>
      <MostReadScroll items={mostRead} />
      <Releases />
    </div>
  );
}

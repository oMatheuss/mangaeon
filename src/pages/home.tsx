import { FeaturedScroll } from '@/components/featured-scroll';
import { MostReadScroll } from '@/components/most-read-scroll';
import { Releases } from '@/components/releases';
import { SearchBar } from '@/components/search-bar';

export const Home = () => {
  return (
    <div className='flex flex-col my-3'>
      <SearchBar />
      <FeaturedScroll />
      <MostReadScroll />
      <Releases />
    </div>
  );
};

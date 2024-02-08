import { mangadex } from '@/lib/api/mangadex/api';
import { FeaturedCard } from './featured-card';

export async function FeaturedScroll() {
  const highLights = await mangadex.highlights();

  return (
    <ul className='w-full h-64 flex snap-x snap-mandatory overflow-x-auto bg-inherit border border-base-content/20 rounded-lg shadow-lg'>
      {highLights.map((item, idx) => (
        <FeaturedCard
          key={item.id}
          item={item}
          loading={idx === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </ul>
  );
}

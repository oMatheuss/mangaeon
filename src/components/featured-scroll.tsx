import { mangadex } from '@/lib/api/mangadex/api';
import { FeaturedCard } from './featured-card';

export async function FeaturedScroll() {
  const highLights = await mangadex.highlights();

  return (
    <ul className='flex h-64 w-full snap-x snap-mandatory overflow-x-auto rounded-lg border border-base-content/20 bg-inherit shadow-lg'>
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

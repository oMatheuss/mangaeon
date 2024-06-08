import { SearchBar } from '@/components/search-bar';
import { StarButton } from '@/components/star-button';
import { mangadex } from '@/lib/api/mangadex/api';
import Image from 'next/image';
import Link from 'next/link';

export default async function Search({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q;
  const series = await mangadex.search(query);

  return (
    <>
      <SearchBar defaultValue={query || undefined} />
      <div className='my-2 flex flex-col space-y-2'>
        {series.map((serie) => (
          <div
            key={serie.id}
            className='relative flex h-36 w-full flex-row overflow-hidden rounded border border-base-content/20 bg-base-200 shadow md:h-48'
          >
            <StarButton
              serie={{
                id: serie.id,
                image: serie.cover,
                name: serie.title,
              }}
            />
            <div className='mr-2 min-w-fit'>
              <Image
                src={serie.cover}
                alt={`Image de capa de ${serie.title}`}
                className='h-36 w-24 rounded-s object-cover md:h-48 md:w-32'
                width={192}
                height={256}
              />
            </div>
            <div className='flex w-full flex-col justify-between overflow-auto p-2 leading-normal'>
              <div>
                <h2 className='line-clamp-3 text-lg font-bold'>
                  <Link href={`/manga/${serie.id}`} className='hover:underline'>
                    {serie.title}
                  </Link>
                </h2>
                <h3 className='truncate text-xs font-bold text-base-content/75'>
                  {serie.author}; {serie.artist}
                </h3>
              </div>
              <div className='inline-flex h-6 flex-wrap space-x-2 overflow-y-hidden'>
                {serie.tags.map((tag) => (
                  <span
                    key={tag}
                    className='max-w-fit whitespace-nowrap rounded bg-neutral p-1 text-xs text-neutral-content'
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

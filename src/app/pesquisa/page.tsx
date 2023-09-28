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
      <div className='flex flex-col space-y-2 my-2'>
        {series.map((serie) => (
          <div
            key={serie.id}
            className='relative overflow-hidden w-full h-36 md:h-48 flex flex-row bg-base-200 border border-base-content/20 rounded shadow'
          >
            <StarButton
              serie={{
                id: serie.id,
                image: serie.cover,
                name: serie.title,
              }}
            />
            <div className='min-w-fit mr-2'>
              <Image
                src={serie.cover}
                alt={`Image de capa de ${serie.title}`}
                className='object-cover w-24 h-36 md:w-32 md:h-48 rounded-s'
                width={192}
                height={256}
              />
            </div>
            <div className='w-full p-2 overflow-auto flex flex-col justify-between leading-normal'>
              <div>
                <h2 className='font-bold text-lg line-clamp-3'>
                  <Link href={`/manga/${serie.id}`} className='hover:underline'>
                    {serie.title}
                  </Link>
                </h2>
                <h3 className='font-bold text-xs text-base-content/75 truncate'>
                  {serie.author}; {serie.artist}
                </h3>
              </div>
              <div className='inline-flex space-x-2 h-6 overflow-y-hidden flex-wrap'>
                {serie.tags.map((tag) => (
                  <span
                    key={tag}
                    className='text-xs whitespace-nowrap p-1 rounded bg-neutral text-neutral-content max-w-fit'
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

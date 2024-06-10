import { BookmarkButton } from '@/components/bookmark-button';
import { SearchBar } from '@/components/search-bar';
import { mangadex } from '@/lib/api/mangadex/api';
import Image from 'next/image';
import Link from 'next/link';

export default async function Search({
  searchParams,
}: {
  searchParams: { q: string; contentRating?: string };
}) {
  const query = searchParams.q;
  const contentRating = searchParams.contentRating
    ? parseInt(searchParams.contentRating)
    : 2;
  const series = await mangadex.search(query, contentRating);

  return (
    <section>
      <SearchBar defaultValue={query || undefined} />
      <ul className='my-4 flex flex-col space-y-4'>
        {series.map((serie) => (
          <li
            key={serie.id}
            className='relative flex h-36 w-full flex-row overflow-hidden rounded-box border border-base-content/20 bg-base-200 shadow-md md:h-48'
          >
            <BookmarkButton
              manga={{
                mangaId: serie.id,
                artist: serie.artist,
                author: serie.author,
                includedAt: new Date(),
                tags: serie.tags,
                title: serie.title,
                coverUri: serie.cover,
              }}
            />
            <div className='mr-2 min-w-fit'>
              <Image
                src={serie.cover}
                alt={`Image de capa de ${serie.title}`}
                className='h-36 w-24 rounded-r-box object-cover md:h-48 md:w-32'
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
                    className='max-w-fit whitespace-nowrap rounded-badge bg-neutral px-2 py-1 text-xs text-neutral-content'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

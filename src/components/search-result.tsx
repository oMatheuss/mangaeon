import type { Manga } from '@/types/manga';
import { BookmarkButton } from '@/components/bookmark-button';
import { fromMangaToSaved } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResultProps {
  series: Manga[];
}

export function SearchResult(props: SearchResultProps) {
  const { series } = props;
  return (
    <ul className='my-4 flex flex-col space-y-4'>
      {series.map((serie) => (
        <SearchResultItem key={serie.id} serie={serie} />
      ))}
    </ul>
  );
}

SearchResult.displayName = 'SearchResult';

interface SearchResultItemProps {
  serie: Manga;
}

function SearchResultItem(props: SearchResultItemProps) {
  const { serie } = props;
  return (
    <li className='rounded-box border-base-content/20 bg-base-200 relative flex h-48 w-full flex-row overflow-hidden border shadow-md'>
      <BookmarkButton manga={fromMangaToSaved(serie)} />
      <div className='mr-2 min-w-fit'>
        <Image
          src={serie.cover}
          alt={`Image de capa de ${serie.title}`}
          className='rounded-r-box h-48 w-32 object-cover'
          width={192}
          height={256}
        />
      </div>
      <div className='flex w-full flex-col overflow-auto p-2 leading-normal'>
        <div className='mb-auto'>
          <h2 className='line-clamp-3 text-lg font-bold'>
            <Link href={`/manga/${serie.id}`} className='hover:underline'>
              {serie.title}
            </Link>
          </h2>
          <h3 className='text-base-content/75 truncate text-xs font-bold'>
            {serie.author}; {serie.artist}
          </h3>
        </div>

        <p className='mb-2 text-sm'>{serie.updatedAt.toLocaleString()}</p>
        <div className='inline-flex h-6 flex-wrap space-x-2 overflow-y-hidden'>
          {serie.tags.map((tag) => (
            <span
              key={tag}
              className='rounded-selector bg-neutral text-neutral-content max-w-fit px-2 py-1 text-xs whitespace-nowrap'
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}

import type { Manga } from '@/types/manga';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/section-title';
import Image from 'next/image';
import { BookmarkButton } from './bookmark-button';
import { fromMangaToSaved } from '@/lib/utils';

interface ReleasesProps {
  releases: Manga[];
}

export function ReleaseList({ releases }: ReleasesProps) {
  return (
    <section>
      <SectionTitle text='Releases' />
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {releases?.map((manga) => (
          <ReleaseCard key={manga.id} release={manga} />
        ))}
      </ul>
    </section>
  );
}

interface ReleaseCardProps {
  release: Manga;
}

function ReleaseCard({ release }: ReleaseCardProps) {
  const linkSerie = `/manga/${release.id}`;

  return (
    <li className='rounded-box border-base-content/20 bg-base-200 relative flex h-48 overflow-hidden border shadow-lg'>
      <BookmarkButton manga={fromMangaToSaved(release)} />
      <div className='bg-base-200 flex w-auto min-w-fit justify-center'>
        <Image
          src={release.cover}
          alt={release.title}
          className='rounded-r-box h-48 w-32 object-cover'
          height={192}
          width={128}
          quality={100}
        />
      </div>
      <section className='flex flex-col overflow-hidden p-4'>
        <h3 className='line-clamp-3 text-lg font-bold tracking-tight sm:text-xl'>
          <Link
            href={linkSerie}
            title={release.title}
            className='hover:text-primary'
          >
            {release.title}
          </Link>
        </h3>
        <p className='text-base-content/75 my-1 mt-auto truncate text-sm font-bold'>
          {release.updatedAt.toLocaleString('pt-BR')}
        </p>
        <ul
          aria-label='Tags'
          className='inline-flex h-6 flex-wrap space-x-2 overflow-y-hidden'
        >
          {release.tags.map((tag) => (
            <li
              key={tag}
              className='rounded-selector bg-neutral text-neutral-content max-w-fit px-2 py-1 text-xs whitespace-nowrap'
            >
              {tag}
            </li>
          ))}
        </ul>
        {/* <nav className='mt-auto inline-flex flex-wrap h-9 overflow-hidden text-sm font-semibold text-gray-700'>
          {release.chapters.map((chap) => (
            <Link
              key={chap.number}
              className='mt-2 mr-2 px-2 py-1 text-neutral-content bg-neutral rounded-tr-md rounded-b-md hover:bg-neutral-focus'
              href={`/ler/${chap.url.split('/')[4]}`}
            >
              {chap.number}
            </Link>
          ))}
        </nav> */}
      </section>
    </li>
  );
}

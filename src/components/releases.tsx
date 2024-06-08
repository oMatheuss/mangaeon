import type { Release } from '@/types/releases';
import Link from 'next/link';
import { StarButton } from '@/components/star-button';
import { SectionTitle } from '@/components/section-title';
import Image from 'next/image';

interface ReleasesProps {
  releases: Release[];
}

export const Releases = ({ releases }: ReleasesProps) => {
  return (
    <>
      <SectionTitle text='Lançamentos' />
      <ul className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {releases?.map((val, idx) => (
          <ReleaseCard key={`${val.id}-${idx}`} release={val} />
        ))}
      </ul>
    </>
  );
};

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard = ({ release }: ReleaseCardProps) => {
  const linkSerie = `/manga/${release.id}`;

  return (
    <li className='relative flex h-48 overflow-hidden rounded-lg border border-base-content/20 bg-base-200 shadow-lg'>
      <StarButton
        serie={{
          id: release.id,
          image: release.cover,
          name: release.title,
        }}
      />
      <div className='flex w-auto min-w-fit justify-center bg-base-200'>
        <Image
          src={release.cover}
          alt={release.title}
          className='h-48 w-32 rounded-r-lg object-cover'
          height={192}
          width={128}
          quality={100}
        />
      </div>
      <section className='flex flex-col overflow-hidden p-4'>
        <h3 className='line-clamp-3 max-h-24 max-w-fit text-lg font-bold tracking-tight sm:text-xl'>
          <Link
            href={linkSerie}
            title={release.title}
            className='hover:text-primary'
          >
            {release.title}
          </Link>
        </h3>
        <p className='my-1 mt-auto truncate text-sm font-bold text-base-content/75'>
          {release.date.toLocaleString('pt-BR')}
        </p>
        <ul
          aria-label='Tags'
          className='inline-flex h-6 flex-wrap space-x-2 overflow-y-hidden'
        >
          {release.tags.map((tag) => (
            <li
              key={tag}
              className='max-w-fit whitespace-nowrap rounded bg-neutral p-1 text-xs text-neutral-content'
            >
              {tag}
            </li>
          ))}
        </ul>
        {/* <nav className='mt-auto inline-flex flex-wrap h-[2.25rem] overflow-hidden text-sm font-semibold text-gray-700'>
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
};

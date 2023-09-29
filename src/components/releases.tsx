import type { Release } from '@/types/releases';
import Link from 'next/link';
import { StarButton } from '@/components/star-button';
import Image from 'next/image';
interface ReleasesProps {
  releases: Release[];
}

export const Releases = ({ releases }: ReleasesProps) => {
  return (
    <>
      <div className='flex justify-between items-end pb-1 mt-4 mb-4 border-b border-base-content/10'>
        <h2 className='font-bold text-xl sm:text-2xl'>Lançamentos</h2>
      </div>
      <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
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
    <li className='relative sm:flex sm:h-48 overflow-hidden bg-base-200 border border-base-content/20 rounded-lg shadow-lg'>
      <StarButton
        serie={{
          id: release.id,
          image: release.cover,
          name: release.title,
        }}
      />
      <div className='min-w-fit bg-base-200'>
        <Image
          src={release.cover}
          alt={release.title}
          className='w-full sm:w-32 h-48 object-contain sm:object-cover'
          height={256}
          width={192}
        />
      </div>
      <section className='flex flex-col justify-between overflow-hidden p-4'>
        <h3 className='font-bold text-xl sm:max-h-24 max-w-fit line-clamp-3 tracking-tight'>
          <Link
            href={linkSerie}
            title={release.title}
            className='hover:underline'
          >
            {release.title}
          </Link>
        </h3>
        <h4 className='font-bold text-base-content/75 text-sm truncate my-1'>
          {release.date.toLocaleString('pt-BR')}
        </h4>
        <ul
          aria-label='Tags'
          className='inline-flex space-x-2 h-6 overflow-y-hidden flex-wrap'
        >
          {release.tags.map((tag) => (
            <li
              key={tag}
              className='text-xs whitespace-nowrap p-1 rounded bg-neutral text-neutral-content max-w-fit'
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

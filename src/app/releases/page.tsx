import type { Metadata } from 'next';
import { ReleaseList } from '@/components/releases-list';
import { mangadex } from '@/lib/api/mangadex/api';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 21600;

interface ReleasesProps {
  searchParams: Promise<{ page: string }>;
}

export async function generateMetadata(
  props: ReleasesProps
): Promise<Metadata> {
  const params = await props.searchParams;
  return {
    title: `Releases: ${params.page}`,
  };
}

export default async function Releases(props: ReleasesProps) {
  const params = await props.searchParams;
  let page = parseInt(params.page);
  if (!page) page = 1;
  if (!isFinite(page) || page <= 0) return notFound();

  const releases = await mangadex.releases(page);

  return (
    <>
      <ReleaseList releases={releases} />
      <section className='mt-3 flex justify-between'>
        <Link
          href={{ query: { page: page - 1 } }}
          data-visible={page > 1}
          className='group flex h-10 w-10 items-center justify-center rounded-btn hover:bg-base-content/10 data-[visible=false]:hidden'
        >
          <ArrowLeftCircle
            aria-label='Página anterior'
            className='group-hover:stroke-primary-focus h-6 w-6'
          />
        </Link>
        <Link
          href={{ query: { page: page + 1 } }}
          className='group flex h-10 w-10 items-center justify-center rounded-btn hover:bg-base-content/10'
        >
          <ArrowRightCircle
            aria-label='Proxima página'
            className='group-hover:stroke-primary-focus h-6 w-6'
          />
        </Link>
      </section>
    </>
  );
}

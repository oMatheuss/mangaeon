import type { Metadata } from 'next';
import { Releases } from '@/components/releases';
import { mangadex } from '@/lib/api/mangadex/api';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 21600;

interface LancamentosProps {
  params: { page: string };
}

export function generateMetadata({ params }: LancamentosProps): Metadata {
  return {
    title: `Lançamentos: ${params.page}`,
  };
}

export default async function Lancamentos({ params }: LancamentosProps) {
  const page = parseInt(params.page);
  if (!page || !isFinite(page) || page <= 0) return notFound();

  const releases = await mangadex.releases(page);

  return (
    <>
      <Releases releases={releases} />
      <section className='flex mt-3 justify-between'>
        <Link
          href={`${page - 1}`}
          data-visible={page > 1}
          className='data-[visible=false]:hidden group w-10 h-10 flex items-center justify-center rounded hover:bg-base-content/10'
        >
          <ArrowLeftCircle
            aria-label='Página anterior'
            className='w-6 h-6 group-hover:stroke-primary-focus'
          />
        </Link>
        <Link
          href={`${page + 1}`}
          className='group w-10 h-10 flex items-center justify-center rounded hover:bg-base-content/10'
        >
          <ArrowRightCircle
            aria-label='Proxima página'
            className='w-6 h-6 group-hover:stroke-primary-focus'
          />
        </Link>
      </section>
    </>
  );
}

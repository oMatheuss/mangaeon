import type { Metadata } from 'next';
import { mangadex } from '@/lib/api/mangadex/api';
import { notFound, redirect } from 'next/navigation';
import { isUUID } from '@/lib/utils';
import { MangaHeader } from '@/components/manga-header';
import { isTakenDown } from '@/lib/data/manga';

interface MangaProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const revalidate = 86400;

export async function generateMetadata(props: MangaProps): Promise<Metadata> {
  const params = await props.params;
  if (!isUUID(params.id)) return {};

  const manga = await mangadex.manga(params.id);
  return {
    metadataBase: new URL('https://mangaeon.com'),
    title: manga.title,
    openGraph: {
      title: manga.title,
      description: manga.description,
      type: 'book',
      authors: [manga.author, manga.artist],
      tags: manga.tags,
      images: [
        {
          url: manga.cover,
        },
      ],
    },
  };
}

export default async function Manga(props: MangaProps) {
  const params = await props.params;
  if (!isUUID(params.id)) notFound();

  const tk = await isTakenDown(params.id);
  if (tk) redirect('/dmca');

  const manga = await mangadex.manga(params.id);

  return <MangaHeader manga={manga} />;
}

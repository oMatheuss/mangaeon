import type { Metadata } from 'next';
import { ChapterList } from '@/components/chapter-list';
import { mangadex } from '@/lib/api/mangadex/api';
import Image from 'next/image';

interface MangaProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: MangaProps): Promise<Metadata> {
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

export default async function Manga({ params }: MangaProps) {
  const manga = await mangadex.manga(params.id);
  const chapters = await mangadex.chapters(params.id);

  return (
    <div className='flex flex-col'>
      <div className='relative items-center mt-6 border-separate'>
        <Image
          className='float-none sm:float-left object-cover aspect-[3/4] rounded m-auto mb-6 sm:m-3'
          src={manga.cover}
          alt={`Imagem de capa de ${manga.title}`}
          height={256}
          width={192}
        />
        <div className='mb-3'>
          <h1 className='sm:mt-3 text-5xl font-extrabold tracking-tight'>
            {manga.title}
          </h1>
          <p className='font-bold text-base-content/70 ml-3 mb-3'>
            {manga.author}, {manga.artist}
          </p>
          <p className='indent-4 md:indent-8 text-justify'>
            {manga.description}
          </p>
        </div>
      </div>
      <div className='flex flex-row flex-wrap capitalize'>
        {manga.tags.map((tag) => (
          <span
            key={tag}
            className='mr-3 mb-3 text-xs break-keep p-2 rounded bg-neutral text-neutral-content max-w-fit'
          >
            {tag}
          </span>
        ))}
      </div>
      <ChapterList chapters={chapters} />
    </div>
  );
}

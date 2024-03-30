import type { Metadata } from 'next';
import { ChapterList } from '@/components/chapter-list';
import { mangadex } from '@/lib/api/mangadex/api';
import Image from 'next/image';
import { remark } from 'remark';
import html from 'remark-html';
import { Pagination } from '@/components/pagination';
import { notFound } from 'next/navigation';

interface MangaProps {
  params: { id: string };
  searchParams: { page?: string };
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

export default async function Manga({ params, searchParams }: MangaProps) {
  const manga = await mangadex.manga(params.id);

  let page: number;
  if (searchParams.page && !/\d+/.test(searchParams.page)) page = 1;
  else page = searchParams.page ? parseInt(searchParams.page) : 1;

  if (page <= 0 || page * 96 > 10000) return notFound();

  const chaptersWithPagination = await mangadex.chapters(params.id, page);
  if (chaptersWithPagination.chapters.length === 0) return notFound();

  let descHtml = '';

  if (manga.description) {
    const descFromMd = await remark().use(html).process(manga.description);
    descHtml = descFromMd.toString('utf-8');
  }

  return (
    <div className='flex flex-col'>
      <div className='relative items-center mt-6 border-separate'>
        <Image
          className='float-none sm:float-left object-cover aspect-[3/4] rounded m-auto mb-6 sm:m-0 sm:mr-3 sm:mb-3'
          src={manga.cover}
          alt={`Imagem de capa de ${manga.title}`}
          height={256}
          width={192}
          loading='eager'
        />
        <div className='mb-3'>
          <h1 className='sm:mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight'>
            {manga.title}
          </h1>
          <p className='font-bold text-base-content/70 mb-3'>
            {manga.author}, {manga.artist}
          </p>
          <div
            className='prose prose-hr:my-3 max-w-full text-justify'
            dangerouslySetInnerHTML={{ __html: descHtml }}
          />
        </div>
      </div>
      <div className='flex flex-row flex-wrap capitalize'>
        {manga.tags.sort().map((tag) => (
          <span
            key={tag}
            className='mr-3 mb-3 text-xs break-keep p-2 rounded bg-neutral text-neutral-content max-w-fit'
          >
            {tag}
          </span>
        ))}
      </div>
      <ChapterList chapters={chaptersWithPagination.chapters} />
      <Pagination
        limit={chaptersWithPagination.limit}
        page={page}
        total={chaptersWithPagination.total}
        offset={chaptersWithPagination.offset}
      />
    </div>
  );
}

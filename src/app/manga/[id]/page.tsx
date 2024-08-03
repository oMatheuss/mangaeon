import type { Metadata } from 'next';
import { ChapterList } from '@/components/chapter-list';
import { mangadex } from '@/lib/api/mangadex/api';
import Image from 'next/image';
import { remark } from 'remark';
import html from 'remark-html';
import { Pagination } from '@/components/pagination';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/bookmark-button';
import { fromMangaToSaved } from '@/lib/client/utils';
import { isUUID } from '@/lib/uuid';

interface MangaProps {
  params: { id: string };
  searchParams: { page?: string };
}

export async function generateMetadata({
  params,
}: MangaProps): Promise<Metadata> {
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

export default async function Manga({ params, searchParams }: MangaProps) {
  if (!isUUID(params.id)) notFound();

  const manga = await mangadex.manga(params.id);

  let page: number;
  if (searchParams.page && !/\d+/.test(searchParams.page)) page = 1;
  else page = searchParams.page ? parseInt(searchParams.page) : 1;

  if (page <= 0 || page * 96 > 10000) notFound();

  const chaptersWithPagination = await mangadex.chapters(params.id, page);
  if (chaptersWithPagination.chapters.length === 0) return notFound();

  let descHtml = '';

  if (manga.description) {
    const descFromMd = await remark().use(html).process(manga.description);
    descHtml = descFromMd.toString('utf-8');
  }

  return (
    <div className='flex flex-col'>
      <div className='mt-6 border-separate text-center sm:text-left'>
        <div className='relative float-none inline-block sm:float-left sm:mb-3 sm:mr-3'>
          <BookmarkButton manga={fromMangaToSaved(manga)} />
          <Image
            className='aspect-[3/4] rounded-box border border-base-content/20 object-cover shadow-md'
            src={manga.cover}
            alt={`Imagem de capa de ${manga.title}`}
            height={256}
            width={192}
            loading='eager'
          />
        </div>
        <div className='mb-3'>
          <h1 className='text-3xl font-extrabold tracking-tight sm:text-5xl'>
            {manga.title}
          </h1>
          <p className='mb-3 font-bold text-base-content/70'>
            {manga.author}, {manga.artist}
          </p>
          <div
            className='prose max-w-full text-justify prose-hr:my-3'
            dangerouslySetInnerHTML={{ __html: descHtml }}
          />
        </div>
      </div>
      <div className='flex flex-row flex-wrap capitalize'>
        {manga.tags.sort().map((tag) => (
          <span
            key={tag}
            className='mb-3 mr-3 max-w-fit break-keep rounded-badge bg-neutral px-2 py-1 text-xs text-neutral-content'
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

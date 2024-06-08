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
      <div className='relative mt-6 border-separate items-center'>
        <Image
          className='float-none m-auto mb-6 aspect-[3/4] rounded-box border border-base-content/20 object-cover shadow-md sm:float-left sm:m-0 sm:mb-3 sm:mr-3'
          src={manga.cover}
          alt={`Imagem de capa de ${manga.title}`}
          height={256}
          width={192}
          loading='eager'
        />
        <div className='mb-3'>
          <h1 className='text-3xl font-extrabold tracking-tight sm:mt-3 sm:text-5xl'>
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

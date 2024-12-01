import Image from 'next/image';
import { remark } from 'remark';
import html from 'remark-html';
import { BookmarkButton } from '@/components/bookmark-button';
import { fromMangaToSaved } from '@/lib/client/utils';
import type { Manga } from '@/types/manga';

interface MangaHeaderProps {
  manga: Manga;
}

export async function MangaHeader(props: MangaHeaderProps) {
  const { manga } = props;

  let descHtml = '';

  if (manga.description) {
    const descFromMd = await remark().use(html).process(manga.description);
    descHtml = descFromMd.toString('utf-8');
  }

  return (
    <>
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
    </>
  );
}

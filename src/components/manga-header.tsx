import Image from 'next/image';
import { remark } from 'remark';
import html from 'remark-html';
import { BookmarkButton } from '@/components/bookmark-button';
import { fromMangaToSaved } from '@/lib/utils';
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
        <div className='relative float-none inline-block sm:float-left sm:mr-3 sm:mb-3'>
          <BookmarkButton manga={fromMangaToSaved(manga)} />
          <Image
            className='rounded-box border-base-content/20 aspect-3/4 border object-cover shadow-md'
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
          <p className='text-base-content/70 mb-3 font-bold'>
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
            className='rounded-selector bg-neutral text-neutral-content mr-3 mb-3 max-w-fit px-2 py-1 text-xs break-keep'
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

import { Paginas } from '@/components/paginas';
import { mangadex } from '@/lib/api/mangadex/api';
import type { Chapter, Manga } from '@/types/manga';
import type { Metadata } from 'next';

interface LeitorProps {
  params: { id: string };
}

const getTitle = (chapter: Chapter & Manga) => {
  let title = '';

  if (typeof chapter.number === 'string' && /[0-9]+/.test(chapter.number)) {
    title += 'Cap. ';

    if (typeof chapter.volume === 'string' && /[0-9]+/.test(chapter.volume)) {
      title += chapter.volume + '.';
    }

    title += chapter.number;
    if (chapter.title) title += ' - ';
  }

  if (chapter.title) title += chapter.title;

  return title;
};

export async function generateMetadata({
  params,
}: LeitorProps): Promise<Metadata> {
  const chapter = await mangadex.chapter(params.id);
  const title = getTitle(chapter);

  return {
    metadataBase: new URL('https://mangaeon.com'),
    title,
    openGraph: {
      title,
      description: chapter.description,
      type: 'book',
      locale: chapter.translatedLanguage,
      releaseDate: chapter.publishAt.toISOString(),
      tags: chapter.tags,
    },
    robots: { index: false, follow: false },
  };
}

export default async function Leitor({ params }: LeitorProps) {
  const chapter = await mangadex.chapter(params.id);

  const images = await mangadex.pages(params.id);
  const secure = images.baseUrl.includes('https') ? 'secure' : 'insecure';
  const origin = images.baseUrl.replace(/https?:\/\/(.*)/, '$1');

  return (
    <div className='mb-3 flex flex-col items-center'>
      <h2 className='mb-4 mt-2 text-pretty text-lg font-bold'>
        {getTitle(chapter)}
      </h2>
      <Paginas
        images={images.srcs.map((src) => `/mangadex/${secure}/${origin}${src}`)}
      />
    </div>
  );
}

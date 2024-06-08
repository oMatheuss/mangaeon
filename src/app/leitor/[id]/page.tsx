import { AddViewed } from '@/components/add-viewed';
import { Paginas } from '@/components/paginas';
import { mangadex } from '@/lib/api/mangadex/api';
import type { Metadata } from 'next';

interface LeitorProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: LeitorProps): Promise<Metadata> {
  const chapter = await mangadex.chapter(params.id);

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
  const images = await mangadex.pages(params.id);
  const secure = images.baseUrl.includes('https') ? 'secure' : 'insecure';
  const origin = images.baseUrl.replace(/https?:\/\/(.*)/, '$1');

  return (
    <div className='mb-3 flex flex-col items-center'>
      <AddViewed id={params.id} />
      <Paginas
        images={images.srcs.map((src) => `/mangadex/${secure}/${origin}${src}`)}
      />
    </div>
  );
}

import { ChapterList } from '@/components/chapter-list';
import { mangadex } from '@/lib/api/mangadex/api';
import { notFound } from 'next/navigation';

interface MangaProps {
  params: { id: string };
  searchParams: { page?: string };
}

export default async function Chapters(props: MangaProps) {
  const { params, searchParams } = props;
  const _page = searchParams.page;
  const page = _page && /\d+/.test(_page) ? parseInt(_page) : 1;

  if (page <= 0 || page * 96 > 10000) notFound();
  const chapters = await mangadex.chapters(params.id, page);

  return <ChapterList mangaId={params.id} page={page} data={chapters} />;
}

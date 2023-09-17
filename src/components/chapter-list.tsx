'use client';

import { ViewedIcon } from '@/components/viewed-icon';
import { toErrorReponse } from '@/lib/client/utils';
import { Chapter, ChapterResponse } from '@/types/chapters';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, PlusSquare } from 'lucide-react';
import Link from 'next/link';

const fetchChaptersList = async (id: string, page: number) => {
  const res = await fetch(
    `/api/series/chapters_list.json?id_serie=${id}&page=${page}`,
    {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw toErrorReponse(res);
  const chps: ChapterResponse = await res.json();
  return { chapters: chps.chapters, page };
};

interface ChapterListProps {
  id: string;
  initialData: { chapters: false | Chapter[]; page: number };
}

export const ChapterList = ({ id, initialData }: ChapterListProps) => {
  const chaptersQuery = useInfiniteQuery({
    queryKey: ['chapters', id],
    queryFn: ({ pageParam = 1 }) => fetchChaptersList(id, pageParam),
    getNextPageParam: (last) => (!last.chapters ? undefined : last.page + 1),
    initialData: () => {
      return { pageParams: [1], pages: [initialData] };
    },
    staleTime: 1000 * 60 * 60 * 3,
  });

  const chapters = chaptersQuery.data;

  return (
    <>
      <h2 className='font-bold text-xl mt-4 mb-2'>Capítulos</h2>
      <ol className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4'>
        {chapters &&
          chapters.pages
            .filter((x) => Array.isArray(x.chapters))
            .flatMap((x) => x.chapters as Chapter[])
            .map((chap) => (
              <ChapterCard key={chap.id_chapter} chapter={chap} />
            ))}
        {(chaptersQuery.hasNextPage || chaptersQuery.isLoading) && (
          <li className='sm:col-span-2 lg:col-span-3 xl:col-span-4'>
            <button
              disabled={
                chaptersQuery.isLoading || chaptersQuery.isFetchingNextPage
              }
              onClick={() => chaptersQuery.fetchNextPage()}
              className='w-full flex flex-row justify-center md:justify-start border border-base-content/20 p-2 rounded-bl-lg rounded-tr-lg bg-base-200 enabled:hover:bg-base-200/50'
            >
              {chaptersQuery.isLoading || chaptersQuery.isFetchingNextPage ? (
                <Loader2 className='animate-spin' />
              ) : (
                <PlusSquare />
              )}
            </button>
          </li>
        )}
      </ol>
    </>
  );
};

interface ChapterCardProps {
  chapter: Chapter;
}

const ChapterCard = ({ chapter }: ChapterCardProps) => {
  const firstScan = Object.entries(chapter.releases)[0][1];
  const link = `/ler/${firstScan.id_release}`;

  return (
    <li className='w-full flex flex-row justify-between items-center border border-base-content/20 p-2 rounded-bl-lg rounded-tr-lg bg-base-200 shadow-md'>
      <div className='flex flex-col'>
        <Link
          title={`Ler capítulo ${chapter.number}`}
          href={link}
          className='hover:underline'
        >
          Capítulo {chapter.number}
        </Link>
        <span className='font-bold text-xs opacity-75'>{chapter.name}</span>
      </div>
      <div className='flex flex-col items-end'>
        <div className='proportional-nums'>{chapter.date}</div>
        <div className='flex flex-row space-x-3 items-center'>
          <ViewedIcon className='w-4 h-4' id_chapter={firstScan.id_release} />
        </div>
      </div>
    </li>
  );
};

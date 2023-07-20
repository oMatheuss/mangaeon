import { toErrorReponse } from '@/lib/utils';
import { Chapter, ChapterResponse } from '@/types/chapters';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, PlusSquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

type MangaParams = {
  name: string;
  id: string;
};

const fetchChaptersList = async (id: string, page: number) => {
  const res = await fetch(
    `/api/series/chapters_list.json?id_serie=${id}&page=${page}`,
    {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
  );
  if (!res.ok) throw toErrorReponse(res);
  const chps: ChapterResponse = await res.json();
  return { chapters: chps.chapters, page };
};

export const Manga = () => {
  const params = useParams<MangaParams>();

  const chaptersQuery = useInfiniteQuery({
    queryKey: ['chapters', params.id],
    queryFn: ({ pageParam = 1 }) => fetchChaptersList(params.id!, pageParam),
    getNextPageParam: (last) => (!last.chapters ? undefined : last.page + 1),
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
            .map((chap) => {
              const firstScan = Object.entries(chap.releases)[0][1];
              return (
                <li key={chap.id_chapter}>
                  <Link
                    title={`Ler capítulo ${chap.number}`}
                    to={firstScan.link}
                    className='w-full flex flex-row justify-between items-center border border-slate-200 dark:border-gray-800 p-2 rounded-bl-lg rounded-tr-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-gray-800 shadow-md'
                  >
                    <div className='flex flex-col'>
                      <span>Capítulo {chap.number}</span>
                      <span className='font-bold text-xs'>{chap.name}</span>
                    </div>
                    <div className='proportional-nums'>{chap.date}</div>
                  </Link>
                </li>
              );
            })}
        {chaptersQuery.hasNextPage && (
          <li className='sm:col-span-2 lg:col-span-3 xl:col-span-4'>
            <button
              disabled={chaptersQuery.isFetchingNextPage}
              onClick={() => chaptersQuery.fetchNextPage()}
              className='w-full flex flex-row justify-center md:justify-start border border-slate-200 dark:border-gray-800 p-2 rounded-bl-lg rounded-tr-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-gray-800 shadow-md'
            >
              {chaptersQuery.isFetchingNextPage ? (
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

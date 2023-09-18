'use client';

import { ChapterList } from '@/components/chapter-list';
import { Chapter, Manga } from '@/types/manga';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

export default function Manga() {
  const pathname = usePathname();
  const id = pathname.split('/').pop() ?? '';

  const mangaQuery = useQuery({
    queryKey: ['manga', id],
    queryFn: async () =>
      (await fetch(`/api/manga/${id}`).then((d) => d.json())) as Manga,
    enabled: !!id,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: false,
  });

  const chaptersQuery = useQuery({
    queryKey: ['chapters', id],
    queryFn: async () =>
      (await fetch(`/api/chapters/${id}`).then((d) => d.json())) as Chapter[],
    enabled: !!id,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: false,
  });

  const manga = mangaQuery.data;
  const chapters = chaptersQuery.data;

  return (
    <>
      {manga && (
        <div className='flex flex-col'>
          <div className='relative items-center mt-6 border-separate'>
            <img
              className='float-none sm:float-left object-cover aspect-[3/4] h-64 rounded m-auto mb-6 sm:m-3'
              src={manga.cover}
              alt={`Imagem de capa de ${manga.title}`}
            />
            <div className='mb-3'>
              <h1 className='sm:mt-3 text-5xl font-extrabold tracking-tight'>
                {manga.title}
              </h1>
              <p className='font-bold text-base-content/70 ml-3 mb-3'>
                {manga.author}, {manga.artist}
              </p>
              <p className='indent-4 md:indent-8 text-justify'>
                {manga.description}
              </p>
            </div>
          </div>
          <div className='flex flex-row flex-wrap capitalize'>
            {manga.tags.map((tag) => (
              <span
                key={tag}
                className='mr-3 mb-3 text-xs break-keep p-2 rounded bg-neutral text-neutral-content max-w-fit'
              >
                {tag}
              </span>
            ))}
          </div>
          <ChapterList chapters={chapters ?? []} />
        </div>
      )}
    </>
  );
}

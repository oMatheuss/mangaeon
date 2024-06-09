'use client';

import {
  type SavedManga,
  useMangaList,
  useRemoveMangaMutation,
} from '@/lib/client/saved';
import { Frown, StarOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function SavedMangaList() {
  const { data: list } = useMangaList();
  const { mutate: remove } = useRemoveMangaMutation(true);

  return (
    <>
      {list?.length === 0 && (
        <div className='flex flex-row items-center'>
          <Frown className='mr-2 h-8 w-8 pb-1' /> Nada foi favoritado ainda!
        </div>
      )}
      <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {list?.map((manga) => (
          <Card
            key={manga.mangaId}
            saved={manga}
            onDelete={() => remove(manga.mangaId)}
          />
        ))}
      </div>
    </>
  );
}

interface CardProps {
  saved: SavedManga;
  onDelete: () => void;
}

function Card({ saved, onDelete }: CardProps) {
  return (
    <div className='relative flex h-36 w-full items-center overflow-hidden rounded-bl-btn rounded-tr-btn border border-base-content/20 shadow-md'>
      <Link
        className='group flex h-36 grow items-center bg-base-200 hover:bg-opacity-50'
        href={`/manga/${saved.mangaId}`}
      >
        {saved.coverImage && (
          <div className='min-w-fit overflow-hidden'>
            <Image
              unoptimized
              className='h-36 w-24 max-w-fit object-cover transition-transform group-hover:scale-110'
              width={256}
              height={384}
              src={window.URL.createObjectURL(saved.coverImage)}
              alt={`Imagem de capa de "${saved.title}"`}
            />
          </div>
        )}
        <div className='p-4'>
          <h3 className='line-clamp-5 text-sm font-semibold group-hover:underline'>
            {saved.title}
          </h3>
        </div>
      </Link>
      <div className='float-right flex h-full flex-row'>
        <button
          className='m-2 rounded-badge p-1 text-warning transition-colors hover:bg-warning/75 hover:text-warning-content'
          onClick={onDelete}
        >
          <span className='sr-only'>Excluir</span>
          <StarOff className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}

'use client';

import {
  type SavedManga,
  useMangaList,
  useRemoveMangaMutation,
  useExportSavedMangasToCsv,
} from '@/lib/client/saved';
import {
  BookmarkCheckIcon,
  BookmarkMinusIcon,
  EllipsisVerticalIcon,
  FileDownIcon,
  FrownIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function SavedMangaList() {
  const { data: list } = useMangaList();
  const { mutate: remove } = useRemoveMangaMutation(true);

  return (
    <>
      {list?.length === 0 && (
        <div className='flex flex-row items-center'>
          <FrownIcon className='mr-2 h-8 w-8 pb-1' /> Nada foi favoritado ainda!
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
      <Actions />
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
        <div className='flex h-full w-full flex-col justify-between p-4'>
          <h3 className='line-clamp-5 text-sm font-semibold'>{saved.title}</h3>
          <p className='self-end text-sm'>
            {saved.includedAt.toLocaleString('pt-br')}
          </p>
        </div>
      </Link>
      <div className='float-right flex h-full flex-col justify-around'>
        <button className='group p-2' onClick={onDelete}>
          <span className='sr-only'>Excluir</span>
          <div className='rounded-btn bg-error/75 p-1 text-error-content opacity-80 transition-opacity group-hover:opacity-100 group-active:opacity-50'>
            <BookmarkMinusIcon className='h-5 w-5' />
          </div>
        </button>
        <button className='group p-2'>
          <span className='sr-only'>Editar</span>
          <div className='rounded-btn bg-success/75 p-1 text-success-content opacity-80 transition-opacity group-hover:opacity-100 group-active:opacity-50'>
            <BookmarkCheckIcon className='h-5 w-5' />
          </div>
        </button>
        <button className='group p-2'>
          <span className='sr-only'>Opções</span>
          <div className='rounded-btn bg-neutral/75 p-1 text-neutral-content opacity-80 transition-opacity group-hover:opacity-100 group-active:opacity-50'>
            <EllipsisVerticalIcon className='h-5 w-5' />
          </div>
        </button>
      </div>
    </div>
  );
}

function Actions() {
  const exportMut = useExportSavedMangasToCsv();
  const handleExport = () => {
    exportMut.mutate(undefined, {
      onSuccess: (csv) => {
        const link = document.createElement('a');
        link.download = 'export.csv';
        link.href = `data:text/csv;charset=utf-8,${window.encodeURI(csv)}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    });
  };

  return (
    <section className='mb-4 flex flex-wrap gap-2 rounded-box border border-base-content/20 bg-base-200 p-2'>
      <button
        onClick={handleExport}
        disabled={exportMut.isPending}
        className='flex rounded-btn bg-primary px-3 py-1 text-primary-content opacity-80 transition-opacity hover:opacity-100 active:opacity-50'
      >
        <FileDownIcon className='mr-1' />
        <span className='font-medium'>Exportar</span>
      </button>
    </section>
  );
}

'use client';

import { useLiked, Liked } from '@/lib/client/liked';
import { Frown, StarOff } from 'lucide-react';
import Link from 'next/link';

export const LikedList = () => {
  const { liked, del } = useLiked();

  const handleDelete = async (id: string) => {
    const target = { ...liked.find((x) => x.id === id)! };
    del(target.id);
  };

  return (
    <>
      {liked.length === 0 && (
        <div className='flex flex-row items-center'>
          <Frown className='mr-2 h-8 w-8 pb-1' /> Nada foi favoritado ainda!
        </div>
      )}
      <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {liked.map((x) => (
          <LikedCard key={x.id} liked={x} onDelete={handleDelete} />
        ))}
      </div>
    </>
  );
};

interface LikedCardProps {
  liked: Liked;
  onDelete: (id: string) => void;
}

const LikedCard = ({ liked, onDelete }: LikedCardProps) => {
  const handleDelete = () => onDelete(liked.id);
  return (
    <div className='relative flex h-36 w-full items-center overflow-hidden rounded-bl-btn rounded-tr-btn border border-base-content/20 shadow-md'>
      <Link
        className='group flex h-36 grow items-center bg-base-200 hover:bg-opacity-50'
        href={`/manga/${liked.id}`}
      >
        <div className='min-w-fit overflow-hidden'>
          <img
            className='h-36 w-24 max-w-fit object-cover transition-transform group-hover:scale-110'
            src={liked.image}
            alt={`Imagem de capa de "${liked.name}"`}
          />
        </div>
        <div className='p-4'>
          <h3 className='line-clamp-5 text-sm font-semibold group-hover:underline'>
            {liked.name}
          </h3>
        </div>
      </Link>
      <div className='float-right flex h-full flex-row'>
        <button
          className='m-2 rounded-full p-1 text-warning transition-colors hover:bg-warning/75 hover:text-warning-content'
          onClick={handleDelete}
        >
          <span className='sr-only'>Excluir</span>
          <StarOff className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
};

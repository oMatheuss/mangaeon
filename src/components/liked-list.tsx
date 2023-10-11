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
          <Frown className='h-8 w-8 mr-2 pb-1' /> Nada foi favoritado ainda!
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4'>
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
    <div className='relative h-36 flex items-center w-full border border-base-content/20 rounded-bl-lg rounded-tr-lg shadow-md overflow-hidden'>
      <Link
        className='group flex items-center bg-base-200 hover:bg-opacity-50 grow h-36'
        href={`/manga/${liked.id}`}
      >
        <div className='min-w-fit overflow-hidden'>
          <img
            className='transition-transform group-hover:scale-110 object-cover max-w-fit h-36 w-24'
            src={liked.image}
            alt={`Imagem de capa de "${liked.name}"`}
          />
        </div>
        <div className='p-4'>
          <h3 className='group-hover:underline font-semibold text-sm line-clamp-5'>
            {liked.name}
          </h3>
        </div>
      </Link>
      <div className='flex h-full flex-row float-right'>
        <button
          className='p-1 m-2 text-warning transition-colors hover:bg-warning/75 hover:text-warning-content rounded-full'
          onClick={handleDelete}
        >
          <span className='sr-only'>Excluir</span>
          <StarOff className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
};

import { useLiked } from '@/lib/liked';
import { Frown, StarOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Liked = () => {
  const { liked, del } = useLiked();

  return (
    <>
      <h2 className='font-bold text-2xl mt-8 mb-4'>Favoritos</h2>
      {liked.length === 0 && (
        <div className='flex flex-row items-center'>
          <Frown className='h-8 w-8 mr-2 pb-1' /> Nada foi favoritado ainda!
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4'>
        {liked.map((x) => (
          <div
            key={x.id}
            className='relative w-full border border-slate-200 dark:border-gray-800 rounded-bl-lg rounded-tr-lg bg-slate-100 dark:bg-slate-900 shadow-md'
          >
            <button
              className='absolute top-0 right-0 inline-flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200 rounded-br'
              onClick={() => del(x.id)}
            >
              <span className='sr-only'>Excluir</span>
              <StarOff />
            </button>
            <Link
              className='h-36 flex items-center hover:bg-slate-200 dark:hover:bg-gray-800'
              to={x.link}
            >
              <img
                className='object-contain max-w-fit h-36 rounded-bl'
                src={x.image}
                alt={`Imagem de capa de "${x.name}"`}
              />
              <div className='w-full h-full p-4 overflow-scroll'>
                <h2 className='font-semibold text-clip'>{x.name}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

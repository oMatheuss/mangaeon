import { useLiked } from '@/lib/liked';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Liked = () => {
  const [liked, setLiked] = useLiked();

  return (
    <>
      <h2 className='font-bold text-2xl mt-8 mb-4'>Favoritos</h2>
      {liked.length === 0 && <span>Nada foi favoritado ainda!</span>}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4'>
        {liked.map((x) => (
          <div
            key={x.id}
            className='relative w-full border border-slate-200 dark:border-gray-800 rounded-bl-lg rounded-tr-lg bg-slate-100 dark:bg-slate-900 shadow-md'
          >
            <button
              className='absolute top-0 right-0 inline-flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200 rounded-br'
              onClick={() => setLiked((z) => z.filter((y) => y.id !== x.id))}
            >
              <span className='sr-only'>Excluir</span>
              <Trash2 />
            </button>
            <Link
              className='flex items-center hover:bg-slate-200 dark:hover:bg-gray-800'
              to={x.link}
            >
              <img
                className='object-contain max-w-fit h-36 rounded-bl'
                src={x.image}
                alt={`Imagem de capa de "${x.name}"`}
              />
              <div className='w-full p-4'>
                <h2 className='font-semibold'>{x.name}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

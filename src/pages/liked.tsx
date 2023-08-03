import { LikedActions } from '@/components/liked-actions';
import { LikedList } from '@/components/liked-list';
import { useUser } from '@/lib/user';
import { Star } from 'lucide-react';

export const Liked = () => {
  const [user] = useUser();
  const isLogged = user !== null;

  return (
    <>
      <div className='flex mt-8 mb-4'>
        <Star className='inline h-7 w-7 mr-2 text-yellow-300 fill-current' />
        <h2 className='font-bold text-2xl'>Favoritos</h2>
      </div>
      {isLogged ? (
        <LikedActions userUid={user.uid} />
      ) : (
        <div className='my-3 w-full bg-green-300 dark:bg-green-500 p-2 rounded text-center'>
          <span>Faça login para salvar seus favoritos!</span>
        </div>
      )}
      <LikedList />
    </>
  );
};

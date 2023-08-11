import { type Liked as LikedType, useLiked } from '@/lib/liked';

import { DownloadCloud, Loader2, Save } from 'lucide-react';
import { useState } from 'react';

interface LikedActions {
  userUid: string;
}

export const LikedActions = ({ userUid }: LikedActions) => {
  const { liked, set } = useLiked();

  const [isLoading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { db, writeBatch, doc } = await import('@/lib/firestore');

    try {
      const batch = writeBatch(db);

      for (const { id, image, link, name } of liked) {
        const likedRef = doc(db, 'users', userUid, 'liked', id.toString());
        batch.set(likedRef, { image, link, name });
      }

      await batch.commit();
    } catch (e) {
      alert(
        'Ops! Ocorreu um erro ao tentar salvar. Tente novamente mais tarde.'
      );
    }
    setLoading(false);
  };

  const handleSync = async () => {
    setLoading(true);
    const { db, collection, getDocs } = await import('@/lib/firestore');

    try {
      const cloudLiked = await getDocs(
        collection(db, 'users', userUid, 'liked')
      );
      const newArr = cloudLiked.docs.map((x) => {
        const data = x.data();
        return { id: Number(x.id), ...data } as LikedType;
      });

      set(newArr);
    } catch (e) {
      alert(
        'Ops! Ocorreu um erro ao tentar acessar a nuvem. Tente novamente mais tarde.'
      );
    }

    setLoading(false);
  };

  return (
    <div className='flex flex-col md:flex-row mb-4 items-center'>
      <div className='w-full md:w-auto md:mr-3 flex flex-row space-x-3'>
        <button
          disabled={isLoading}
          onClick={handleSave}
          className='py-2 px-4 rounded flex justify-center w-full md:w-auto bg-light dark:bg-dark enabled:hover:bg-green-300 dark:enabled:hover:bg-green-500 border border-light-b dark:border-dark-b enabled:hover:border-green-400 dark:enabled:hover:border-green-600'
        >
          {isLoading ? (
            <Loader2 className='h-6 w-6 animate-spin' />
          ) : (
            <Save className='h-6 w-6' />
          )}
          <span className='ml-3'>Salvar</span>
        </button>
        <button
          disabled={isLoading}
          onClick={handleSync}
          className='py-2 px-4 rounded flex justify-center w-full md:w-auto bg-light dark:bg-dark enabled:hover:bg-yellow-200 dark:enabled:hover:bg-amber-300 border border-light-b dark:border-dark-b enabled:hover:border-yellow-300 dark:enabled:hover:border-amber-400'
        >
          {isLoading ? (
            <Loader2 className='h-6 w-6 animate-spin' />
          ) : (
            <DownloadCloud className='h-6 w-6' />
          )}
          <span className='ml-3'>Nuvem</span>
        </button>
      </div>
    </div>
  );
};

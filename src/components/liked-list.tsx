import { useLiked, Liked } from '@/lib/liked';
import { useUser } from '@/lib/user';
import { Frown, StarOff } from 'lucide-react';
import Link from 'next/link';

export const LikedList = () => {
  const { liked } = useLiked();
  return (
    <>
      {liked.length === 0 && (
        <div className='flex flex-row items-center'>
          <Frown className='h-8 w-8 mr-2 pb-1' /> Nada foi favoritado ainda!
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4'>
        {liked.map((x) => (
          <LikedCard key={x.id} liked={x} />
        ))}
      </div>
    </>
  );
};

interface LikedCardProps {
  liked: Liked;
}

const LikedCard = ({ liked }: LikedCardProps) => {
  const { del, add } = useLiked();
  const [user] = useUser();

  const handleDelete = async () => {
    const oldLiked = { ...liked };
    del(oldLiked.id); // optimistic delete

    if (user !== null) {
      const { db, doc, deleteDoc } = await import('@/lib/firestore');

      const docRef = doc(db, 'users', user.uid, 'liked', liked.id.toString());

      deleteDoc(docRef).catch(() => {
        add(oldLiked); // rollback optimistic delete
        alert(
          'Ops! Ocorreu um erro ao excluir da nuvem. Tente novamente mais tarde.'
        );
      });
    }
  };
  return (
    <div className='relative w-full border border-light-b dark:border-dark-b rounded-bl-lg rounded-tr-lg bg-light dark:bg-dark shadow-md hover:bg-light-b dark:hover:bg-dark-b'>
      <button
        className='absolute top-0 right-0 inline-flex items-center justify-center w-10 h-10 text-dark-b dark:text-light-b rounded-br'
        onClick={handleDelete}
      >
        <span className='sr-only'>Excluir</span>
        <StarOff />
      </button>
      <Link className='h-36 flex items-center' href={`/manga/${liked.id}`}>
        <img
          className='object-cover max-w-fit h-36 w-24 rounded-bl'
          src={liked.image}
          alt={`Imagem de capa de "${liked.name}"`}
        />
        <div className='w-full h-full p-4 overflow-scroll'>
          <h3 className='font-semibold text-clip'>{liked.name}</h3>
        </div>
      </Link>
    </div>
  );
};

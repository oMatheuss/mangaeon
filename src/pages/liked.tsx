import { type Liked as LikedType, useLiked } from '@/lib/liked';
import { useUser } from '@/lib/user';
import { DownloadCloud, Frown, Save, StarOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Liked = () => {
  const { liked, del, set } = useLiked();
  const [user] = useUser();
  const notLogged = user === null;

  const handleSave = async () => {
    if (notLogged) return;

    const { db, doc, setDoc } = await import('@/lib/firestore');

    for (const { id, image, link, name } of liked) {
      await setDoc(
        doc(db, 'users', user.uid, 'liked', id.toString()),
        { image, link, name },
        { merge: true }
      );
    }
  };

  const handleSync = async () => {
    if (notLogged) return;

    const { db, collection, getDocs } = await import('@/lib/firestore');
    let cloudLiked = await getDocs(collection(db, 'users', user.uid, 'liked'));
    let newArr = cloudLiked.docs.map((x) => {
      let data = x.data();
      return { id: Number(x.id), ...data } as LikedType;
    });

    set(newArr);
  };

  return (
    <>
      <h2 className='font-bold text-2xl mt-8 mb-4'>Favoritos</h2>
      <div className='flex flex-col md:flex-row mb-4 items-center'>
        <div className='w-full md:w-auto md:mr-3 flex flex-row space-x-3'>
          <button
            disabled={notLogged}
            onClick={handleSave}
            className='py-2 px-4 rounded flex justify-center w-full md:w-auto bg-slate-200 dark:bg-slate-900 enabled:hover:bg-green-300 dark:enabled:hover:bg-green-500 border border-current'
          >
            <Save className='h-6 w-6' />
            <span className='ml-3'>Salvar</span>
          </button>
          <button
            disabled={notLogged}
            onClick={handleSync}
            className='py-2 px-4 rounded flex justify-center w-full md:w-auto bg-slate-200 dark:bg-slate-900 enabled:hover:bg-yellow-200 dark:enabled:hover:bg-amber-300 border border-current'
          >
            <DownloadCloud className='h-6 w-6' />
            <span className='ml-3'>Nuvem</span>
          </button>
        </div>
        {notLogged && (
          <div className='order-1 md:order-3 mt-3 md:mt-0 w-full md:w-auto bg-green-300 dark:bg-green-500 p-2 rounded text-center'>
            <span>Faça login para salvar seus favoritos!</span>
          </div>
        )}
      </div>
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
                className='object-contain max-w-fit h-36 w-24 rounded-bl'
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

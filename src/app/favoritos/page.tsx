import { SavedMangaList } from '@/components/saved-list';
import { LibraryIcon } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favoritos',
  robots: { index: false, follow: false },
};

export default function Liked() {
  return (
    <>
      <div className='mb-4 mt-8 flex'>
        <LibraryIcon className='mr-2 inline size-8' />
        <h2 className='text-2xl font-bold'>Favoritos</h2>
      </div>
      <SavedMangaList />
    </>
  );
}

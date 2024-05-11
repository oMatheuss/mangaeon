import { LikedList } from '@/components/liked-list';
import { Star } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favoritos',
  robots: { index: false, follow: false },
};

export default function Liked() {
  return (
    <>
      <div className='flex mt-8 mb-4'>
        <Star className='inline h-7 w-7 mr-2 text-yellow-300 fill-current' />
        <h2 className='font-bold text-2xl'>Favoritos</h2>
      </div>
      <LikedList />
    </>
  );
}

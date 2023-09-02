'use client';

import { SecondaryAlert } from '@/components/alert';
import { LikedActions } from '@/components/liked-actions';
import { LikedList } from '@/components/liked-list';
import { useUser } from '@/lib/user';
import { Star } from 'lucide-react';

export default function Liked() {
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
        <SecondaryAlert text='Faça login para salvar seus favoritos!' />
      )}
      <LikedList />
    </>
  );
}

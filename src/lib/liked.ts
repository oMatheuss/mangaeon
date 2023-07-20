import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface Liked {
  id: number;
  name: string;
  link: string;
  image: string;
}

export const likedAtom = atomWithStorage<Liked[]>('darkMode', []);

export const useLiked = () => {
  return useAtom(likedAtom);
};

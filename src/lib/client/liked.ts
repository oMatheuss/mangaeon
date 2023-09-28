import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface Liked {
  id: string;
  name: string;
  image: string;
}

export const likedAtom = atomWithStorage<Liked[]>('liked', []);

export const useLiked = () => {
  const [liked, setLiked] = useAtom(likedAtom);

  const exist = (id: string) => {
    return liked.findIndex((x) => x.id === id) > -1;
  };

  const add = (serie: Liked): void => {
    setLiked((x) => [...x, serie]);
  };

  const del = (id: string): void => {
    setLiked((x) => x.filter((y) => y.id !== id));
  };

  return { liked, exist, add, del, set: setLiked };
};

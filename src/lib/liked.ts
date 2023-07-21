import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface Liked {
  id: number;
  name: string;
  link: string;
  image: string;
}

export const likedAtom = atomWithStorage<Liked[]>('darkMode', []);

export const useLiked = () => {
  const [liked, setLiked] = useAtom(likedAtom);

  const exist = (id: number) => {
    return liked.findIndex((x) => x.id === id) > -1;
  };

  const add = (serie: Liked): void => {
    setLiked((x) => [...x, serie]);
  };

  const del = (id: number): void => {
    setLiked((x) => x.filter((y) => y.id !== id));
  };

  return { liked, exist, add, del };
};

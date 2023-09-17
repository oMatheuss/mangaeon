import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Viewed = number[];

export const viewedAtom = atomWithStorage<Viewed>('viewed', []);

export const useViewed = () => {
  const [viewed, setViewed] = useAtom(viewedAtom);

  const exist = (id: number) => viewed.includes(id);

  const add = (id: number): void => {
    if (isFinite(id)) {
      setViewed((x) => (x.includes(id) ? x : [...x, id]));
    }
  };

  return { viewed, exist, add };
};

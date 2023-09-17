import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Viewed = string[];

export const viewedAtom = atomWithStorage<Viewed>('viewed', []);

export const useViewed = () => {
  const [viewed, setViewed] = useAtom(viewedAtom);

  const exist = (id: string) => viewed.includes(id);

  const add = (id: string): void => {
    if (id && id.length > 0) {
      setViewed((x) => (x.includes(id) ? x : [...x, id]));
    }
  };

  return { viewed, exist, add };
};

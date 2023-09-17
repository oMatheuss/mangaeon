import { HighLights } from '@/types/highlights';
import { MostRead } from '@/types/most-read';
import { Release } from '@/types/releases';

export interface IApi {
  highlights: () => Promise<HighLights[]>;
  mostRead: () => Promise<MostRead[]>;
}

export interface IClientApi {
  releases: (page: number) => Promise<Release[]>;
  search: () => Promise<any>;
  manga: () => Promise<any>;
  chapters: () => Promise<any>;
  pages: () => Promise<any>;
}

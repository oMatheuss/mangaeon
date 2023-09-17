import { HighLights } from '@/types/highlights';
import { Manga } from '@/types/manga';
import { MostRead } from '@/types/most-read';
import { Release } from '@/types/releases';

export interface IApi {
  highlights: () => Promise<HighLights[]>;
  mostRead: () => Promise<MostRead[]>;
}

export interface IClientApi {
  releases: (page: number) => Promise<Release[]>;
  search: () => Promise<any>;
  manga: (id: string) => Promise<Manga>;
  pages: () => Promise<any>;
}

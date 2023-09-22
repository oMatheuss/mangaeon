import { HighLights } from '@/types/highlights';
import { Images } from '@/types/images';
import { Chapter, Manga } from '@/types/manga';
import { MostRead } from '@/types/most-read';
import { Release } from '@/types/releases';
import { Search } from '@/types/search';

export interface IApi {
  highlights: () => Promise<HighLights[]>;
  mostRead: () => Promise<MostRead[]>;
}

export interface IClientApi {
  releases: (page: number) => Promise<Release[]>;
  search: (query: string) => Promise<Search[]>;
  manga: (id: string) => Promise<Manga>;
  chapters: (id: string) => Promise<Chapter[]>;
  pages: (id: string) => Promise<Images>;
}

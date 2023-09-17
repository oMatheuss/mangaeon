import { HighLights } from '@/types/highlights';
import { MostRead } from '@/types/most-read';

export interface IApi {
  highlights: () => Promise<HighLights[]>;
  mostRead: () => Promise<MostRead[]>;
  releases: () => Promise<any>;
  search: () => Promise<any>;
  manga: () => Promise<any>;
  chapters: () => Promise<any>;
  pages: () => Promise<any>;
}

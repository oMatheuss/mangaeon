import { HighLights } from '@/types/highlights';
import { MostRead } from '@/types/most-read';

export interface IApi {
  highlights: () => Promise<HighLights[]>;
  mostRead: () => Promise<MostRead[]>;
}

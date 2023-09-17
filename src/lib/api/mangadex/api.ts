import type { MostRead } from '@/types/most-read';
import type { IApi } from '@/lib/api/iapi';
import type { Manga, MangaResponse } from './manga';
import type { HighLights } from '@/types/highlights';
import sharp from 'sharp';

const BASE_URL = 'https://api.mangadex.org';
const BASE_COVER_URL = 'https://uploads.mangadex.org/covers';

const getMostRead = async () => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL('/manga', BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('order[rating]', 'desc');
  searchParams.append('contentRating[]', 'safe');
  searchParams.append('contentRating[]', 'suggestive');
  searchParams.append('availableTranslatedLanguage[]', 'pt-br');
  searchParams.append('availableTranslatedLanguage[]', 'pt');
  searchParams.append('hasAvailableChapters', 'true');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();

  return json.data.map(extractMostRead);
};

const extractMostRead = (data: Manga) => {
  const id = data.id;
  const title = Object.values(data.attributes.title)[0] ?? '';

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `${BASE_COVER_URL}/${id}/${coverImage}.256.jpg`;

  return <MostRead>{ title, cover, id };
};

const downloadBuffer = (src: string) =>
  fetch(src).then((res) => res.arrayBuffer());

const getHighLights = async () => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL('/manga', BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('order[relevance]', 'desc');
  searchParams.append('contentRating[]', 'safe');
  //searchParams.append('contentRating[]', 'suggestive');

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  searchParams.append('updatedAtSince', lastMonth.toISOString().slice(0, 19));
  searchParams.append('availableTranslatedLanguage[]', 'pt-br');
  searchParams.append('availableTranslatedLanguage[]', 'pt');
  searchParams.append('status[]', 'ongoing');
  searchParams.append('limit', '10');
  searchParams.append('hasAvailableChapters', 'true');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  return Promise.all(json.data.map(extractHighLights));
};

const extractHighLights = async (data: Manga) => {
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `${BASE_COVER_URL}/${id}/${coverImage}.512.jpg`;

  const date = new Date(data.attributes.updatedAt);

  const img = await downloadBuffer(cover);
  const sharpApi = sharp(img);

  const buffer = await sharpApi.toBuffer();
  const { dominant, channels } = await sharp(buffer).stats();

  // average color
  const [r, g, b] = channels.map((c) => c.mean);
  const color =
    Math.round(r).toString(16) +
    Math.round(g).toString(16) +
    Math.round(b).toString(16);

  // luminosity, max 21. < 50% then light else dark
  const foreground =
    0.2126 * dominant.r + 0.7151 * dominant.g + 0.0721 * dominant.b < 10.5
      ? 'fff'
      : '000';

  return <HighLights>{ id, title, cover, date, color, foreground };
};

export const mangadex: IApi = {
  mostRead: getMostRead,
  highlights: getHighLights,
};

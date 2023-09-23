import type { MostRead } from '@/types/most-read';
import type { Manga, MangaResponse } from './manga';
import type { HighLights } from '@/types/highlights';
import type { Release } from '@/types/releases';
import type { Chapter, Manga as ExtractedManga } from '@/types/manga';
import type { ChapterResponse } from './chapter';
import type { Search } from '@/types/search';
import type { PagesResponse } from './pages';
import type { Images } from '@/types/images';

import sharp from 'sharp';

const BASE_URL = 'https://api.mangadex.org';
const BASE_COVER_URL = 'https://uploads.mangadex.org/covers';

const getReleases = async (page: number) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL('/manga', BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('order[updatedAt]', 'desc');
  searchParams.append('contentRating[]', 'safe');
  searchParams.append('contentRating[]', 'suggestive');
  searchParams.append('availableTranslatedLanguage[]', 'pt-br');
  searchParams.append('availableTranslatedLanguage[]', 'pt');
  searchParams.append('hasAvailableChapters', 'true');
  searchParams.append('limit', '30');
  if (page > 1) {
    searchParams.append('offset', (30 * (page - 1)).toString());
  }

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  return json.data.map(extractReleases);
};

const extractReleases = (data: Manga) => {
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `${BASE_COVER_URL}/${id}/${coverImage}.256.jpg`;

  const date = new Date(data.attributes.updatedAt);

  const tags = data.attributes.tags
    .filter((x) => x.type === 'tag')
    .map((x) => x.attributes.name.en)
    .filter(Boolean);

  return <Release>{
    id,
    title,
    cover,
    date,
    tags,
  };
};

const getManga = async (id: string) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL('manga', BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('includes[]', 'artist');
  searchParams.append('includes[]', 'author');
  searchParams.append('ids[]', id);
  searchParams.append('limit', '1');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  const manga = extractManga(json.data[0]);
  return manga;
};

const extractManga = async (data: Manga) => {
  const langs = 'pt-br,pt,en'.split(',');
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  let description = '';
  const descriptionLangs = Object.keys(data.attributes.description);
  for (let lang of langs) {
    if (descriptionLangs.includes('pt-br')) {
      description = data.attributes.description[lang];
    }
  }

  const artist =
    data.relationships.filter((x) => x.type === 'artist')[0]?.attributes
      ?.name ?? '';
  const author =
    data.relationships.filter((x) => x.type === 'author')[0]?.attributes
      ?.name ?? '';

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `${BASE_COVER_URL}/${id}/${coverImage}.512.jpg`;

  const tags = data.attributes.tags
    .filter((x) => x.type === 'tag')
    .map((x) => x.attributes.name.en)
    .filter(Boolean);

  return <ExtractedManga>{
    id,
    title,
    cover,
    tags,
    description,
    artist,
    author,
  };
};

const getChapters = async (id: string) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL(`/manga/${id}/aggregate`, BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('translatedLanguage[]', 'pt-br');
  searchParams.append('translatedLanguage[]', 'pt');

  const response = await fetch(url, requestOptions);
  const json: ChapterResponse = await response.json();

  return extractChapters(json.volumes).reverse();
};

const extractChapters = (data: ChapterResponse['volumes']) => {
  return Object.values(data)
    .map((volume) => {
      return Object.values(volume.chapters).map((chap) => {
        return <Chapter>{
          chapterId: chap.id,
          number: chap.chapter,
          volume: volume.volume,
          name: '',
        };
      });
    })
    .flat();
};

const getSearch = async (query: string) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL('/manga', BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('title', query);

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('includes[]', 'author');
  searchParams.append('includes[]', 'artist');
  searchParams.append('order[rating]', 'desc');

  searchParams.append('contentRating[]', 'safe');
  searchParams.append('contentRating[]', 'suggestive');
  searchParams.append('contentRating[]', 'erotica');
  searchParams.append('contentRating[]', 'pornographic');

  searchParams.append('limit', '15');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  return json.data.map(extractSearch);
};

const extractSearch = (data: Manga) => {
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `${BASE_COVER_URL}/${id}/${coverImage}.256.jpg`;

  const artist =
    data.relationships.filter((x) => x.type === 'artist')[0]?.attributes
      ?.name ?? '';
  const author =
    data.relationships.filter((x) => x.type === 'author')[0]?.attributes
      ?.name ?? '';

  const date = new Date(data.attributes.updatedAt);

  const tags = data.attributes.tags
    .filter((x) => x.type === 'tag')
    .map((x) => x.attributes.name.en)
    .filter(Boolean);

  return <Search>{
    id,
    title,
    cover,
    date,
    tags,
    artist,
    author,
  };
};

const getPages = async (id: string) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL(`/at-home/server/${id}`, BASE_URL);
  const response = await fetch(url, requestOptions);
  const json: PagesResponse = await response.json();

  return extractPages(json.baseUrl, json.chapter.hash, json.chapter.data);
};

const extractPages = (baseUrl: string, hash: string, files: string[]) => {
  return <Images>{
    baseUrl,
    hash,
    srcs: files.map((file) => {
      return `${baseUrl}/data/${hash}/${file}`;
    }),
  };
};

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

export const mangadex = {
  mostRead: getMostRead,
  highlights: getHighLights,
  chapters: getChapters,
  manga: getManga,
  pages: getPages,
  releases: getReleases,
  search: getSearch,
};

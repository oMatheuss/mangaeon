import type { IClientApi } from '@/lib/api/iapi';
import type { Manga, MangaResponse } from './manga';
import { Release } from '@/types/releases';
import { Chapter, Manga as ExtractedManga } from '@/types/manga';
import { ChapterResponse } from './chapter';
import { Search } from '@/types/search';
import { PagesResponse } from './pages';
import { Images } from '@/types/images';

const BASE_URL = '/api';
const BASE_COVER_URL = '/covers';

const getReleases = async (page: number) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const searchParams = new URLSearchParams();

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

  const url = BASE_URL + '/manga?' + searchParams.toString();
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

  const searchParams = new URLSearchParams();

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('includes[]', 'artist');
  searchParams.append('includes[]', 'author');
  searchParams.append('ids[]', id);
  searchParams.append('limit', '1');

  const url = BASE_URL + '/manga?' + searchParams.toString();
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

  const searchParams = new URLSearchParams();

  searchParams.append('translatedLanguage[]', 'pt-br');
  searchParams.append('translatedLanguage[]', 'pt');

  const url = BASE_URL + `/manga/${id}/aggregate?` + searchParams.toString();
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

  const searchParams = new URLSearchParams();

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

  const url = BASE_URL + '/manga?' + searchParams.toString();
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

  const url = BASE_URL + `/at-home/server/${id}`;
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

export const clientMangadex: IClientApi = {
  releases: getReleases,
  manga: getManga,
  chapters: getChapters,
  search: getSearch,
  pages: getPages,
};

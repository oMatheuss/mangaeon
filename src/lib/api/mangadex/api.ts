import type { MostRead } from '@/types/most-read';
import type { Manga, MangaResponse } from './manga';
import type { HighLights } from '@/types/highlights';
import type { Release } from '@/types/releases';
import type {
  Chapter,
  ChaptersWithPagination,
  Manga as ExtractedManga,
} from '@/types/manga';
import type { FeedResponse } from './chapter';
import type { Search } from '@/types/search';
import type { PagesResponse } from './pages';
import type { Images } from '@/types/images';

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

  searchParams.append('contentRating[]', 'safe');
  searchParams.append('contentRating[]', 'suggestive');
  searchParams.append('contentRating[]', 'erotica');
  searchParams.append('contentRating[]', 'pornographic');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  const manga = extractManga(json.data[0]);
  return manga;
};

const extractManga = (data: Manga) => {
  const langs = 'pt-br,pt,en'.split(',');
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  let description = '';
  const descriptionLangs = Object.keys(data.attributes.description);
  for (let lang of langs) {
    if (descriptionLangs.includes(lang)) {
      description = data.attributes.description[lang];
      break;
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

const getChapters = async (id: string, page: number = 0) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL(`/manga/${id}/feed`, BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('translatedLanguage[]', 'pt-br');
  searchParams.append('translatedLanguage[]', 'en');
  searchParams.append('translatedLanguage[]', 'es-la');

  searchParams.append('limit', '96');
  searchParams.append('offset', '0');

  searchParams.append('includes[]', 'scanlation_group');
  searchParams.append('includes[]', 'user');

  searchParams.append('order[volume]', 'desc');
  searchParams.append('order[chapter]', 'desc');

  searchParams.append('contentRating[]', 'safe');
  searchParams.append('contentRating[]', 'suggestive');
  searchParams.append('contentRating[]', 'erotica');
  searchParams.append('contentRating[]', 'pornographic');

  if (page > 1) {
    searchParams.append('offset', (96 * (page - 1)).toString());
  }

  const response = await fetch(url, requestOptions);
  const json: FeedResponse = await response.json();

  return <ChaptersWithPagination>{
    chapters: extractChapters(json.data)
      // sort by volume and chapter number
      .sort(
        (a, b) =>
          parseFloat(a.volume) - parseFloat(b.volume) ||
          parseFloat(a.number) - parseFloat(b.number)
      )
      .reverse(),
    limit: json.limit,
    offset: json.offset,
    total: json.total,
  };
};

const extractChapters = (data: FeedResponse['data']) => {
  return data.map((chap) => {
    const extracted = <Partial<Chapter>>{
      chapterId: chap.id,
      number: chap.attributes.chapter,
      volume: chap.attributes.volume,
      title: chap.attributes.title,
      publishAt: chap.attributes.publishAt,
      pages: chap.attributes.pages,
      translatedLanguage: chap.attributes.translatedLanguage,
      externalUrl: chap.attributes.externalUrl,
    };

    for (const rel of chap.relationships) {
      switch (rel.type) {
        case 'scanlation_group':
          extracted.scanlator = rel.attributes?.name;
          if (rel.attributes?.website)
            extracted.scanlatorWebsite = rel.attributes.website;
          else if (rel.attributes?.twitter)
            extracted.scanlatorWebsite = `//twitter.com/${rel.attributes.twitter}`;
          else if (rel.attributes?.discord) {
            extracted.scanlatorWebsite = `//discord.gg/${rel.attributes.discord}`;
          }
          break;
        case 'manga':
          break;
        case 'user':
          break;
      }
    }

    return extracted as Chapter;
  });
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
    next: { revalidate: 900 }, // 15 minutos
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
      return `/data/${hash}/${file}`;
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
  searchParams.append('order[followedCount]', 'desc');
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
  const langs = 'pt-br,pt,en'.split(',');
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  let description = '';
  const descriptionLangs = Object.keys(data.attributes.description);
  for (let lang of langs) {
    if (descriptionLangs.includes(lang)) {
      description = data.attributes.description[lang];
      break;
    }
  }

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `${BASE_COVER_URL}/${id}/${coverImage}.256.jpg`;

  return <MostRead>{ title, cover, id, description };
};

const getHighLights = async () => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL('/manga', BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('order[rating]', 'desc');
  searchParams.append('contentRating[]', 'safe');
  //searchParams.append('contentRating[]', 'suggestive');

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  searchParams.append('updatedAtSince', lastMonth.toISOString().slice(0, 19));
  searchParams.append('availableTranslatedLanguage[]', 'pt-br');
  searchParams.append('availableTranslatedLanguage[]', 'pt');
  searchParams.append('limit', '10');
  searchParams.append('hasAvailableChapters', 'true');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  return json.data.map(extractHighLights);
};

const extractHighLights = (data: Manga) => {
  const id = data.id;
  const title = Object.values(data.attributes.title)[0];

  const coverImage =
    data.relationships.filter((x) => x.type === 'cover_art')[0]?.attributes
      ?.fileName ?? '';
  const cover = `${BASE_COVER_URL}/${id}/${coverImage}.256.jpg`;

  const date = new Date(data.attributes.updatedAt);

  return <HighLights>{ id, title, cover, date };
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

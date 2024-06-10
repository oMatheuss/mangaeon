import type { MangaData, MangaResponse } from './manga';
import type { ChapterData, ChapterResponse, FeedResponse } from './chapter';
import type { PagesResponse } from './pages';
import type { Chapter, ChaptersWithPagination, Manga } from '@/types/manga';
import type { Images } from '@/types/images';

const BASE_URL = 'https://api.mangadex.org';
const BASE_COVER_URL = 'https://uploads.mangadex.org/covers';

const LANGS = 'pt-br,pt,en,ja,ja-ro,es-la'.split(',');

const mangaTitle = (data: MangaData) => {
  const titles = data.attributes.title;
  for (const lang of LANGS) {
    if (titles[lang]) return titles[lang];
  }

  return Object.values(titles)[0];
};

const mangaDesc = (data: MangaData) => {
  const descs = data.attributes.description;
  for (const lang of LANGS) {
    if (descs[lang]) return descs[lang];
  }

  return Object.values(descs)[0];
};

const getReleases = async (page: number) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL('/manga', BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('includes[]', 'cover_art');
  searchParams.append('includes[]', 'artist');
  searchParams.append('includes[]', 'author');
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
  return json.data.map(extractManga);
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

const extractManga = (data: MangaData) => {
  const manga: Partial<Manga> = {
    id: data.id,
    title: mangaTitle(data),
    description: mangaDesc(data),
    updatedAt: new Date(data.attributes.updatedAt),
  };

  const rel = data.relationships;
  if (rel && rel.length > 0) {
    manga.artist = rel.find((x) => x.type === 'artist')?.attributes?.name ?? '';
    manga.author = rel.find((x) => x.type === 'author')?.attributes?.name ?? '';

    const coverImage =
      rel.find((x) => x.type === 'cover_art')?.attributes?.fileName ?? '';
    manga.cover = `${BASE_COVER_URL}/${manga.id}/${coverImage}.512.jpg`;
  }

  manga.tags = data.attributes.tags
    .filter((x) => x.type === 'tag')
    .map((x) => x.attributes.name.en)
    .filter(Boolean);

  return manga as Manga;
};

const getChapter = async (id: string) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  const url = new URL(`/chapter/${id}`, BASE_URL);
  const searchParams = url.searchParams;

  searchParams.append('includes[]', 'manga');

  const response = await fetch(url, requestOptions);
  const json: ChapterResponse = await response.json();

  let chapInfo: Partial<Chapter & Manga> = extractChapter(json.data);

  for (const rel of json.data.relationships) {
    if (rel.type === 'manga') {
      const manga = extractManga(rel);
      chapInfo = { ...chapInfo, ...manga };
      break;
    }
  }

  return chapInfo as Chapter & Manga;
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
    chapters: json.data
      .map((chap) => extractChapter(chap))
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

const extractChapter = (chap: ChapterData) => {
  const attrs = chap.attributes;

  const chapInfo = <Partial<Chapter>>{
    chapterId: chap.id,
    number: attrs.chapter,
    volume: attrs.volume,
    chapterTitle: attrs.title,
    publishAt: new Date(attrs.publishAt),
    pages: attrs.pages,
    translatedLanguage: attrs.translatedLanguage,
    externalUrl: attrs.externalUrl,
  };

  const rels = chap.relationships ?? [];
  for (const rel of rels) {
    if (rel.type === 'scanlation_group') {
      chapInfo.scanlator = rel.attributes?.name;

      if (rel.attributes?.website) {
        chapInfo.scanlatorWebsite = rel.attributes.website;
      } else if (rel.attributes?.twitter) {
        chapInfo.scanlatorWebsite = `//twitter.com/${rel.attributes.twitter}`;
      } else if (rel.attributes?.discord) {
        chapInfo.scanlatorWebsite = `//discord.gg/${rel.attributes.discord}`;
      }

      break;
    }
  }

  return chapInfo as Chapter;
};

const getSearch = async (query: string, contentRating = 1) => {
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

  // ts ignore here because it needs to fall through
  switch (contentRating) {
    //@ts-ignore
    case 4:
      searchParams.append('contentRating[]', 'pornographic');
    //@ts-ignore
    case 3:
      searchParams.append('contentRating[]', 'erotica');
    //@ts-ignore
    case 2:
      searchParams.append('contentRating[]', 'suggestive');
    default:
      searchParams.append('contentRating[]', 'safe');
  }

  searchParams.append('limit', '15');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();
  return json.data.map(extractManga);
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
  searchParams.append('includes[]', 'artist');
  searchParams.append('includes[]', 'author');
  searchParams.append('order[followedCount]', 'desc');
  searchParams.append('contentRating[]', 'safe');
  searchParams.append('contentRating[]', 'suggestive');
  searchParams.append('availableTranslatedLanguage[]', 'pt-br');
  searchParams.append('availableTranslatedLanguage[]', 'pt');
  searchParams.append('hasAvailableChapters', 'true');

  const response = await fetch(url, requestOptions);
  const json: MangaResponse = await response.json();

  return json.data.map(extractManga);
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
  return json.data.map(extractManga);
};

export const mangadex = {
  mostRead: getMostRead,
  highlights: getHighLights,
  chapters: getChapters,
  chapter: getChapter,
  manga: getManga,
  pages: getPages,
  releases: getReleases,
  search: getSearch,
};

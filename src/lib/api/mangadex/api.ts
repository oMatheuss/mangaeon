import type { MangaData, MangaResponse } from './manga';
import type { TagData, TagResponse } from './tag';
import type { ChapterData, ChapterResponse, FeedResponse } from './chapter';
import type { PagesResponse } from './pages';
import type {
  Chapter,
  ChaptersWithPagination,
  Manga,
  SearchParams,
  Tag,
} from '@/types/manga';
import type { Images } from '@/types/images';
import { notFound } from 'next/navigation';

const DEFAULT_REQ_OPTS: RequestInit = {
  headers: {
    'User-Agent': 'MangaEon/v1.0.0',
  },
  method: 'GET',
};

const BASE_URL = 'https://api.mangadex.org';
const BASE_COVER_URL = 'https://uploads.mangadex.org/covers';

const LANGS = 'pt-br,pt,en,ja,ja-ro,es-la'.split(',');

function checkResponse(res: Response): void | never {
  if (res.ok) return;

  const error = Error();
  error.name = 'MangaDex';

  switch (res.status) {
    case 403:
      error.message =
        'O acesso ao servidor de origem foi bloqueado. Tente novamente mais tarde.';
      break;
    case 404:
      notFound();
    case 429:
      error.message =
        'Limite de requisições ao servidor de origem foi atingido. ';
      const retryAfter = res.headers.get('X-RateLimit-Retry-After');
      if (retryAfter) {
        const unixTimeRetry = parseInt(retryAfter);
        const dateRetry = new Date(unixTimeRetry);
        error.message += `Tente novamente após ${dateRetry.toLocaleTimeString('pt-BR')}`;
      } else {
        error.message += 'Tente novamente mais tarde.';
      }
      break;
    default:
      error.message = `Erro ao chamar a API: ${res.status} - ${res.statusText}`;
  }

  console.error({
    message: 'Ocorreu um erro ao chamar a API do mangadex.',
    url: res.url,
    status: res.status,
    rateLimit: {
      limit: res.headers.get('X-RateLimit-Limit'),
      remaining: res.headers.get('X-RateLimit-Remaining'),
      retryAfter: res.headers.get('X-RateLimit-Retry-After'),
    },
  });

  throw error;
}

async function apiGet<T>(url: URL, init: RequestInit = {}): Promise<T> {
  const request = new Request(url, {
    ...DEFAULT_REQ_OPTS,
    ...init,
  });
  const response = await fetch(request);
  checkResponse(response);
  const json = await response.json();
  return json as T;
}

function extractTitle(data: MangaData) {
  const titles = data.attributes.title;
  for (const lang of LANGS) {
    if (titles[lang]) return titles[lang];
  }

  return Object.values(titles)[0];
}

function extractDescription(data: MangaData) {
  const descs = data.attributes.description;
  for (const lang of LANGS) {
    if (descs[lang]) return descs[lang];
  }

  return Object.values(descs)[0];
}

function extractManga(data: MangaData) {
  const manga: Partial<Manga> = {
    id: data.id,
    title: extractTitle(data),
    description: extractDescription(data),
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
}

function extractChapter(chap: ChapterData) {
  const attrs = chap.attributes;

  const chapInfo = {
    chapterId: chap.id,
    number: attrs.chapter,
    volume: attrs.volume,
    chapterTitle: attrs.title,
    publishAt: attrs.publishAt,
    pages: attrs.pages,
    translatedLanguage: attrs.translatedLanguage,
    externalUrl: attrs.externalUrl,
  } as Partial<Chapter>;

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
}

function extractPages(pages: PagesResponse): Images {
  const { baseUrl, chapter } = pages;
  return {
    baseUrl,
    hash: chapter.hash,
    srcs: chapter.data.map((file) => `/data/${chapter.hash}/${file}`),
  };
}

function extractTag(tag: TagData): Tag {
  return {
    id: tag.id,
    name: tag.attributes.name.en,
    group: tag.attributes.group,
  };
}

export const mangadex = {
  async mostRead() {
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
    searchParams.append('limit', '25');

    const res = await apiGet<MangaResponse>(url);
    return res.data.map(extractManga);
  },
  async highlights() {
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

    const res = await apiGet<MangaResponse>(url);
    return res.data.map(extractManga);
  },
  async chapters(id: string, page: number = 0) {
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

    const res = await apiGet<FeedResponse>(url);

    return {
      chapters: res.data
        .map((chap) => extractChapter(chap))
        // sort by volume and chapter number
        .sort(
          (a, b) =>
            parseFloat(a.volume) - parseFloat(b.volume) ||
            parseFloat(a.number) - parseFloat(b.number)
        )
        .reverse(),
      limit: res.limit,
      offset: res.offset,
      total: res.total,
    } as ChaptersWithPagination;
  },
  async chapter(id: string) {
    const url = new URL(`/chapter/${id}`, BASE_URL);
    const searchParams = url.searchParams;

    searchParams.append('includes[]', 'manga');

    const res = await apiGet<ChapterResponse>(url);

    let chapInfo: Partial<Chapter & Manga> = extractChapter(res.data);

    for (const rel of res.data.relationships) {
      if (rel.type === 'manga') {
        const manga = extractManga(rel);
        chapInfo = { ...chapInfo, ...manga };
        break;
      }
    }

    return chapInfo as Chapter & Manga;
  },
  async manga(id: string) {
    const url = new URL('/manga', BASE_URL);
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

    const res = await apiGet<MangaResponse>(url);
    return extractManga(res.data[0]);
  },
  async pages(id: string) {
    const requestOptions: RequestInit = {
      next: { revalidate: 900 }, // 15 minutos
    };

    const url = new URL(`/at-home/server/${id}`, BASE_URL);
    const pages = await apiGet<PagesResponse>(url, requestOptions);

    return extractPages(pages);
  },
  async releases(page: number) {
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

    const res = await apiGet<MangaResponse>(url);
    return res.data.map(extractManga);
  },
  async tags() {
    const url = new URL('/manga/tag', BASE_URL);
    const res = await apiGet<TagResponse>(url, {
      next: { revalidate: 604800 },
    });
    return res.data.map(extractTag);
  },
  async search(params: SearchParams) {
    const url = new URL('/manga', BASE_URL);
    const searchParams = url.searchParams;

    if (params.title) searchParams.append('title', params.title);

    searchParams.append('includes[]', 'cover_art');
    searchParams.append('includes[]', 'author');
    searchParams.append('includes[]', 'artist');

    if (params.contentRating) {
      if (typeof params.contentRating === 'string') {
        searchParams.append('contentRating[]', params.contentRating);
      } else {
        for (const rating of params.contentRating) {
          searchParams.append('contentRating[]', rating);
        }
      }
    }

    if (params.includeTag) {
      if (typeof params.includeTag === 'string') {
        searchParams.append('includedTags[]', params.includeTag);
      } else {
        for (const tag of params.includeTag) {
          searchParams.append('includedTags[]', tag);
        }
      }
    }

    if (params.updatedAtSince) {
      searchParams.append(
        'updatedAtSince',
        params.updatedAtSince + 'T00:00:00'
      );
      searchParams.append('order[updatedAt]', 'desc');
    }

    searchParams.append('limit', '15');

    const res = await apiGet<MangaResponse>(url);
    return res.data.map(extractManga);
  },
};

export interface Manga {
  id: string;
  title: string;
  description: string;
  cover: string;
  tags: string[];
  author: string;
  artist: string;
  updatedAt: Date;
}

export interface SearchParams {
  title?: string;
  contentRating?: string;
  updatedAtSince?: string;
  includeTag?: string | string[];
}

export interface Chapter {
  chapterId: string;
  chapterTitle: string;
  number: string;
  volume: string;
  publishAt: string;
  pages: number;
  translatedLanguage: string;
  scanlator: string;
  scanlatorWebsite: string;
  externalUrl: string;
}

export interface ChaptersWithPagination extends Pagination {
  chapters: Chapter[];
}

interface Pagination {
  limit: number;
  offset: number;
  total: number;
}

export interface Tag {
  id: string;
  name: string;
  group: string;
}

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

export interface Chapter {
  chapterId: string;
  chapterTitle: string;
  number: string;
  volume: string;
  publishAt: Date;
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

export interface Manga {
  id: string;
  title: string;
  description: string;
  cover: string;
  tags: string[];
  author: string;
  artist: string;
}

export interface Chapter {
  chapterId: string;
  title: string;
  number: string;
  volume: string;
  publishAt: string;
  pages: number;
  translatedLanguage: string;
  scanlator: string;
  scanlatorWebsite: string;
}

export interface ChaptersWithPagination extends Pagination {
  chapters: Chapter[];
}

interface Pagination {
  limit: number;
  offset: number;
  total: number;
}

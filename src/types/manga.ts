export interface Manga {
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

  scanlator: string;
  scanlatorWebsite: string;
}

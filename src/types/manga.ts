export interface Manga {
  title: string;
  description: string;
  cover: string;
  tags: string[];
  author: string;
  artist: string;
  chapters: Chapter[];
}

export interface Chapter {
  chapterId: string;
  name: string;
  number: string;
  date: string;
}

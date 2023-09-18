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
  name: string;
  number: string;
  volume: string;
}

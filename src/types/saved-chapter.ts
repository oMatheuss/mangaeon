export interface SavedChapterPage {
  link: string;
  pageNumber: string;
  chapterId: number;
  base64: string | null;
}

export interface SavedChapter {
  mangaId: number;
  chapter: string;
  chapterId: number;
  link: string;
  name: string;
  downloaded: boolean;
}

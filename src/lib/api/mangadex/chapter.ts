export interface ChapterResponse {
  result: string;
  volumes: Volumes;
}

interface Volumes {
  [volume: string]: Volume;
}

interface Volume {
  volume: string;
  count: number;
  chapters: Chapters;
}

interface Chapters {
  [chapter: string]: Chapter;
}

interface Chapter {
  chapter: string;
  id: string;
  others: string[];
  count: number;
}

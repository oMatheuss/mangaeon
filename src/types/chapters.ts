export interface ChapterResponse {
  chapters: Chapter[] | false;
}

export interface Chapter {
  id_serie: number;
  id_chapter: number;
  name: string;
  chapter_name: string;
  number: string;
  date: string;
  date_created: string;
  releases: Releases;
  seasonAnimeFinished: any;
  officialLink: any;
  predictionDate: any;
  predictionDateToCalc: any;
  serieFirstChapter: string;
  officialSerieLink: string;
}

export interface Releases {
  [scan: string]: Scan;
}

export interface Scan {
  id_release: number;
  scanlators: Scanlator[];
  views: number;
  link: string;
}

export interface Scanlator {
  id_scanlator: number;
  name: string;
  link: string;
}

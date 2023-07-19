export interface ReleasesReponse {
  releases: Release[];
  _isLoggedIn: boolean;
}

export interface Release {
  date: string;
  dateString: string;
  date_created: string;
  id_serie: number;
  name: string;
  image: string;
  image_thumb: string;
  image_avif: string;
  image_thumb_avif: string;
  range: string;
  chapters: Chapter[];
  link: string;
}

export interface Chapter {
  url: string;
  number: string;
  date_created: string;
  scanlators: Scanlators;
}

export interface Scanlators {
  [key: string]: Scan;
}

export interface Scan {
  id_scanlator: number;
  name: string;
  link: string;
}

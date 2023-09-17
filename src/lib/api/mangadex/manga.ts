export interface MangaResponse {
  result: string;
  response: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}

export interface Manga {
  id: string;
  type: string;
  attributes: Attributes;
  relationships: Relationship[];
}

interface Attributes {
  title: Title;
  altTitles: AltTitle[];
  description: Description;
  isLocked: boolean;
  links: Links;
  originalLanguage: string;
  lastVolume: string;
  lastChapter: string;
  publicationDemographic?: string;
  status: string;
  year: number;
  contentRating: string;
  tags: Tag[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  availableTranslatedLanguages: string | undefined[];
  latestUploadedChapter: string;
}

interface Title {
  [language: string]: string;
}
interface AltTitle {
  [language: string]: string;
}
interface Description {
  [language: string]: string;
}

interface Links {
  al: string;
  ap: string;
  bw: string;
  kt: string;
  mu: string;
  nu?: string;
  amz: string;
  ebj: string;
  mal: string;
  raw?: string;
  engtl: string;
  cdj?: string;
}

interface Tag {
  id: string;
  type: string;
  attributes: Attributes2;
  relationships: any[];
}

interface Attributes2 {
  name: Name;
  description: Description2;
  group: string;
  version: number;
}

interface Name {
  en: string;
}

export interface Description2 {}

interface Relationship {
  id: string;
  type: string;
  attributes?: Attributes3;
  related?: string;
}

interface Attributes3 {
  name?: string;
  imageUrl: any;
  biography?: Biography;
  twitter?: string;
  pixiv?: string;
  melonBook: any;
  fanBox: any;
  booth: any;
  nicoVideo: any;
  skeb: any;
  fantia: any;
  tumblr: any;
  youtube?: string;
  weibo: any;
  naver: any;
  website?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  description?: string;
  volume?: string;
  fileName?: string;
  locale?: string;
}

interface Biography {
  en?: string;
  zh?: string;
}

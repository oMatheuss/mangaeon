export interface FeedResponse {
  result: string;
  response: string;
  data: Daum[];
  limit: number;
  offset: number;
  total: number;
}

export interface Daum {
  id: string;
  type: string;
  attributes: Attributes;
  relationships: Relationship[];
}

export interface Attributes {
  volume?: string;
  chapter: string;
  title?: string;
  translatedLanguage: string;
  externalUrl?: string;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
}

export type Relationship =
  | {
      id: string;
      type: 'scanlation_group';
      attributes: ScanlationGroupAttribute;
    }
  | {
      id: string;
      type: 'manga';
    }
  | {
      id: string;
      type: 'user';
      attributes: UserAttribute;
    };

export interface ScanlationGroupAttribute {
  name: string;
  altNames: AltName[];
  locked: boolean;
  website: string;

  ircServer?: string;
  ircChannel?: string;
  discord?: string;
  contactEmail?: string;
  description?: string;
  twitter: string;
  mangaUpdates: string;
  focusedLanguages: string[];
  official: boolean;
  verified: boolean;
  inactive: boolean;
  publishDelay?: string;
  exLicensed: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAttribute {
  username?: string;
  roles?: string[];
  version: number;
}

export interface AltName {
  [lang: string]: string;
}

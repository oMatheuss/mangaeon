export interface SearchResponse {
  series: Series[] | false;
  categories: Category[];
  groups: Group[];
}

export interface Series {
  id_serie: number;
  name: string;
  label: string;
  score: string;
  value: string;
  author: string;
  artist: string;
  categories: SerieCategory[];
  cover: string;
  cover_thumb: string;
  cover_avif: string;
  cover_thumb_avif: string;
  link: string;
  is_complete: boolean;
}

export interface SerieCategory {
  id_category: number;
  id_sub_domain: any;
  domain: string;
  name: string;
  _joinData: JoinData;
}

export interface JoinData {
  id_serie_category: number;
  id_serie: number;
  id_category: number;
}

export interface Category {
  id_category: number;
  name: string;
  label: string;
  value: string;
  titles: number;
  view_count: string;
  link: string;
  position: number;
}

export interface Group {
  id_scanlator: number;
  titles: number;
  name: string;
  label: string;
  value: string;
  facebook_url?: string;
  discord_url?: string;
  image: string;
  link: string;
  rating: number;
  upvotes: any;
  downvotes: any;
  position: number;
}

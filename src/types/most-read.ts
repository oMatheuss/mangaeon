export interface MostReadResponse {
  most_read: MostRead[] | false;
  _isLoggedIn: boolean;
}

export interface MostRead {
  id_serie: number;
  serie_name: string;
  cover: string;
  cover_thumb: string;
  cover_avif: string;
  cover_thumb_avif: string;
  link: string;
}

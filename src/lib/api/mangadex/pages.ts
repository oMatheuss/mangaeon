export interface PagesResponse {
  result: string;
  baseUrl: string;
  chapter: Pages;
}

export interface Pages {
  hash: string;
  data: string[];
  dataSaver: string[];
}

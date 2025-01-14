export interface TagResponse {
  result: string;
  response: string;
  data: TagData[];
  limit: number;
  offset: number;
  total: number;
}

export interface TagData {
  id: string;
  type: string;
  attributes: TagAttributes;
  relationships: any[];
}

interface TagAttributes {
  name: { en: string };
  description: Record<string, string>;
  group: string;
  version: number;
}

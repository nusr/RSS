import { IArticle } from './IArticle'
export interface IFeed {
  id?: string;
  articles?: IArticle[];
  author: string;
  categories: string[];
  createTime: number;
  deleteTime: number;
  description: string;
  etag?: string;
  favicon: string;
  generator: string;
  language: string;
  link: string;
  publishTime: number;
  time: number;
  title: string;
}

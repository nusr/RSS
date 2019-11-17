import { IArticle } from './IArticle'
import { IFeed } from './IFeed'
import { LANGUAGE_KEY_TYPE } from '../locales'
export interface IArticlesState {
  current: IArticle | null;
  filter: string;
  isFetching: boolean;
  isUpdatingCurrent: boolean;
  list: IArticle[];
}

export interface IFeedsState {
  isUpdating: boolean;
  isCreating: boolean;
  list: IFeed[];
  map: any;
}

export interface IMenuState {
  language: string;
  onlineStatus: boolean;
  selectedKey: string;
  
  setLanguage(lang: LANGUAGE_KEY_TYPE): void;
  
  setSelectedKey(key: string): void;
  
  setOnlineStatus(): void;
  
  getLanguageData(key: string): string;
}

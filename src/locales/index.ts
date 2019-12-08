import enUS from './enUS'
import zhCN from './zhCN'
export enum LANGUAGE_MAP {
  en = 'en-US',
  zh = 'zh-CN',
}
type Value = {
  [key: string]: string;
}
export const messages: { [key: string]: Value } = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

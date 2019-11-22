import enUS from './enUS'
import zhCN from './zhCN'
export type LANGUAGE_KEY_TYPE = 'en-US' | 'zh-CN'
type Value = {
  [key: string]: string;
}
export const messages: { [key: string]: Value } = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

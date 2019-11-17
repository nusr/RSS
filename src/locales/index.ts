
import enUS from './enUS'
import zhCN from './zhCN'
export  type LANGUAGE_KEY_TYPE = 'en-US' | 'zh-CN'
export const messages: { [key: string]: any } = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

import { createModel } from 'hox'
import { useState } from 'react'
import { messages, LANGUAGE_KEY_TYPE } from '../locales'

const LANGUAGE = 'LANGUAGE'
const languageDefault = (localStorage.getItem(LANGUAGE) || navigator.language) as LANGUAGE_KEY_TYPE
type LanguageState = {
  language: LANGUAGE_KEY_TYPE;
  setLanguage(language: LANGUAGE_KEY_TYPE): void;
  getLanguageData(key: string): string;
}
function useLanguage() {
  const [language, setLang] = useState<LANGUAGE_KEY_TYPE>(languageDefault)
  const getLanguageData = (key: string) => {
    return messages[language][key]
  }
  const setLanguage = (lang: LANGUAGE_KEY_TYPE) => {
    setLang(lang)
    localStorage.setItem(LANGUAGE, lang)
  }
  return {
    language,
    setLanguage,
    getLanguageData,
  }
}

export default createModel<LanguageState>(useLanguage)

import { createModel } from 'hox'
import { useState } from 'react'
import { messages, LANGUAGE_MAP } from '../locales'
import { LANGUAGE_KEY } from '../shared'
type LanguageState = {
  language: LANGUAGE_MAP
  setLanguage(language: LANGUAGE_MAP): void
  getLanguageData(key: string): string
}
function useLanguage() {
  const [language, setLang] = useState<LANGUAGE_MAP>(
    localStorage.getItem(LANGUAGE_KEY) as LANGUAGE_MAP
  )
  const getLanguageData = (key: string) => {
    const data = messages[language] || {}
    return data[key]
  }
  const setLanguage = (lang: LANGUAGE_MAP) => {
    setLang(lang)
    localStorage.setItem(LANGUAGE_KEY, lang)
  }
  return {
    language,
    setLanguage,
    getLanguageData,
  }
}

export default createModel<LanguageState>(useLanguage)

import React, { Fragment, useEffect, useState } from 'react'
import { AppMenu } from './components/AppMenu'
import { ArticleList } from './components/ArticleList'
import { ArticleView } from './components/ArticleView'
import { SettingsModal } from './components/SettingsModal'
import { ImportOPML } from './components/ImportOPML'
import { ipcRenderer } from 'electron'
import { LANGUAGE_MAP } from './locales'
import { useLanguageModel } from './store'
import './App.less'

export interface IAppProps {
  className?: string;
}
export const App: React.FunctionComponent<IAppProps> = () => {
  const [initOver, setInitOver] = useState<boolean>(false)
  const { language, setLanguage } = useLanguageModel()
  useEffect(() => {
    ipcRenderer.send('GET_LOCALE')
  }, [])
  useEffect(() => {
    ipcRenderer.on('RETURN_LOCALE', (event, locale: string) => {
      setInitOver(true)
      if (!language) {
        let result = LANGUAGE_MAP.en
        if (locale.startsWith('zh')) {
          result = LANGUAGE_MAP.zh
        }
        setLanguage(result)
      }
    })
  }, [])
  if (!initOver) {
    return null
  }
  return (
    <Fragment>
      <div className="app-side">
        <AppMenu />
        <ArticleList />
      </div>
      <div className="app-content">
        <ArticleView />
      </div>
      <SettingsModal />
      <ImportOPML />
    </Fragment>
  )
}

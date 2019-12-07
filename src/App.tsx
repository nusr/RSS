import React, { Fragment } from 'react'
import { AppMenu } from './components/AppMenu'
import { ArticleList } from './components/ArticleList'
import { ArticleView } from './components/ArticleView'
import { SettingsModal } from './components/SettingsModal'

import { useMessageModel } from './store'
import { ImportOPML } from './components/ImportOPML'
import './App.less'

export interface IAppProps {
  className?: string;
}

export const App: React.FunctionComponent<IAppProps> = () => {
  const {
    visible,
    messageParams = {
      message: '',
    },
  } = useMessageModel()

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
      {visible && (
        <div className="global-message">
          <div className="message-content"> {messageParams.message}</div>
        </div>
      )}
    </Fragment>
  )
}

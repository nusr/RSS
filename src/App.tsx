import React, { useEffect, useState, Fragment } from 'react'
import AppMenu from './components/AppMenu'
import ArticleList from './components/ArticleList'
import ArticleView from './components/ArticleView'
import SettingsModal from './components/SettingsModal'
import { ipcRenderer } from 'electron'
import { useMessageModel } from './store'
import './App.less'

export interface IAppProps {
  className?: string;
}

const App: React.FunctionComponent<IAppProps> = () => {
  const [isVisible, setVisible] = useState<boolean>(true)
  const {
    visible,
    messageParams = {
      message: '',
    },
  } = useMessageModel()
  useEffect(() => {
    ipcRenderer.on('SETTINGS_MODAL', (event: any, args: string) => {
      if (args === 'OPEN') {
        setVisible(true)
      }
    })
  }, [])
  return (
    <Fragment>
      <div className="app-side">
        <AppMenu />
        <ArticleList />
      </div>
      <div className="app-content">
        <ArticleView />
      </div>
      <SettingsModal visible={isVisible} onClose={() => setVisible(false)} />
      <div
        className="global-message"
        style={{ display: visible ? 'block' : 'none' }}>
        <div className="message-content"> {messageParams.message}</div>
      </div>
    </Fragment>
  )
}
export default App

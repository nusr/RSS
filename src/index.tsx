import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { Color, Titlebar as TitleBar } from 'custom-electron-titlebar'
import icon from './assets/images/icon.png'
import './icons'
const isWindows = process.platform === 'win32'

if (isWindows) {
  const titleBar = new TitleBar({
    backgroundColor: Color.fromHex('#444'),
    icon,
  })
  titleBar.updateTitle()
}

ReactDOM.render(<App />, document.getElementById('root'))

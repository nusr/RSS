import { Drawer } from '../Drawer'
import { shell, WebviewTag } from 'electron'
import React, { useEffect } from 'react'
import { SvgIcon } from '../SvgIcon'
import './index.less'

export interface IWebviewDrawerProps {
  visible: boolean;
  src: string;
  width: string | number;
  onClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

let webview: WebviewTag = null
const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36'
export const WebviewDrawer: React.FunctionComponent<IWebviewDrawerProps> = props => {
  const { src, onClose, visible, width } = props
  
  function handleCompassClick() {
    if (src) {
      shell.openExternal(src)
    }
  }
  
  function makeWebView(url: string) {
    if (webview) {
      webview.src = url
      return
    }
    const div = document.querySelector('.drawer-content.webview')
    if (div) {
      webview = document.createElement('webview')
      webview.src = url
      webview.useragent = userAgent
      div.appendChild(webview)
    }
  }
  
  useEffect(() => {
    if (visible && (!webview || webview.src !== src)) {
      setImmediate(() => {
        makeWebView(src)
      })
    }
  }, [src, visible])
  useEffect(() => {
    if (!visible && webview) {
      webview.remove()
      webview = null
    }
  }, [visible])
  return (
    <Drawer
      className="webview-drawer"
      visible={visible}
      onClose={onClose}
      width={width}>
      <div className="drawer-header">
        <div onClick={onClose}>
          <SvgIcon icon="close"/>
        </div>
        <div onClick={handleCompassClick}>
          <SvgIcon icon="compass"/>
        </div>
      </div>
      <div className="drawer-content webview"/>
    </Drawer>
  )
}

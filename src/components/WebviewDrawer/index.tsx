import { Drawer } from '../Drawer'
import { shell } from 'electron'
import React, { useEffect } from 'react'
import { SvgIcon } from '../SvgIcon'
import './index.less'

export interface IWebviewDrawerProps {
  visible: boolean;
  src: string;
  width: string | number;
  onClose: (e: any) => any;
}

let webview: any = null
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36'
const WebviewDrawer: React.FunctionComponent<IWebviewDrawerProps> = (props) => {
  const { src, onClose, visible, width } = props
  
  function handleCompassClick() {
    if (src) {
      shell.openExternal(src)
    }
  }
  
  function handleDrawerClose(e: any) {
    onClose(e)
    if (webview) {
      setTimeout(() => {
        if (
          props.visible === false &&
          webview.src === src
        ) {
          webview.remove()
          webview = null
        }
      }, 10 * 1000)
    }
  }
  
  function makeWebView(url: string) {
    if (webview) {
      webview.src = url
    } else {
      const div = document.querySelector('.drawer-content.webview')
      if (div) {
        webview = document.createElement('webview')
        webview.src = url
        webview.useragent = userAgent
        div.appendChild(webview)
      }
    }
  }
  
  useEffect(() => {
    if (visible && (!webview || webview.src !== src)) {
      setImmediate(() => {
        makeWebView(src)
      })
    }
  }, [src, visible])
  
  return (
    <Drawer
      className="webview-drawer"
      visible={visible}
      onClose={handleDrawerClose}
      width={width}>
      <div className="drawer-header">
        <div onClick={handleDrawerClose}>
          <SvgIcon icon="close"/>
        </div>
        <div
          onClick={handleCompassClick}>
          <SvgIcon icon="compass"/>
        </div>
      </div>
      <div className="drawer-content webview"/>
    </Drawer>
  )
}

export default WebviewDrawer

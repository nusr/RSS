import React, { useEffect } from 'react'
import {
  remote,
  ipcRenderer,
  OpenDialogOptions,
  SaveDialogOptions,
} from 'electron'
import './index.less'
const RSSFilters: OpenDialogOptions['filters'] = [
  { name: 'OPML', extensions: ['opml'] },
]
const options: SaveDialogOptions = {
  title: 'Save an OPML',
  filters: RSSFilters,
}
type ImportOPMLProps = {}
export const ImportOPML: React.FunctionComponent<ImportOPMLProps> = props => {
  const { children } = props
  const {dialog} = remote
  useEffect(() => {
    ipcRenderer.on('IMPORT_FORM_OPML', () => {
      dialog
        .showOpenDialog(null, {
          properties: ['openFile'],
          filters: RSSFilters,
        })
        .then(file => {
          console.info(file)
        })
    })

    ipcRenderer.on('EXPORT_TO_OPML', () => {
      dialog.showSaveDialog(null, options).then(fileName => {
        console.info(fileName)
      })
    })
  }, [])
  return <div className="ImportOPML">{children}</div>
}

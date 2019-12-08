import React, { useEffect } from 'react'
import {
  remote,
  ipcRenderer,
  OpenDialogOptions,
  SaveDialogOptions,
} from 'electron'
import { useFeedsModel, useUserModel } from '../../store'
import { importFromOPML, exportToOPML } from '../../utils'
import './index.less'
const RSSFilters: OpenDialogOptions['filters'] = [
  { name: 'OPML', extensions: ['opml'] },
]
const options: SaveDialogOptions = {
  title: 'Save an OPML',
  filters: RSSFilters,
}
type ImportOPMLProps = {}
const { dialog } = remote
export const ImportOPML: React.FunctionComponent<ImportOPMLProps> = props => {
  const { children } = props
  const { feedList = [], asyncBatchCreateFeed } = useFeedsModel()
  const { setAccount } = useUserModel()
  useEffect(() => {
    ipcRenderer.on('IMPORT_FORM_OPML', () => {
      dialog
        .showOpenDialog({
          properties: ['openFile'],
          filters: RSSFilters,
        })
        .then(({ canceled, filePaths = [] }) => {
          const [filePath] = filePaths
          if (canceled || !filePath) {
            return
          }
          importFromOPML(filePath).then(({ title, feeds }) => {
            asyncBatchCreateFeed(feeds)
            setAccount(title)
          })
        })
    })
  }, [])
  useEffect(() => {
    ipcRenderer.on('EXPORT_TO_OPML', () => {
      dialog.showSaveDialog(options).then(({ canceled, filePath }) => {
        if (canceled || !filePath) {
          return
        }
        exportToOPML(feedList, filePath)
      })
    })
  }, [])
  return <div className="ImportOPML">{children}</div>
}

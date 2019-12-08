import { Modal } from '../Modal'
import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { IFeed } from '../../shared'
import { Settings } from '../Settings'
import { useLanguageModel, useFeedsModel } from '../../store'
import { LANGUAGE_MAP } from '../../locales'
import './index.less'
const LanguageList = Object.values(LANGUAGE_MAP)
type ISettingsModalOwnProps = {}

export const SettingsModal: React.FunctionComponent<ISettingsModalOwnProps> = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const { feedList = [], asyncDeleteFeeds } = useFeedsModel()
  const { language = '', setLanguage, getLanguageData } = useLanguageModel()
  const [allFeeds, setFeeds] = useState<IFeed[]>(feedList)
  const [needDeletedIds, setDeletedIds] = useState<string[]>([])
  useEffect(() => {
    ipcRenderer.on('SETTINGS_MODAL', (event: Event, args: string) => {
      if (args === 'OPEN') {
        setVisible(true)
      }
    })
  }, [])
  useEffect(() => {
    if (visible) {
      setFeeds(feedList)
    }
  }, [feedList, visible])
  function handleOk() {
    if (needDeletedIds.length) {
      asyncDeleteFeeds(needDeletedIds)
    }
    setVisible(false)
  }

  function handleDeleteFeed(feedId: string) {
    setFeeds(allFeeds.filter((item: IFeed) => item.id !== feedId))
    setDeletedIds([...needDeletedIds, feedId])
  }
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLanguage(e.target.value as LANGUAGE_MAP)
  }

  return (
    <Modal
      className="settings-modal"
      title={getLanguageData('settings')}
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}>
      <div className="settings-content">
        <div className="languages-setting">
          <div className="settings-item-title">
            {getLanguageData('languages')}
          </div>
          <select className="select" onChange={handleChange} value={language}>
            {LanguageList.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="feeds-setting">
          <div className="settings-item-title">{getLanguageData('feeds')}</div>
          <Settings feeds={allFeeds} onDeleteFeed={handleDeleteFeed} />
        </div>
      </div>
    </Modal>
  )
}

import { Modal } from '../Modal'
import React, { useEffect, useState } from 'react'
import { IFeed } from '../../shared'
import {Settings} from '../Settings'
import { useLanguageModel, useFeedsModel } from '../../store'
import { LANGUAGE_KEY_TYPE } from '../../locales'
import './index.less'
const LanguageList: LANGUAGE_KEY_TYPE[] = ['en-US', 'zh-CN']
type ISettingsModalOwnProps = {
  visible: boolean;
  onClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const SettingsModal: React.FunctionComponent<ISettingsModalOwnProps> = ({
  visible,
  onClose,
}) => {
  const { feedList = [], asyncDeleteFeeds } = useFeedsModel()
  const { language, setLanguage, getLanguageData } = useLanguageModel()
  const [allFeeds, setFeeds] = useState<IFeed[]>(feedList)
  const [needDeletedIds, setDeletedIds] = useState<string[]>([])
  useEffect(() => {
    if (visible) {
      setFeeds(feedList)
    }
  }, [feedList, visible])
  function handleOk(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (needDeletedIds.length) {
      asyncDeleteFeeds(needDeletedIds)
    }
    onClose(e)
  }

  function handleDeleteFeed(feedId: string) {
    setFeeds(allFeeds.filter((item: IFeed) => item._id !== feedId))
    setDeletedIds([...needDeletedIds, feedId])
  }
  function handleChange(e) {
    setLanguage(e.target.value)
  }

  return (
    <Modal
      className="settings-modal"
      title={getLanguageData('settings')}
      visible={visible}
      onCancel={onClose}
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


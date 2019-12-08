import { Modal } from '../Modal'
import React, { useState } from 'react'
import Toast from '../Toast'
import { useLanguageModel } from '../../store'
import './index.less'

export interface IAddFeedProps {
  visible: boolean;
  onOk: (feedUrl: string) => void;
  onCancel: () => void;
}

enum KeyMap {
  ENTER = 13,
}

export const AddFeed: React.FunctionComponent<IAddFeedProps> = props => {
  const { getLanguageData } = useLanguageModel()
  const { onOk, visible, onCancel } = props
  const [feedUrl, setFeedUrl] = useState<string>('')

  function handleSubmit() {
    const temp = feedUrl.trim()
    if (
      /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(
        temp
      )
    ) {
      onOk(temp)
    } else {
      Toast({
        content: getLanguageData('invalidFeedUrl'),
        duration: 0,
      })
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.keyCode !== KeyMap.ENTER) {
      return
    }
    handleSubmit()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFeedUrl(e.target.value)
  }

  function onClose() {
    onCancel()
    setFeedUrl('')
  }

  return (
    <Modal
      className="add-feed-modal"
      title={getLanguageData('addFeed')}
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}>
      <input
        className="input-feed-url"
        placeholder={getLanguageData('feedUrl')}
        value={feedUrl}
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />
    </Modal>
  )
}

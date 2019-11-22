import { Modal } from '../Modal'
import React, { useState } from 'react'
import { useLanguageModel, useMessageModel } from '../../store'
import './index.less'

export interface IAddFeedModalProps {
  visible: boolean
  onOk: (feedUrl: string) => void
  onCancel: () => void
}

enum KeyMap {
  ENTER = 13,
}

export const AddFeedModal: React.FunctionComponent<IAddFeedModalProps> = props => {
  const { getLanguageData } = useLanguageModel()
  const { setMessageParams } = useMessageModel()
  const { onOk, visible, onCancel } = props
  const [feedUrl, setFeedUrl] = useState<string>('')
  function handleSubmit(event: any) {
    if (event.keyCode !== KeyMap.ENTER) {
      return
    }
    const temp = feedUrl.trim()
    if (
      /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(
        temp
      )
    ) {
      onOk(temp)
    } else {
      setMessageParams({
        message: getLanguageData('invalidFeedUrl'),
      })
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      width={376}
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}>
      <input
        className="input-feed-url"
        placeholder={getLanguageData('feedUrl')}
        value={feedUrl}
        onChange={handleChange}
        onKeyDown={handleSubmit}
      />
    </Modal>
  )
}

import { createModel } from 'hox'
import { useState } from 'react'
type MessageParams = {
  top?: number;
  message: string;
  time?: number;
}
type MessageState = {
  visible: boolean;
  setVisible(value: boolean): void;
  messageParams: MessageParams;
  setMessageParams(value: MessageParams): void;
}
function useMessage() {
  const [visible, setVisible] = useState<boolean>(true)
  const [messageParams, setMessage] = useState<MessageParams>()
  const setMessageParams = (data: MessageParams) => {
    const time = data.time || 1000
    setVisible(true)
    setMessage(data)
    setTimeout(() => {
      setVisible(false)
    }, time)
  }
  return {
    visible,
    setVisible,
    messageParams,
    setMessageParams,
  }
}

export default createModel<MessageState>(useMessage)

import { createModel } from 'hox'
import { useState } from 'react'

type OnlineState = {
  onlineStatus: boolean;
  setOnlineStatus(onlineStatus: boolean): void;
}
function useOnline() {
  const [onlineStatus, setStatus] = useState<boolean>(true)
  const setOnlineStatus = () => setStatus(navigator.onLine)
  return {
    onlineStatus,
    setOnlineStatus,
  }
}

export default createModel<OnlineState>(useOnline)

import { createModel } from 'hox'
import { useState } from 'react'
import { ACCOUNT_KEY } from '../shared'
type UserState = {
  userAccount: string
  setAccount(account: string): void
}
function useUser() {
  const [userAccount, setUserAccount] = useState<string>(
    localStorage.getItem(ACCOUNT_KEY)
  )
  const setAccount = (account: string) => {
    setUserAccount(account)
    localStorage.setItem(ACCOUNT_KEY, account)
  }
  return {
    userAccount,
    setAccount,
  }
}

export default createModel<UserState>(useUser)

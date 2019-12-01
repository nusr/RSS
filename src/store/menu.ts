import { createModel } from 'hox'
import { useState } from 'react'
import { EMenuKey, IFeed } from '../shared'
type MenuState = {
  selectedKey: string;
  setSelectedKey: React.Dispatch<React.SetStateAction<string | EMenuKey>>;
  toggleMenu(): void;
  showMenu: boolean;
  getCurrentFeed(feedList: IFeed[]): IFeed | undefined;
}
const MenuKeyDefault = EMenuKey.ALL_ITEMS
function useMenu() {
  const [selectedKey, setSelectedKey] = useState<string | EMenuKey>(
    MenuKeyDefault
  )
  const [showMenu, setShowMenu] = useState<boolean>(true)
  const getCurrentFeed = (feedList: IFeed[]) => {
    const feed = feedList.find((item: IFeed) => item.id === selectedKey)
    return feed
  }
  const toggleMenu = () => setShowMenu(!showMenu)
  return {
    selectedKey,
    setSelectedKey,
    toggleMenu,
    showMenu,
    getCurrentFeed,
  }
}

export default createModel<MenuState>(useMenu)

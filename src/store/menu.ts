import { createModel } from 'hox'
import { useState } from 'react'
import { EMenuKey } from '../shared'
type MenuState = {
  selectedKey: string;
  setSelectedKey: React.Dispatch<React.SetStateAction<string | EMenuKey>>;
  toggleMenu(): void;
  showMenu: boolean;
}
const MenuKeyDefault = EMenuKey.ALL_ITEMS
function useMenu() {
  const [selectedKey, setSelectedKey] = useState<string | EMenuKey>(
    MenuKeyDefault
  )
  const [showMenu, setShowMenu] = useState<boolean>(true)
  const toggleMenu = () => setShowMenu(!showMenu)
  return {
    selectedKey,
    setSelectedKey,
    toggleMenu,
    showMenu,
  }
}

export default createModel<MenuState>(useMenu)

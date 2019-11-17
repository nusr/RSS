import { createModel } from 'hox'
import { useState } from 'react'
import { EMenuKey, IFeed } from '../schemas'
import useFeedsModel from './feeds'
import useArticlesModel from './articles'

const MenuKeyDefault = EMenuKey.ALL_ITEMS

function useMenu() {
  const { fetchArticles } = useArticlesModel()
  const { feedList, setCurrentFeed } = useFeedsModel()
  const [selectedKey, setMenuKey] = useState<string | EMenuKey>(MenuKeyDefault)
  const [showMenu, setShowMenu] = useState<boolean>(true)
  const setSelectedKey = (menuKey: string | EMenuKey) => {
    setMenuKey(menuKey)
    if (menuKey in EMenuKey) {
      // 点击主目录
      fetchArticles(menuKey)
    } else if (feedList.some((item: IFeed) => item._id === menuKey)) {
      // 点击订阅
      const feed: IFeed = feedList.find((item: IFeed) => item._id === menuKey)
      setCurrentFeed(feed)
      fetchArticles(menuKey)
    }
  }
  const toggleMenu = () => setShowMenu(!showMenu)
  return {
    selectedKey,
    setSelectedKey,
    toggleMenu,
    showMenu
  }
}

export default createModel<any>(useMenu)

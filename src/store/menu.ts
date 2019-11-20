import { createModel } from 'hox'
import { useState } from 'react'
import { EMenuKey, IFeed } from '../schemas'
import useFeedsModel from './feeds'
import useArticlesModel from './articles'

const MenuKeyDefault = EMenuKey.ALL_ITEMS

function useMenu() {
  const { asyncFetchArticles } = useArticlesModel()
  const { feedList } = useFeedsModel()
  const [selectedKey, setMenuKey] = useState<string | EMenuKey>(MenuKeyDefault)
  const [showMenu, setShowMenu] = useState<boolean>(true)
  const setSelectedKey = (menuKey: string | EMenuKey) => {
    setMenuKey(menuKey)
    if (menuKey in EMenuKey) {
      // 点击主目录
      asyncFetchArticles(menuKey, feedList)
    } else if (feedList.some((item: IFeed) => item._id === menuKey)) {
      // 点击订阅
      asyncFetchArticles(menuKey, feedList)
    }
  }
  const getCurrentFeed = () => {
    const feed: IFeed | null = feedList.find(
      (item: IFeed) => item._id === selectedKey
    )
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

export default createModel<any>(useMenu)

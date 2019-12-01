import { Avatar } from '../Avatar'
import { SvgIcon, IconType } from '../SvgIcon'
import React, { Fragment, useState, useEffect } from 'react'
import { EMenuKey } from '../../shared'
import { AddFeed } from '../AddFeed'
import Logo from '../../assets/images/icon.png'
import {
  useMenuModel,
  useFeedsModel,
  useOnlineModel,
  useLanguageModel,
  useArticlesModel,
} from '../../store'
import './index.less'
type MenuItemType = {
  key: EMenuKey;
  icon: IconType;
  title: string;
}
const DEFAULT_MENUS: MenuItemType[] = [
  {
    key: EMenuKey.ALL_ITEMS,
    icon: 'all',
    title: 'menuAllItems',
  },
  {
    key: EMenuKey.STARRED_ITEMS,
    icon: 'star-outlined',
    title: 'menuStarred',
  },
]
type AppMenuProps = {}
type ArticleNumProps = {
  count: number;
}
const ArticleNum: React.FunctionComponent<ArticleNumProps> = ({ count }) => {
  if (count <= 0) {
    return null
  }
  return <div>{count}</div>
}
export const AppMenu: React.FunctionComponent<AppMenuProps> = () => {
  const { getLanguageData } = useLanguageModel()
  const { selectedKey, setSelectedKey, showMenu } = useMenuModel()
  const { onlineStatus, setOnlineStatus } = useOnlineModel()
  const { countArticlesNum } = useArticlesModel()
  const {
    feedList = [],
    asyncFetchAllFeeds,
    isUpdating,
    isCreating,
    asyncCreateFeed,
  } = useFeedsModel()
  const isReady = isCreating || isUpdating
  const [isVisible, setVisible] = useState<boolean>(false)
  function handleUpdateFeedsClick() {
    if (isUpdating || feedList.length === 0) {
      return
    }
    asyncFetchAllFeeds(true)
  }
  /* eslint-disable */
  useEffect(() => {
    asyncFetchAllFeeds()
    const setStatus = () => setOnlineStatus
    window.addEventListener('online', setStatus)
    window.addEventListener('offline', setStatus)
    return () => {
      window.removeEventListener('online', setStatus)
      window.removeEventListener('offline', setStatus)
    }
  }, [])
  /* eslint-enable */
  const handleAddFeedModalOk = (feedUrl: string) => {
    setVisible(false)
    asyncCreateFeed(feedUrl)
  }
  const getItemClassName = (value: string) => {
    return (selectedKey === value ? 'selected' : '') + ' item'
  }
  function handleSelect(menuKey: string | EMenuKey) {
    if (menuKey) {
      setSelectedKey(menuKey)
    }
  }
  let style: React.CSSProperties = {
    display: 'block',
    width: 386,
  }
  if (!showMenu) {
    style = {
      display: 'none',
    }
  }
  return (
    <div className="app-menu" style={style}>
      <div className="menu-content">
        <div className="menu-header">
          <Avatar src={Logo} />
          <div className="date-text">{new Date().toDateString()}</div>
          {isReady && <div>sync...</div>}
        </div>
        {DEFAULT_MENUS.map(({ key, icon, title }) => (
          <div
            key={key}
            className={getItemClassName(key)}
            onClick={() => handleSelect(key)}>
            <div className="content">
              <SvgIcon icon={icon} />
              <div className="menu-title">{getLanguageData(title)}</div>
            </div>
            <ArticleNum count={countArticlesNum[key]} />
          </div>
        ))}
        {feedList.map(({ id = '', favicon, title }) => (
          <div
            key={id}
            className={getItemClassName(id)}
            onClick={() => handleSelect(id)}>
            <div className="content">
              <Avatar size={22} src={favicon} default />
              <div className="menu-title" title={title}>
                {title}
              </div>
            </div>
            <ArticleNum count={countArticlesNum[id]} />
          </div>
        ))}
      </div>
      <div className="menu-footer">
        <div>
          {onlineStatus && (
            <SvgIcon
              icon="refresh"
              className={isReady ? 'menu-ready' : ''}
              onClick={handleUpdateFeedsClick}
            />
          )}
        </div>
        <div>
          {onlineStatus ? (
            <SvgIcon icon="plus" onClick={() => setVisible(true)} />
          ) : (
            <Fragment>
              <SvgIcon icon="warning" color="#faad14" />
              <span>OFFLINE</span>
            </Fragment>
          )}
        </div>
        <AddFeed
          visible={isVisible}
          onOk={handleAddFeedModalOk}
          onCancel={() => setVisible(false)}
        />
      </div>
    </div>
  )
}

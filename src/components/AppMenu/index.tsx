import { Avatar } from '../Avatar'
import { SvgIcon, IconType } from '../SvgIcon'
import React, { Fragment, useState, useEffect } from 'react'
import { EMenuKey } from '../../schemas'
import { AddFeedModal } from '../AddFeedModal'
import Logo from '../../assets/images/icon.png'
import {
  useMenuModel,
  useFeedsModel,
  useOnlineModel,
  useLanguageModel,
} from '../../store'
import './index.less'
type MenuItemType = {
  key: EMenuKey
  icon: IconType
  title: string
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
  {
    key: EMenuKey.UNREAD_ITEMS,
    icon: 'file-text',
    title: 'menuUnread',
  },
]

export const AppMenuComponent: React.FunctionComponent<any> = () => {
  const { getLanguageData } = useLanguageModel()
  const { selectedKey, setSelectedKey, showMenu } = useMenuModel()
  const { onlineStatus, setOnlineStatus } = useOnlineModel()
  const {
    feedList = [],
    getAllFeeds,
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
    getAllFeeds(true)
  }

  /* eslint-disable */
  useEffect(() => {
    getAllFeeds()
    window.addEventListener('online', setOnlineStatus)
    window.addEventListener('offline', setOnlineStatus)
    return () => {
      window.removeEventListener('online', setOnlineStatus)
      window.removeEventListener('offline', setOnlineStatus)
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
  return (
    <div className="app-menu" style={{ display: showMenu ? 'block' : 'none' }}>
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
            onClick={() => setSelectedKey(key)}>
            <div className="content">
              <SvgIcon icon={icon} />
              <div className="menu-title">{getLanguageData(title)}</div>
            </div>
            <div>22</div>
          </div>
        ))}
        {feedList.map(({ _id, favicon, title }) => (
          <div
            key={_id}
            className={getItemClassName(_id)}
            onClick={() => setSelectedKey(_id)}>
            <div className="content">
              {favicon ? (
                <Avatar size={22} src={favicon} />
              ) : (
                <SvgIcon icon="rss" size={22} />
              )}

              <div className="menu-title" title={title}>
                {title}
              </div>
            </div>
            <div>22</div>
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
        <AddFeedModal
          visible={isVisible}
          onOk={handleAddFeedModalOk}
          onCancel={() => setVisible(false)}
        />
      </div>
    </div>
  )
}

export default AppMenuComponent

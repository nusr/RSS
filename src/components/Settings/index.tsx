import React from 'react'
import { Avatar } from '../Avatar'
import { IFeed } from '../../shared'
import { Button } from '../Button'
import { useLanguageModel } from '../../store'
import './index.less'

export interface ISettingsProps {
  feeds: IFeed[];
  onDeleteFeed?: (feedId: string) => void;
}

export const Settings: React.FunctionComponent<ISettingsProps> = props => {
  const { onDeleteFeed, feeds } = props
  const { getLanguageData } = useLanguageModel()

  function handleDeleteClick(feedId: string) {
    if (onDeleteFeed) {
      onDeleteFeed(feedId)
    }
  }

  return (
    <div className="setting-feed-list">
      <div className="setting-feed">
        {feeds.map(({ id = '', title, favicon }) => (
          <div className="setting-feed-item" key={id}>
            <div title={id} className="feed-item-content">
              <Avatar size={16} src={favicon} />
              {title}
            </div>
            <div>
              <Button type="danger" onClick={() => handleDeleteClick(id)}>
                {getLanguageData('delete')}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {!feeds.length && (
        <div className="empty-list">{getLanguageData('noFeeds')}</div>
      )}
    </div>
  )
}

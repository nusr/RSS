import React from 'react'
import { Avatar } from '../Avatar'
import { IFeed } from '../../shared'
import { Button } from '../Button'
import { useLanguageModel } from '../../store'
import './index.less'

export interface ISettingFeedListProps {
  feeds: IFeed[];
  onDeleteFeed?: (feedId: string) => void;
}

export const SettingFeedList: React.FunctionComponent<ISettingFeedListProps> = props => {
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
        {feeds.map((feed: IFeed) => (
          <div className="setting-feed-item" key={feed._id}>
            <div title={feed.url} className="feed-item-content">
              <Avatar size={16} src={feed.favicon} />
              {feed.title}
            </div>
            <div>
              <Button type="danger" onClick={() => handleDeleteClick(feed._id)}>
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


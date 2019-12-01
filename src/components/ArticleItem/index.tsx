import React from 'react'
import { Avatar } from '../Avatar'
import { SvgIcon } from '../SvgIcon'
import { timeToTimeString } from '../../utils'
import { IArticle } from '../../shared'
import './index.less'
import { useLanguageModel, useFeedsModel } from '../../store'

export interface IArticleItemOwnProps {
  data: IArticle;
  className: string;
}

export const ArticleItem: React.FunctionComponent<IArticleItemOwnProps> = props => {
  const { data, className } = props
  const { getLanguageData } = useLanguageModel()
  const { getCurrentFeed } = useFeedsModel()
  const currentFeed = getCurrentFeed(data.feedId) || {
    favicon: '',
    title: '',
  }
  const dateTime = timeToTimeString(data.time)
  const { favicon, title } = currentFeed
  const feedTitle = title || getLanguageData('unknown')
  return (
    <div className={'article-item ' + className}>
      <div className="item-sider">
        {favicon ? (
          <Avatar size={22} src={favicon} />
        ) : (
          <SvgIcon icon="rss" size={22} />
        )}
      </div>
      <div className="item-main">
        <div className="item-header">
          <div>{feedTitle}</div>
          <div>{dateTime}</div>
        </div>
        <div>
          <div className="item-title">{data.title}</div>
          <div
            className="item-summary"
            dangerouslySetInnerHTML={{ __html: data.summary }}
          />
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Avatar } from '../Avatar'
import { SvgIcon } from '../SvgIcon'
import Utils from '../../utils'
import { IArticle } from '../../shared'
import './index.less'
import { useLanguageModel, useMenuModel, useFeedsModel } from '../../store'

export interface IArticleItemOwnProps {
  data: IArticle;
  className: string;
}

export const ArticleItem: React.FunctionComponent<IArticleItemOwnProps> = props => {
  const { data, className } = props
  const { getLanguageData } = useLanguageModel()
  const { feedList } = useFeedsModel()
  const { getCurrentFeed } = useMenuModel()
  const currentFeed = getCurrentFeed(feedList) || { favicon: '', title: '' }
  const dateTime = Utils.timeToTimeString(data.time)
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

import React from 'react'
import { Avatar } from '../Avatar'
import { SvgIcon } from '../SvgIcon'
import Utils from '../../utils'
import { IArticle } from '../../schemas'
import './index.less'
import { useLanguageModel, useMenuModel } from '../../store'

export interface IArticleItemOwnProps {
  data: IArticle;
  className: string;
}

const ArticleItem: React.FunctionComponent<IArticleItemOwnProps> = props => {
  const { data, className } = props
  const { getLanguageData } = useLanguageModel()
  const { getCurrentFeed } = useMenuModel()
  const currentFeed = getCurrentFeed() || ''
  const dateTime = Utils.timeToTimeString(data.time)
  const {favicon} = currentFeed
  const feedTitle = currentFeed.title || getLanguageData('unknown')
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

export default ArticleItem

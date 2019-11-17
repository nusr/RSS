import React from 'react'
import { Avatar } from '../Avatar'
import defaultFavicon from '../../assets/images/rss.png'
import Utils from '../../utils'
import { IArticle } from '../../schemas'
import './index.less'
import { useLanguageModel, useFeedsModel } from '../../store'

export interface IArticleItemOwnProps {
  data: IArticle;
  className: string;
}

const ArticleItem: React.FunctionComponent<IArticleItemOwnProps> = (props) => {
  const {
    data,
    className,
  } = props
  const { getLanguageData } = useLanguageModel()
  const { currentFeed = '' } = useFeedsModel()
  const dateTime = Utils.timeToTimeString(data.time)
  const feedTitle = currentFeed.title || getLanguageData('unknown')
  const feedFavicon = currentFeed.favicon || defaultFavicon
  return (
    <div className={'article-item ' + className}>
      <div className="item-sider">
        <Avatar size={22} src={feedFavicon}>
          {feedTitle}
        </Avatar>
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

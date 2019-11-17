import { Empty } from '../Empty'
import React, { useState } from 'react'
import ArticleItem from '../ArticleItem'
import { IArticle } from '../../schemas'
import Utils from '../../utils'
import './index.less'
import { useArticlesModel } from '../../store'
// import { useMenuModel } from '../store'
type ArticleVirtualListProps = {
  articleList: IArticle[];
  currentArticle?: IArticle;
  scrollToIndex?: number;
}

const Index: React.FunctionComponent<ArticleVirtualListProps> = props => {
  const { articleList = [], currentArticle } = props
  const [readItems, setItems] = useState<{ [_id: string]: boolean }>({})
  const { asyncReadArticle } = useArticlesModel()

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const { target } = e
    const $item = (target as HTMLDivElement).closest('.vlist-item')
    if ($item) {
      const { id, index } = ($item as HTMLDivElement).dataset
      const article = currentArticle
      if (article && article._id === id) {
        // do nothing
      } else if (id && index) {
        asyncReadArticle(id)
        setItems({
          ...readItems,
          [id]: true,
        })
      }
    }
  }
  return (
    <div className="article-virtual-list" onClick={handleClick}>
      {articleList.map((article: IArticle, index: number) => {
        const isCurrent = currentArticle && article._id === currentArticle._id
        return (
          <div
            key={article._id}
            data-id={article._id}
            data-index={index}
            className={
              index === 0 ? 'vlist-item first-list-item' : 'vlist-item'
            }>
            {article.isDayFirst && (
              <div className="date-divid">
                {Utils.timeToDateString(article.time)}
              </div>
            )}
            <ArticleItem
              data={article}
              className={
                (article.isUnread && !readItems[article._id]
                  ? 'item-is-unread'
                  : '') + (isCurrent ? ' item-is-selected' : '')
              }
            />
          </div>
        )
      })}
      {articleList.length === 0 && (
        <div style={{ paddingTop: '30px' }}>
          <Empty />
        </div>
      )}
    </div>
  )
}

export default Index

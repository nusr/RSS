import React, { useState } from 'react'
import { ArticleItem } from '../ArticleItem'
import { IArticle } from '../../shared'
import Utils from '../../utils'
import './index.less'
import { useArticlesModel } from '../../store'
type ArticleVirtualListProps = {
  articles: IArticle[];
  currentArticle?: IArticle;
}

export const ArticleVirtualList: React.FunctionComponent<ArticleVirtualListProps> = props => {
  const { articles = [], currentArticle } = props
  const [readItems, setItems] = useState<{ [id: string]: boolean }>({})
  const { asyncReadArticle } = useArticlesModel()

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const { target } = e
    const itemDom = (target as HTMLDivElement).closest('.item')
    if (itemDom) {
      const { id } = (itemDom as HTMLDivElement).dataset
      if (currentArticle && currentArticle.id === id) {
        return
      }
      if (id) {
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
      {articles.map((article: IArticle, index: number) => {
        const isCurrent = currentArticle && article.id === currentArticle.id
        return (
          <div
            key={article.id}
            data-id={article.id}
            data-index={index}
            className="item">
            {article.isDayFirst && (
              <div className="date">{Utils.timeToDateString(article.time)}</div>
            )}
            <ArticleItem
              data={article}
              className={
                (article.isUnread && !readItems[article.id]
                  ? 'item-is-unread'
                  : '') + (isCurrent ? ' item-is-selected' : '')
              }
            />
          </div>
        )
      })}
    </div>
  )
}

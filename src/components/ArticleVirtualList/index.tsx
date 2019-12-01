import React, { useState } from 'react'
import { ArticleItem } from '../ArticleItem'
import { IArticle } from '../../shared'
import Utils from '../../utils'
import './index.less'
import { useArticlesModel } from '../../store'
type ArticleVirtualListProps = {
  articleList: IArticle[];
  currentArticle?: IArticle;
  scrollToIndex?: number;
}

export const ArticleVirtualList: React.FunctionComponent<ArticleVirtualListProps> = props => {
  const { articleList = [], currentArticle } = props
  const [readItems, setItems] = useState<{ [id: string]: boolean }>({})
  const { asyncReadArticle } = useArticlesModel()

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const { target } = e
    const $item = (target as HTMLDivElement).closest('.vlist-item')
    if ($item) {
      const { id, index } = ($item as HTMLDivElement).dataset
      const article = currentArticle
      if (article && article.id === id) {
        return
      }
      if (id && index) {
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
      {articleList.map((article: IArticle) => {
        const isCurrent = currentArticle && article.id === currentArticle.id
        return (
          <div key={article.id} data-id={article.id} className="vlist-item">
            {article.isDayFirst && (
              <div className="date-divid">
                {Utils.timeToDateString(article.time)}
              </div>
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

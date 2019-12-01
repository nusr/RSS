import { SvgIcon, IconType } from '../SvgIcon'
import React, { useState } from 'react'
import { ArticleVirtualList } from '../ArticleVirtualList'
import { SearchArticle } from '../SearchArticle'
import { EArticleFilter, IArticle } from '../../shared'
import { ArticleListSkeleton } from '../skeletons/ArticleListSkeleton'
import { useArticlesModel, useFeedsModel } from '../../store'
import './index.less'
type StatusItem = {
  icon: IconType;
  status: EArticleFilter;
}
const StatusList: StatusItem[] = [
  {
    status: EArticleFilter.STARRED,
    icon: 'star-filled',
  },
  {
    status: EArticleFilter.UNREAD,
    icon: 'dot-filled',
  },
  {
    status: EArticleFilter.ALL,
    icon: 'list-filled',
  },
]
type ArticleListProps = {}
export const ArticleList: React.FunctionComponent<ArticleListProps> = () => {
  const { feedList } = useFeedsModel()
  const {
    articleList,
    articleListData,
    isFetching,
    articleStatus,
    asyncSetAllArticlesRead,
    setArticleStatus,
  } = useArticlesModel()
  const [isVisible, setVisible] = useState<boolean>(false)
  const [showCheckAll, setShowCheckAll] = useState<boolean>(false)

  function readAllArticles() {
    const ids: string[] = articleListData
      .filter((article: IArticle) => article.isUnread)
      .map((article: IArticle) => article.id)
    asyncSetAllArticlesRead(ids)
  }
  const handleSearchItemChoose = (value: IArticle) => {
    setVisible(false)
    console.info(value)
  }
  return (
    <div className="article-list">
      <div className="list-header">
        <div className="list-header-right">
          <div className="radio-group">
            {StatusList.map(({ icon, status }) => (
              <div
                key={status}
                className={`radio ${
                  articleStatus === status ? 'selected' : ''
                }`}
                onClick={() => setArticleStatus(status)}>
                <SvgIcon icon={icon} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="list-content">
        <ArticleVirtualList articles={articleListData} />
      </div>
      <div className="list-footer">
        <div className="footer-top">
          <div
            className="list-footer-left"
            onClick={() => setShowCheckAll(true)}>
            <SvgIcon icon="check-circle" className="check-all" />
          </div>
          <div className="list-footer-right" onClick={() => setVisible(true)}>
            <SvgIcon icon="search" className="search-item" />
          </div>
        </div>
        <div style={{ display: showCheckAll ? 'block' : 'none' }}>
          <div className="check-item" onClick={() => setShowCheckAll(false)}>
            cancel
          </div>
          <div className="check-item" onClick={readAllArticles}>
            Check All
          </div>
        </div>
      </div>
      <ArticleListSkeleton
        row={8}
        style={{
          display: isFetching && feedList.length ? 'block' : 'none',
        }}
      />
      <SearchArticle
        articles={articleList}
        visible={isVisible}
        onCancel={() => setVisible(false)}
        onItemChoose={handleSearchItemChoose}
      />
    </div>
  )
}

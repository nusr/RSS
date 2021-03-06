import { SvgIcon, IconType } from '../SvgIcon'
import React, { useState } from 'react'
import { ArticleVirtualList } from '../ArticleVirtualList'
import { EArticleFilter, IArticle } from '../../shared'
import { ArticleListSkeleton } from '../Skeletons/ArticleListSkeleton'
import { useArticlesModel, useFeedsModel, useLanguageModel } from '../../store'
import { throttle } from '../../utils'
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
  const { getLanguageData } = useLanguageModel()
  const {
    articleListData,
    isFetching,
    articleStatus,
    asyncSetAllArticlesRead,
    setArticleStatus,
    searchValue,
    setSearchValue,
  } = useArticlesModel()
  const [isVisible, setVisible] = useState<boolean>(false)
  const [showCheckAll, setShowCheckAll] = useState<boolean>(false)
  function readAllArticles() {
    const ids: string[] = articleListData
      .filter((article: IArticle) => article.isUnread)
      .map((article: IArticle) => article.id)
    asyncSetAllArticlesRead(ids)
  }
  function handleCheck() {
    setVisible(false)
    setShowCheckAll(!showCheckAll)
  }
  function handleSearch() {
    setShowCheckAll(false)
    setVisible(!isVisible)
  }
  const handleChange = throttle((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }, 1000)
  const articleNum = articleListData.length
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
          <div className="list-footer-left" onClick={handleCheck}>
            <SvgIcon icon="check-circle" className="check-all" />
          </div>
          {isVisible ? (
            <div>
              <input
                className="search"
                value={searchValue}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div>
              {articleListData.length > 0 ? `${articleNum} items` : 'No items'}
            </div>
          )}

          <div className="list-footer-right" onClick={handleSearch}>
            <SvgIcon icon="search" className="search-item" />
          </div>
        </div>
        <div style={{ display: showCheckAll ? 'block' : 'none' }}>
          <div className="check-item" onClick={() => setShowCheckAll(false)}>
            {getLanguageData('cancel')}
          </div>
          <div className="check-item" onClick={readAllArticles}>
            {getLanguageData('readAll')}
          </div>
        </div>
      </div>
      <ArticleListSkeleton
        row={8}
        style={{
          display: isFetching && feedList.length ? 'block' : 'none',
        }}
      />
    </div>
  )
}

import { createModel } from 'hox'
import { useState } from 'react'
import { EMenuKey, IArticle, EArticleFilter, IFeed } from '../schemas'
import Logic from '../logic'
import useFeedsModel from './feeds'
import useMessageModel from './message'
import useLanguageModel from './language'
function useArticles() {
  const { setMessageParams } = useMessageModel()
  const { getLanguageData } = useLanguageModel()
  const { feedList } = useFeedsModel()
  const [currentArticle, setCurrentArticle] = useState<IArticle>()
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [articleList, setArticleList] = useState<IArticle[]>([])
  const [articleStatus, setArticleStatus] = useState<EArticleFilter>(
    EArticleFilter.ALL
  )
  const fetchArticles = (menuKey: string | EMenuKey) => {
    setIsFetching(true)
    const feedIds = feedList.map((feed: IFeed) => feed._id)
    const selector: PouchDB.Find.Selector = { feedId: { $in: feedIds } }
    switch (menuKey) {
      case EMenuKey.ALL_ITEMS:
        break
      case EMenuKey.STARRED_ITEMS:
        selector.isStarred = { $eq: true }
        break
      case EMenuKey.UNREAD_ITEMS:
        selector.isUnread = { $eq: true }
        break
      default:
        selector.feedId = { $eq: menuKey }
        break
    }
    if (selector.feedId) {
      if (articleStatus === 'STARRED') {
        selector.isStarred = { $eq: true }
      } else if (articleStatus === 'UNREAD') {
        selector.isUnread = { $eq: true }
      }
    }
    Logic.getArticles(selector).then((articles: IArticle[]) => {
      setIsFetching(false)
      setArticleList(articles)
    })
  }
  const asyncReadArticle = async (articleId: string) => {
    const article: IArticle | null = await Logic.getArticle(articleId)
    if (article) {
      await Logic.setArticleIsRead(articleId)
      setCurrentArticle(article)
    }
  }
  const asyncSetAllArticlesRead = (ids: string[]) => {
    Logic.setArticlesIsRead(ids).then(() => {
      setMessageParams({
        message: getLanguageData('doYouWantSetAllArticlesBeRead'),
      })
    })
  }
  const asyncStarArticle = async (articleId: string, isStar: boolean) => {
    await Logic.setArticleIsStarred(articleId, isStar)
  }
  return {
    currentArticle,
    setCurrentArticle,
    articleList,
    setArticleList,
    isFetching,
    setIsFetching,
    setArticleStatus,
    articleStatus,
    fetchArticles,
    asyncReadArticle,
    asyncStarArticle,
    asyncSetAllArticlesRead,
  }
}

export default createModel<any>(useArticles)

import { createModel } from 'hox'
import { useState } from 'react'
import { EMenuKey, IArticle, EArticleFilter, IFeed } from '../shared'
import Logic from '../service'
import useMessageModel from './message'
import useLanguageModel from './language'
type ArticlesState = {
  currentArticle: IArticle;
  setCurrentArticle: React.Dispatch<React.SetStateAction<IArticle>>;
  articleList: IArticle[];
  setArticleList: React.Dispatch<React.SetStateAction<IArticle[]>>;
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setArticleStatus: React.Dispatch<React.SetStateAction<EArticleFilter>>;
  articleStatus: EArticleFilter;
  asyncFetchArticles(menuKey: string | EMenuKey, feedList: IFeed[]): void;
  asyncReadArticle(articleId: string): void;
  asyncStarArticle(articleId: string, isStar: boolean): void;
  asyncSetAllArticlesRead(ids: string[]): void;
}
function useArticles() {
  const { setMessageParams } = useMessageModel()
  const { getLanguageData } = useLanguageModel()
  const [currentArticle, setCurrentArticle] = useState<IArticle>()
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [articleList, setArticleList] = useState<IArticle[]>([])
  const [articleStatus, setArticleStatus] = useState<EArticleFilter>(
    EArticleFilter.ALL
  )
  const asyncFetchArticles = (
    menuKey: string | EMenuKey,
    feedList: IFeed[]
  ) => {
    setIsFetching(true)
    const feedIds = feedList.map((feed: IFeed) => feed.id)
    const selector: PouchDB.Find.Selector = { feedId: { $in: feedIds } }
    switch (menuKey) {
      case EMenuKey.ALL_ITEMS:
        break
      case EMenuKey.STARRED_ITEMS:
        selector.isStarred = { $eq: true }
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
    Logic.getAllArticles().then((articles: IArticle[]) => {
      setIsFetching(false)
      setArticleList(articles)
    })
  }
  const asyncReadArticle = async (articleId: string) => {
    console.info(articleId)
    // const article: IArticle | null = await Logic.getArticle(articleId)
    // if (article) {
    //   await Logic.setArticleIsRead(articleId)
    //   setCurrentArticle(article)
    // }
  }
  const asyncSetAllArticlesRead = (ids: string[]) => {
    Logic.setArticlesIsRead(ids).then(() => {
      setMessageParams({
        message: getLanguageData('doYouWantSetAllArticlesBeRead'),
      })
    })
  }
  const asyncStarArticle = async (articleId: string, isStar: boolean) => {
    return await Logic.setArticleIsStarred(articleId, isStar)
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
    asyncFetchArticles,
    asyncReadArticle,
    asyncStarArticle,
    asyncSetAllArticlesRead,
  }
}

export default createModel<ArticlesState>(useArticles)

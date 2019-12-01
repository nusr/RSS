import { createModel } from 'hox'
import { useState, useEffect } from 'react'
import { EMenuKey, IArticle, EArticleFilter } from '../shared'
import Services from '../service'
import useMessageModel from './message'
import useLanguageModel from './language'
import useMenuModel from './menu'
type ArticlesState = {
  currentArticle: IArticle;
  setCurrentArticle: React.Dispatch<React.SetStateAction<IArticle>>;
  articleList: IArticle[];
  articleListData: IArticle[];
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setArticleStatus: React.Dispatch<React.SetStateAction<EArticleFilter>>;
  articleStatus: EArticleFilter;
  asyncFetchAllArticles(): void;
  asyncReadArticle(articleId: string): void;
  asyncStarArticle(articleId: string, isStar: boolean): void;
  asyncSetAllArticlesRead(ids: string[]): void;
}
function useArticles() {
  const { setMessageParams } = useMessageModel()
  const { getLanguageData } = useLanguageModel()
  const { selectedKey } = useMenuModel()
  const [currentArticle, setCurrentArticle] = useState<IArticle>()
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [articleList, setArticleList] = useState<IArticle[]>([])
  const [articleListData, setArticleListData] = useState<IArticle[]>([])
  const [articleStatus, setArticleStatus] = useState<EArticleFilter>(
    EArticleFilter.ALL
  )
  useEffect(() => {
    if (isFetching) {
      return
    }
    let list = []
    const result = []
    switch (selectedKey) {
      case EMenuKey.ALL_ITEMS:
        list = articleList
        break
      case EMenuKey.STARRED_ITEMS:
        list = articleList.filter(item => item.isStarred)
        break
      default:
        list = articleList.filter(item => item.feedId === selectedKey)
        break
    }
    list.forEach(item => {
      if (articleStatus === 'STARRED') {
        item.isStarred && result.push(item)
      } else if (articleStatus === 'UNREAD') {
        item.isUnread && result.push(item)
      } else {
        result.push(item)
      }
    })
    console.info(result)
    setArticleListData(result)
  }, [selectedKey, articleList, articleStatus, isFetching])
  const asyncFetchAllArticles = async () => {
    setIsFetching(true)
    const articles = await Services.getAllArticles()
    setArticleList(articles)
    setIsFetching(false)
    return articles
  }

  const asyncReadArticle = async (articleId: string) => {
    const article: IArticle | null = await Services.getArticle(articleId)
    if (article) {
      await Services.setArticlesIsRead([articleId])
      setCurrentArticle(article)
    }
  }
  const asyncSetAllArticlesRead = (ids: string[]) => {
    Services.setArticlesIsRead(ids).then(() => {
      setMessageParams({
        message: getLanguageData('doYouWantSetAllArticlesBeRead'),
      })
    })
  }
  const asyncStarArticle = async (articleId: string, isStar: boolean) => {
    return await Services.setArticleIsStarred(articleId, isStar)
  }
  return {
    currentArticle,
    setCurrentArticle,
    articleList,
    articleListData,
    isFetching,
    setIsFetching,
    setArticleStatus,
    articleStatus,
    asyncFetchAllArticles,
    asyncReadArticle,
    asyncStarArticle,
    asyncSetAllArticlesRead,
  }
}

export default createModel<ArticlesState>(useArticles)

import { createModel } from 'hox'
import { useState, useEffect } from 'react'
import { EMenuKey, IArticle, EArticleFilter } from '../shared'
import Services from '../service'
import useMessageModel from './message'
import useLanguageModel from './language'
import useMenuModel from './menu'
type CountType = {
  [key: string]: number
}
type ArticlesState = {
  currentArticle: IArticle | undefined
  setCurrentArticle: React.Dispatch<React.SetStateAction<IArticle>>
  articleList: IArticle[]
  articleListData: IArticle[]
  isFetching: boolean
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>
  setArticleStatus: React.Dispatch<React.SetStateAction<EArticleFilter>>
  articleStatus: EArticleFilter
  searchValue: string
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
  asyncFetchAllArticles(): void
  asyncReadArticle(articleId: string): void
  asyncStarArticle(articleId: string, isStar: boolean): void
  asyncSetAllArticlesRead(ids: string[]): void
  countArticlesNum: CountType
}
function useArticles() {
  const { setMessageParams } = useMessageModel()
  const { getLanguageData } = useLanguageModel()
  const { selectedKey } = useMenuModel()
  const [countArticlesNum, setCountArticlesNum] = useState<CountType>({})
  const [currentArticle, setCurrentArticle] = useState<IArticle>()
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [articleList, setArticleList] = useState<IArticle[]>([])
  const [articleListData, setArticleListData] = useState<IArticle[]>([])
  const [articleStatus, setArticleStatus] = useState<EArticleFilter>(
    EArticleFilter.ALL
  )
  const [searchValue, setSearchValue] = useState<string>('')
  useEffect(() => {
    if (isFetching) {
      return
    }
    let list: IArticle[] = []
    let result: IArticle[] = []
    // 右侧筛选
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
    // 中间栏状态筛选
    list.forEach(item => {
      if (articleStatus === 'STARRED') {
        item.isStarred && result.push(item)
      } else if (articleStatus === 'UNREAD') {
        item.isUnread && result.push(item)
      } else {
        result.push(item)
      }
    })
    list = result
    // 搜索
    if (searchValue) {
      const keys = searchValue
        .split(' ')
        .map(key => key.trim())
        .filter(key => !!key)
      const len = keys.length
      result = list.filter((article: IArticle) => {
        const str = article.title + article.author + article.summary
        let i = 0
        for (; i < len; i++) {
          if (str.indexOf(keys[i]) >= 0) {
            return true
          }
        }
        return false
      })
    }

    console.info(result)
    setArticleListData(result)
  }, [selectedKey, articleList, articleStatus, isFetching, searchValue])

  const getMenuCount = (articles: IArticle[]) => {
    const starKey = EMenuKey.STARRED_ITEMS
    const result: CountType = {
      [EMenuKey.ALL_ITEMS]: articles.length,
      [starKey]: 0,
    }
    articles.forEach(item => {
      const key = item.feedId
      if (item.isStarred) {
        result[starKey]++
      }
      if (result[key]) {
        result[key]++
      } else {
        result[key] = 1
      }
    })
    setCountArticlesNum(result)
  }
  const asyncFetchAllArticles = async () => {

    setIsFetching(true)
    const articles = await Services.getAllArticles()
    setArticleList(articles)
    getMenuCount(articles)
    setIsFetching(false)
    return articles
  }
  const asyncReadArticle = async (articleId: string) => {
    const article = (await Services.getArticle(articleId)) as IArticle
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
    searchValue,
    setSearchValue,
    countArticlesNum,
  }
}

export default createModel<ArticlesState>(useArticles)

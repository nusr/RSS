import { ELogicError, IFeed } from '../shared'
import { parseFeed } from './parseFeed'
import { articleDB, feedDB } from './nedb'

const Logic = {
  createFeed: async (feedUrl: string) => {
    const feeds: IFeed[] = await Logic.getAllFeeds()
    if (feeds && feeds.find((item: IFeed) => item.id === feedUrl)) {
      return Promise.reject(`你已经订阅${feedUrl}`)
    }
    console.info(`正在解析 ${feedUrl} ...`)
    const newFeed = await parseFeed(feedUrl, '')
    if (!newFeed) {
      return Promise.reject(ELogicError.FEED_PARSER_NOT_FOUND)
    }
    const { articles, ...rest } = newFeed
    await feedDB.insertFeed(rest)
    console.info(`解析成功！`)
    await articleDB.batchInsertArticles(articles)
    console.info(`插入文章成功！`)
    return newFeed
  },
  batchCreateFeed: async (feedUrls: string[]) => {
    for (const feed of feedUrls) {
      await Logic.createFeed(feed)
    }
    return true
  },
  deleteFeeds: async (feedIds: string[]) => {
    return await feedDB.deleteFeeds(feedIds)
  },
  getAllFeeds: async () => {
    return feedDB.getAllFeeds()
  },
  getArticle: async (articleId: string) => {
    return articleDB.find(articleId)
  },
  getAllArticles: async (options: object) => {
    return articleDB.getAllArticles(options)
  },
  setArticlesIsRead: async (articleIds: string[]) => {
    return await articleDB.setArticlesIsRead(articleIds)
  },
  setArticleIsStarred: async (articleId: string, isStarred: boolean) => {
    return articleDB.setArticleIsStarred(articleId, isStarred)
  },
  updateFeedArticles: async (feed: IFeed) => {
    const newFeed = await parseFeed(feed.id || '', feed.etag || '')
    if (!newFeed || newFeed.publishTime <= feed.publishTime) {
      return 0
    }
    console.info(`更新 ${feed.id} ...`)
    newFeed.createTime = feed.createTime
    const { articles = [], ...rest } = newFeed
    await feedDB.updateFeed(rest)
    console.info(`更新成功！`)
    await articleDB.batchInsertArticles(articles)
    return 1
  },
}

export default Logic

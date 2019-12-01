import { ELogicError, IFeed } from '../shared'
import LogicError from './error'
import { parseFeed } from './parseFeed'
import { articleDB, feedDB } from './jsonDB'

const Logic = {
  createFeed: async (feedUrl: string) => {
    const feeds = await feedDB.getAllFeeds()
    if (feeds && feeds.find(item => item.id === feedUrl)) {
      return null
    }
    const newFeed = await parseFeed(feedUrl, '')
    if (!newFeed) {
      throw new LogicError(ELogicError.FEED_PARSER_NOT_FOUND)
    }
    const { articles, ...rest } = newFeed
    await feedDB.insertFeed(rest)
    await articleDB.batchInsertArticles(articles || [])
    return newFeed
  },
  deleteFeeds: async (feedIds: string[]) => {
    return await feedDB.deleteFeeds(feedIds)
  },
  getAllFeeds: async () => {
    return await feedDB.getAllFeeds()
  },
  getArticle: async (articleId: string) => {
    return await articleDB.getArticle(articleId)
  },
  getAllArticles: async () => {
    return await articleDB.getAllArticles()
  },
  setArticlesIsRead: async (articleIds: string[]) => {
    return await articleDB.setArticlesIsRead(articleIds)
  },
  setArticleIsStarred: async (articleId: string, isStarred: boolean) => {
    await articleDB.setArticleIsStarred(articleId, isStarred)
  },
  updateFeedArticles: async (feed: IFeed) => {
    const newFeed = await parseFeed(feed.id || '', feed.etag || '')
    // TODO newFeed.publishTime should not eq feed.publishTime
    if (!newFeed || newFeed.publishTime <= feed.publishTime) {
      return 0
    }
    newFeed.createTime = feed.createTime
    newFeed.id = feed.id
    const { articles = [], ...rest } = newFeed
    await feedDB.updateFeed(rest)
    await articleDB.batchInsertArticles(articles)
    return 1
  },
}

export default Logic

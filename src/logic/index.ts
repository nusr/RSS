import { ELogicError, IFeed } from '../shared'
import LogicError from './error'
import { parseFeed } from './feedparser'
import { articleDB, feedDB } from './customDB'

const Logic = {
  createFeed: async (feedUrl: string) => {
    const feeds = await feedDB.getAllFeeds()
    if (feeds && feeds.find(item => item._id === feedUrl)) {
      return null
    }
    const newFeed = await parseFeed(feedUrl, '')
    if (!newFeed) {
      throw new LogicError(ELogicError.FEED_PARSER_NOT_FOUND)
    }
    const { articles, ...rest } = newFeed
    articleDB.batchInsertArticles(articles)
    feedDB.insertFeed(rest)
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
    const newFeed = await parseFeed(feed._id, feed.etag || '')
    // TODO newFeed.publishTime should not eq feed.publishTime
    if (!newFeed || newFeed.publishTime <= feed.publishTime) {
      return 0
    }
    newFeed.createTime = feed.createTime
    newFeed._id = feed._id
    const { articles } = newFeed
    await feedDB.updateFeed(newFeed)
    await articleDB.batchInsertArticles(articles)
    return 1
  },
}

export default Logic

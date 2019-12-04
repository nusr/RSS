import { ELogicError, IFeed } from '../shared'
import LogicError from './error'
import { parseFeed } from './parseFeed'
import { articleDB, feedDB } from './jsonDB'

const Logic = {
  createFeed: async (feedUrl: string) => {
    // @ts-ignore
    const feeds: any[] = await Logic.getAllFeeds()
    if (feeds && feeds.find((item: any) => item.id === feedUrl)) {
      throw new Error(`你已经订阅${feedUrl}`)
    }
    console.info(`正在解析 ${feedUrl} ...`)
    const newFeed = await parseFeed(feedUrl, '')
    if (!newFeed) {
      throw new LogicError(ELogicError.FEED_PARSER_NOT_FOUND)
    }
    const { articles, ...rest } = newFeed
    feedDB.insert(rest, error => {
      if (error) {
        console.log(error)
      }
    })
    console.info(`解析成功！`)
    articleDB.insert(articles || [], error => {
      if (error) {
        console.log(error)
      }
    })
    console.info(`插入文章成功！`)
    return newFeed
  },
  deleteFeeds: async (feedIds: string[]) => {
    // return await feedDB.deleteFeeds(feedIds)
  },
  getAllFeeds: async () => {
    return new Promise((resolve, reject) => {
      feedDB.find({}, (error, docs) => {
        console.log(docs)
        if (error) {
          reject()
        } else {
          resolve(docs)
        }
      })
    })
  },
  getArticle: async (articleId: string) => {
    return await articleDB.find({
      id: articleId,
    })
  },
  getAllArticles: async () => {
    return new Promise((resolve, reject) => {
      articleDB.find({}, (error, docs) => {
        console.log(docs)
        if (error) {
          reject()
        } else {
          resolve(docs)
        }
      })
    })
  },
  setArticlesIsRead: async (articleIds: string[]) => {
    // return await articleDB.setArticlesIsRead(articleIds)
  },
  setArticleIsStarred: async (articleId: string, isStarred: boolean) => {
    return await articleDB.update(
      { id: articleId },
      { $set: { isStarred } },
      { multi: true }
    )
  },
  updateFeedArticles: async (feed: IFeed) => {
    const newFeed = await parseFeed(feed.id || '', feed.etag || '')
    if (!newFeed || newFeed.publishTime <= feed.publishTime) {
      return 0
    }
    console.info(`更新 ${feed.id} ...`)
    newFeed.createTime = feed.createTime
    newFeed.id = feed.id
    const { articles = [], ...rest } = newFeed
    await feedDB.update({ id: feed.id }, rest, { upsert: true })
    console.info(`更新成功！`)
    await articleDB.insert(articles)
    return 1
  },
}

export default Logic

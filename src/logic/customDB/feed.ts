import FeedParser from 'feedparser'
import { IArticle, IFeed } from '../../shared'
import { BaseModel } from './base'
export default class FeedDB extends BaseModel<IFeed> {
  public constructor() {
    super('feeds.json')
  }
  public async getAllFeeds(): Promise<IFeed[]> {
    return (await this.readJsonFile()) || []
  }
  public makeFeedBaseOnMate(
    meta: FeedParser.Meta,
    etag = '',
    articles: IArticle[] = []
  ) {
    const feed: IFeed = {
      _id: meta.xmlurl,
      articles,
      author: meta.author,
      categories: meta.categories,
      createTime: Date.now(),
      deleteTime: 0,
      description: meta.description,
      etag,
      favicon: meta.favicon,
      generator: meta.generator,
      language: meta.language,
      link: meta.link,
      publishTime: meta.pubdate ? meta.pubdate.getTime() : Date.now(),
      time: meta.date ? meta.date.getTime() : Date.now(),
      title: meta.title,
    }
    return feed
  }
  public async updateFeedUrl(feedUrl: string, newUrl: string) {
    const feeds = await this.getAllFeeds()
    const item = feeds.find(item => item._id === feedUrl)
    item._id = newUrl
    return this.updateFeeds(feeds)
  }
  public async updateFeed(feed: IFeed) {
    const feeds = await this.getAllFeeds()
    const result = []
    feeds.forEach(item => {
      let temp = item
      if (item._id === feed._id) {
        temp = Object.assign(item, feed)
      }
      result.push(temp)
    })
    return this.updateFeeds(result)
  }
  public async insertFeed(feed: IFeed) {
    const feeds = await this.getAllFeeds()
    const item = feeds.find(v => v._id === feed._id)
    return item
  }
  protected async updateFeeds(feeds: IFeed[]) {
    return this.updateJsonFile(feeds, true)
  }
  public async deleteFeeds(ids: string[]) {
    const feeds = await this.getAllFeeds()
    const result = feeds.filter(item => !ids.includes(item._id))
    return this.updateFeeds(result)
  }
}

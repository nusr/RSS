import FeedParser from 'feedparser'
import { IArticle, IFeed, EDBName } from '../../shared'
import { BaseModel } from './base'
export default class FeedDB extends BaseModel<IFeed> {
  public constructor() {
    super(EDBName.feed)
  }
  public async getAllFeeds(): Promise<IFeed[]> {
    return (await this.getAll()) as IFeed[]
  }
  public makeFeedBaseOnMate(
    meta: FeedParser.Meta,
    etag = '',
    articles: IArticle[] = []
  ) {
    const feed: IFeed = {
      id: meta.xmlurl,
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
    return this.updateOne<string>(feedUrl, 'id', newUrl)
  }
  public async updateFeed(feed: IFeed) {
    return this.updateAll(feed.id, feed)
  }
  public async insertFeed(feed: IFeed) {
    if (!feed.id) {
      return false
    }
    return this.insert([feed])
  }
  public async deleteFeeds(ids: string[]) {
    for (let id of ids) {
      await this.remove(id)
    }
    return true
  }
}

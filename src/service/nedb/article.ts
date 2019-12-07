import { IArticle, EDBName } from '../../shared'
import FeedParser from 'feedparser'
import { BaseModel } from './base'
export default class ArticleDB extends BaseModel<IArticle> {
  public constructor() {
    super(EDBName.article)
  }
  public async getAllArticles(): Promise<IArticle[]> {
    return (await this.getAll()) as IArticle[]
  }
  public async getArticle(articleId: string) {
    return this.find(articleId)
  }
  public async setArticlesIsRead(articleIds: string[]) {
    for (let id of articleIds) {
      await this.updateOne<boolean>(id, 'isUnread', false)
    }
    return true
  }
  public async setArticleIsStarred(articleId: string, isStarred: boolean) {
    return this.updateOne<boolean>(articleId, 'isStarred', isStarred)
  }
  public async batchInsertArticles(articles: IArticle[]) {
    return this.insert(articles)
  }
  public makeArticleBaseOnItem(item: FeedParser.Item, feedId: string) {
    const id = item.guid || item.link
    if (!id) {
      return null
    }
    const article: IArticle = {
      id: id,
      author: item.author,
      categories: item.categories,
      comments: item.comments,
      createTime: Date.now(),
      deleteTime: 0,
      description: item.description,
      enclosures: item.enclosures,
      feedId,
      image: item.image.url,
      isStarred: false,
      isUnread: true,
      link: item.link,
      originLink: item.origlink,
      publishTime: item.pubdate ? item.pubdate.getTime() : Date.now(),
      summary: item.summary.substr(0, 96),
      time: item.date ? item.date.getTime() : Date.now(),
      title: item.title,
    }
    return article
  }
}
import { IArticle, EDBName } from '../../shared'
import FeedParser from 'feedparser'
import { BaseModel } from './base'
export default class ArticleDB extends BaseModel<IArticle> {
  public constructor() {
    super(EDBName.article)
  }
  public async getAllArticles(): Promise<IArticle[]> {
    return (await this.readJsonFile()) || []
  }
  public async getArticle(articleId: string) {
    const articles = await this.getAllArticles()
    return articles.find(item => item.id === articleId)
  }
  public async setArticlesIsRead(articleIds: string[]) {
    const articles = await this.getAllArticles()
    const result = []
    articles.forEach(item => {
      let temp = item
      if (articleIds.includes(item.id)) {
        temp = Object.assign(item, {
          isUnread: false,
        })
      }
      result.push(temp)
    })
    return this.updateArticles(result)
  }
  public async setArticleIsStarred(articleId: string, isStarred: boolean) {
    const articles = await this.getAllArticles()
    const article = articles.find(item => item.id === articleId)
    if (article.isStarred !== isStarred) {
      article.isStarred = isStarred
    }
    return this.updateArticles(articles)
  }
  private async updateArticles(articles: IArticle[]) {
    return this.updateJsonFile(articles, false)
  }
  public async batchInsertArticles(articles: IArticle[]) {
    const list = await this.getAllArticles()
    const map = {}
    list.forEach(item => {
      const key = item.id
      if (!map[key]) {
        map[key] = 1
      }
    })
    const result = []
    articles.forEach(item => {
      const key = item.id
      if (!map[key]) {
        map[key] = 1
        result.push(item)
      }
    })
    return this.updateArticles(result.concat(list))
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

// import FeedDB from './feed'
// import ArticleDB from './article'
import DataStore from 'nedb'
import FeedParser from 'feedparser'
import { IArticle, IFeed } from '../../shared'
export function makeArticleBaseOnItem(item: FeedParser.Item, feedId: string) {
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
export function makeFeedBaseOnMate(
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
export const feedDB = new DataStore({
  filename: 'feeds.json',
  autoload: true,
})
export const articleDB = new DataStore({
  filename: 'articles.json',
  autoload: true,
})

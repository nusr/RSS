import FeedParser from 'feedparser'
import http from 'http'
import https from 'https'
import url from 'url'
import { ELogicError, IArticle, IFeed } from '../../shared'
import { feedDB, articleDB } from '../nedb'
import { TextTransform } from './TextTransform'
import Toast from '../../components/Toast'
function feedXmlRequest(feedUrl: string, options: http.RequestOptions) {
  return new Promise<http.IncomingMessage>((resolve, reject) => {
    const parseResult = url.parse(feedUrl)
    if (!parseResult) {
      return reject(ELogicError.FEED_PARSER_WRONG_URL)
    }
    const { protocol, host = '', hostname, path, port } = parseResult
    const client = protocol === 'http:' ? http : https
    const origin = `${protocol}//${host}/`
    const headers = Object.assign(options.headers || {}, {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
      host,
      origin,
      referer: origin,
    })

    const params: http.RequestOptions = {
      headers,
      host: host,
      hostname: hostname,
      method: 'GET',
      path: path,
      port: port,
      protocol: protocol,
      timeout: 10000,
    }
    client
      .get(params, (response: http.IncomingMessage) => {
        return resolve(response)
      })
      .on('error', (error: Error) => {
        return reject(error)
      })
  })
}

function makeFaviconUrl(feedUrl: string) {
  const u = url.parse(feedUrl)
  return `${u.protocol}//${u.host}/favicon.ico`
}

function parseETag(response: http.IncomingMessage) {
  let Tag = response.headers.etag || ''
  Tag = Tag.toString()
  Tag = Tag.slice(0, 2) === 'W/' ? Tag.slice(2) : Tag
  return Tag
}

export function parseFeed(feedUrl: string, eTag: string) {
  return new Promise<IFeed | null>((resolve, reject) => {
    feedXmlRequest(feedUrl, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'if-none-match': eTag,
      },
    })
      .then((response: http.IncomingMessage) => {
        if (response.statusCode === 200) {
          const feedParser = new FeedParser({})
          const articles: IArticle[] = []
          let feed: IFeed
          let item: FeedParser.Item
          response.pipe(new TextTransform(response.headers['content-type']))
          response.pipe(feedParser)
          feedParser.on('meta', (meta: FeedParser.Meta) => {
            meta.favicon = meta.favicon
              ? meta.favicon
              : makeFaviconUrl(meta.link)
            feed = feedDB.makeFeedBaseOnMate(meta, parseETag(response))
          })
          feedParser.on('readable', () => {
            item = feedParser.read()
            while (item) {
              const article = articleDB.makeArticleBaseOnItem(item, feedUrl)
              article && articles.push(article)
              item = feedParser.read()
            }
          })
          feedParser.on('end', (error: Error) => {
            if (error) {
              return reject(error)
            } else {
              feed.articles = articles
              return resolve(feed)
            }
          })
          feedParser.on('error', (error: Error) => {
            return reject(error)
          })
        } else if (response.statusCode === 301) {
          const newUrl = response.headers.location
          if (newUrl) {
            feedDB.updateFeedUrl(feedUrl, newUrl)
          }
          return resolve(null)
        } else if (response.statusCode === 304) {
          return resolve(null)
        } else {
          console.error(response)
          return reject(ELogicError.FEED_PARSER_FETCH_ERROR)
        }
      })
      .catch(error => {
        Toast({
          content: JSON.stringify(error),
        })
        console.error(error)
        return reject(error)
      })
  })
}

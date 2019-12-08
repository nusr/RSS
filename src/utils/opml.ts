import { IFeed } from '../shared'
import fs from 'fs'
import xml2js from 'xml2js'
const DEFAULT_TITLE = 'https://github.com/nusr/RSS'
export function get(data: object, path: string, defaultValue = null) {
  const result = String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(item => item)
    .reduce(
      (res, key) => (res !== null && res !== undefined ? res[key] : res),
      data
    )
  return result === undefined || result === data ? defaultValue : result
}
function getFeed(list, result = []) {
  list.forEach(item => {
    const feed = get(item, '$.xmlUrl', '')
    result.push(feed)
    if (item.outline) {
      getFeed(item.outline, result)
    }
  })
}
function parseOPML(result) {
  const title = get(result, 'opml.head[0].title[0]', '').split(' - ')
  const outline = get(result, 'opml.body[0].outline', [])
  let feeds: string[] = []
  getFeed(outline, feeds)
  feeds = feeds.filter(item => /^https?:\/\/\S*$/i.test(item))
  const realTitle = title[1] || DEFAULT_TITLE
  return {
    title: realTitle,
    feeds,
  }
}
export function importFromOPML(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        console.error(error)
        reject(error)
        return
      }
      const parser = new xml2js.Parser()
      parser.parseString(data, (parserError, result) => {
        if (parserError) {
          console.error(parserError)
          reject(parserError)
        } else {
          resolve(parseOPML(result))
        }
      })
    })
  })
}
export function exportToOPML(
  feeds: IFeed[] = [],
  filePath: string,
  author: string = DEFAULT_TITLE
) {
  const body: string[] = feeds.map(
    ({ id, title, link }) =>
      `<outline htmlUrl="${link}" title="${title}" xmlUrl="${id}" type="rss" text="${title}"/>`
  )
  const result = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
  <head>
    <title>Subscriptions - ${author}</title>
  </head>
  <body>
    ${body.join('\n')}
  </body>
</opml>`
  fs.writeFile(filePath, result, error => {
    if (error) {
      console.error(error)
    } else {
      console.info('success')
    }
  })
}

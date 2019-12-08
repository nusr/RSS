import { IFeed } from '../shared'
import fs from 'fs'
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
function parseOPML(result) {
  const title = get(result, 'title[0].textContent', '').split(' - ')
  const feeds = []
  get(result, 'outline', []).forEach(item => {
    const url = item.xmlUrl
    if (/^https?:\/\/\S*$/i.test(url)) {
      feeds.push(url)
    }
  })
  const realTitle = title[1] || DEFAULT_TITLE
  return {
    title: realTitle,
    feeds,
  }
}
export function convertXmlToJSON(xmlString: string) {
  const xmlDoc = new window.DOMParser().parseFromString(xmlString, 'text/xml')
  const result = {}
  Array.prototype.forEach.call(xmlDoc.all, item => {
    const {nodeName} = item
    const obj = {
      textContent: item.textContent,
    }
    const list = item.attributes
    const tempLen = list.length
    for (let i = 0; i < tempLen; i++) {
      const temp = list[i]
      obj[temp.nodeName] = temp.nodeValue
    }
    if (result[nodeName]) {
      result[nodeName].push(obj)
    } else {
      result[nodeName] = [obj]
    }
  })
  return result
}
export function importFromOPML(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        console.error(error)
        reject(error)
        return
      }
      const temp = convertXmlToJSON(data)
      resolve(parseOPML(temp))
    })
  })
}
export function exportToOPML(
  feeds: IFeed[] = [],
  filePath: string,
  author: string = DEFAULT_TITLE
) {
  return new Promise((resolve, reject) => {
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
        reject(error)
      } else {
        resolve()
      }
    })
  })
}


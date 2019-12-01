export enum ELogicError {
  FEED_PARSER_FETCH_ERROR = 'FEED_PARSER_FETCH_ERROR',
  FEED_PARSER_NOT_FOUND = 'FEED_PARSER_NOT_FOUND',
  FEED_PARSER_WRONG_URL = 'FEED_PARSER_WRONG_URL',
  POUCHDB_EXISTS = 'POUCHDB_EXISTS',
  UNKNOWN = 'UNKNOWN',
}

export enum EMenuKey {
  ALL_ITEMS = 'ALL_ITEMS',
  STARRED_ITEMS = 'STARRED_ITEMS'
}

export enum EArticleFilter {
  STARRED = 'STARRED',
  UNREAD = 'UNREAD',
  ALL = 'ALL',
}
export enum EDBName {
  article= 'articles.json',
  feed = 'feeds.json'
}

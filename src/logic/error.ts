import { ELogicError } from '../shared'

const LogicErrorMessages = {
  [ELogicError.FEED_PARSER_FETCH_ERROR]: 'Feedparser fetch error.',
  [ELogicError.FEED_PARSER_NOT_FOUND]: 'Feedparser feed not error.',
  [ELogicError.FEED_PARSER_WRONG_URL]: 'Feedparser wrong url.',
  [ELogicError.POUCHDB_EXISTS]: 'PouchDB doc exists.',
  [ELogicError.UNKNOWN]: 'Unknown error.',
}

export default class LogicError extends Error {
  public type: string
  public constructor(type: ELogicError) {
    super(LogicErrorMessages[type])
    this.type = type
  }
}

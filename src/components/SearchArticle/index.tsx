import { Modal } from '../Modal'
import React, { useState, useEffect } from 'react'
import {ArticleItem } from '../ArticleItem'
import { IArticle } from '../../shared'
import Utils from '../../utils'
import './index.less'
import { useLanguageModel } from '../../store'
type SearchArticleProps = {
  visible: boolean;
  onCancel(): void;
  onItemChoose(value: number): void;
  articles: IArticle[];
}

export const SearchArticle: React.FunctionComponent<SearchArticleProps> = props => {
  const { onCancel, visible, articles = [], onItemChoose } = props
  const [keywords, setWords] = useState<string>('')
  const [matchedArticles, setArticles] = useState<IArticle[]>([])
  const { getLanguageData } = useLanguageModel()
  useEffect(() => {
    if (visible) {
      setImmediate(() => {
        const input: HTMLInputElement | null = document.querySelector(
          '.search-article-keywords input'
        )
        if (input) {
          input.focus()
        }
      })
    }
  }, [visible])

  function searchArticles(value: string) {
    const keys = value
      .split(' ')
      .map(key => key.trim())
      .filter(key => !!key)
    const len = keys.length
    const matched: IArticle[] = articles.filter(
      (article: IArticle, index: number) => {
        const str = article.title + article.author + article.summary
        let i = 0
        for (; i < len; i++) {
          if (str.indexOf(keys[i]) === -1) {
            break
          }
        }
        if (i === len) {
          article.index = index
          return true
        }
        return false
      }
    )
    setArticles(matched)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setWords(value)
    searchArticles(value)
  }

  return (
    <Modal
      className="search-article-modal"
      closable={false}
      style={{ top: Utils.getModalTop(42) }}
      visible={visible}
      title="Search"
      onCancel={onCancel}>
      <input
        className="search-article-keywords"
        placeholder={getLanguageData('keywords')}
        value={keywords}
        onChange={handleChange}
      />
      <div className="matched-list">
        {matchedArticles.map((article: IArticle) => (
          <div
            key={article._id}
            onClick={() => onItemChoose(article.index as number)}>
            <ArticleItem data={article} className="item-is-unread" />
          </div>
        ))}
        {!matchedArticles.length && (
          <div className="empty-list">
            {getLanguageData(keywords ? 'noMatched' : 'inputKeywords')}
          </div>
        )}
      </div>
    </Modal>
  )
}

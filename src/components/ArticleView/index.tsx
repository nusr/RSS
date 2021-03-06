import { SvgIcon } from '../SvgIcon'
import { Empty } from '../Empty'
import { shell } from 'electron'
import React, { useState, useEffect, useRef } from 'react'
import {
  useLanguageModel,
  useArticlesModel,
  useMenuModel,
  useFeedsModel,
} from '../../store'
import { ArticleViewSkeleton } from '../Skeletons/ArticleViewSkeleton'
import { timeToDateTimeString } from '../../utils'
import { WebviewDrawer } from '../Webview'
import './index.less'
let isAppend = false
let contentLinks: string[] = []
export const ArticleView: React.FunctionComponent<{}> = () => {
  const { getLanguageData } = useLanguageModel()
  const { getCurrentFeed } = useFeedsModel()
  const {
    currentArticle,
    isFetching,
    asyncStarArticle,
    setCurrentArticle,
  } = useArticlesModel()
  const { toggleMenu } = useMenuModel()
  const currentFeed = getCurrentFeed(currentArticle && currentArticle.feedId)
  const [hoverLink, setHoverLink] = useState<string>('')
  const [isVisible, setVisible] = useState<boolean>(false)
  const contentRef = useRef<HTMLDivElement>(null)
  function parseArticleContent(content: string) {
    if (isAppend) {
      return
    }
    isAppend = true
    const div = document.createElement('div')
    div.innerHTML = content
    const scripts = div.querySelectorAll('script')
    scripts.forEach(script => {
      script.remove()
    })
    const links = div.querySelectorAll('a')
    contentLinks = []
    links.forEach((link: HTMLAnchorElement) => {
      contentLinks.push(link.href)
    })

    const frames = div.querySelectorAll('iframe')
    frames.forEach(frame => {
      frame.setAttribute('sandbox', '')
    })
    const dom = document.querySelector('.article-content.real-content')
    if (dom) {
      while (dom.firstChild) {
        dom.removeChild(dom.firstChild)
      }
      dom.appendChild(div)
      const containerDom = contentRef.current
      containerDom && containerDom.scrollTo(0, 0)
      isAppend = false
    }
  }

  useEffect(() => {
    if (currentArticle) {
      parseArticleContent(currentArticle.description)
    }
  }, [currentArticle])

  function handleStarIconClick() {
    if (currentArticle) {
      const articleId = currentArticle.id
      const isStarred = !currentArticle.isStarred
      asyncStarArticle(articleId, isStarred)
    }
  }

  function handleContentClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault()
    if (hoverLink) {
      setVisible(true)
      toggleMenu()
    }
  }
  function handleMouseOverContent(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    const target = e.target as HTMLDivElement
    const div: HTMLDivElement | null = target.closest('.article-info')
    let link = ''
    if (target.tagName === 'A' && target.dataset.index) {
      const index = parseInt(target.dataset.index, 10)
      link = contentLinks[index]
    } else if (div && div.dataset.link) {
      // eslint-disable-next-line
      link = div.dataset.link
    }
    setHoverLink(link)
  }
  function closeWebview() {
    setVisible(false)
    toggleMenu()
  }

  function handleCompassClick() {
    const src = currentArticle && currentArticle.link
    if (src) {
      shell.openExternal(src)
    }
  }
  let viewContent: JSX.Element
  if (currentArticle) {
    viewContent = (
      <div
        ref={contentRef}
        className="view-content"
        onMouseOver={handleMouseOverContent}
        onClick={handleContentClick}>
        <div className="article-info" data-link={currentArticle.link}>
          <div className="article-date">
            {timeToDateTimeString(currentArticle.time)}
          </div>
          <h1 className="article-title">{currentArticle.title}</h1>
          <div className="article-author">
            {currentArticle.author} @{' '}
            {currentFeed ? currentFeed.title : getLanguageData('unknown')}
          </div>
        </div>
        <div
          className="article-content real-content"
          dangerouslySetInnerHTML={{
            __html: currentArticle.description,
          }}></div>
      </div>
    )
  } else {
    viewContent = (
      <div className="view-content" ref={contentRef}>
        <div style={{ marginTop: '128px' }}>
          <Empty>
            <div className="feed-title">{currentFeed && currentFeed.title}</div>
          </Empty>
        </div>
      </div>
    )
  }
  const isUnread = currentArticle && currentArticle.isUnread
  return (
    <div className="article-view">
      <div className="view-header">
        <div>
          <SvgIcon icon="close" onClick={() => setCurrentArticle(undefined)} />
        </div>
        <div>
          <SvgIcon icon={!isUnread ? 'dot-outlined' : 'dot-filled'} />
          <SvgIcon
            icon={
              currentArticle && currentArticle.isStarred
                ? 'star-filled'
                : 'star-outlined'
            }
            onClick={handleStarIconClick}
          />
          <SvgIcon icon="compass" onClick={handleCompassClick} />
        </div>
      </div>
      {viewContent}
      <div className="view-footer" onClick={handleContentClick}>
        {currentArticle && hoverLink ? 'Open ' + hoverLink : ''}
      </div>
      <WebviewDrawer
        width={'calc(100vw - 264px)'}
        onClose={closeWebview}
        visible={isVisible}
        src={hoverLink}
      />
      <ArticleViewSkeleton
        style={{
          display: isFetching ? 'block' : 'none',
        }}
      />
    </div>
  )
}

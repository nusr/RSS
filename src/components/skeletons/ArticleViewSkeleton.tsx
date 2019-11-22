import React, { CSSProperties } from 'react'
import { SpanSkeleton, TextSkeleton } from './index'

import '../../assets/Skeletons.less'

interface IArticleViewSkeletonProps {
  className?: string;
  style?: CSSProperties;
}
const ArticleViewSkeleton: React.FunctionComponent<IArticleViewSkeletonProps> = ({ className, style }) =>{
  const classes = 'article-view-skeleton ' + (className || '')
  return (
    <div className={classes} style={style}>
      <div className="view-content">
        <div className="article-info">
          <div className="article-date">
            <SpanSkeleton width={138} />
          </div>
          <div className="article-title">
            <TextSkeleton style={{ height: 40, marginBottom: 8 }} />
          </div>
          <div className="article-author">
            <SpanSkeleton width={156} />
          </div>
        </div>
        <div className="article-content">
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton width="57%" />
          <br />
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton width="83%" />
          <br />
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton width="67%" />
        </div>
      </div>
    </div>
  )
}
export default ArticleViewSkeleton

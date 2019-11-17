import React, { CSSProperties } from 'react'
import ArticleItemSkeleton from './ArticleItemSkeleton'
import { SpanSkeleton } from './index'

import '../../assets/Skeletons.less'

interface IArticleListSkeletonProps {
  className?: string;
  row: number;
  style?: CSSProperties;
}
const ArticleListSkeleton: React.FunctionComponent<IArticleListSkeletonProps> = ({ className, row, style }) => {
  const classes = 'article-list-skeleton ' + (className || '')
  const list = Array(row)
    .fill(0)
    .map((el, i) => i)
  return (
    <div className={classes} style={style}>
      <SpanSkeleton width={90} style={{ marginLeft: 8 }} />
      {list.map(item => (
        <ArticleItemSkeleton key={item} />
      ))}
    </div>
  )
}
export default ArticleListSkeleton


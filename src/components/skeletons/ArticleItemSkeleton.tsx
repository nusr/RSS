import React from 'react'
import { SpanSkeleton, AvatarSkeleton, TextSkeleton } from './index'

import '../../assets/Skeletons.less'

interface IArticleItemSkeletonProps {
  key: string | number;
}

const ArticleItemSkeleton: React.FunctionComponent<IArticleItemSkeletonProps> = () => {
  return (
    <div className="article-item">
      <div className="item-sider">
        <AvatarSkeleton/>
      </div>
      <div className="item-main">
        <div className="item-header">
          <div className="item-header-left">
            <SpanSkeleton width={96}/>
          </div>
          <div className="item-header-right">
            <SpanSkeleton width={36}/>
          </div>
        </div>
        <div className="item-content">
          <TextSkeleton/>
          <TextSkeleton width={'67%'}/>
        </div>
        <div className="item-footer">
          <SpanSkeleton width={'100%'}/>
        </div>
      </div>
    </div>
  )
}
export default ArticleItemSkeleton

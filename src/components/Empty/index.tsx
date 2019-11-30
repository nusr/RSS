import React from 'react'
import mac from '../../assets/images/empty.png'
import './index.less'

type EmptyProps = {
  image?: string;
  description?: string;
}
export const Empty: React.FunctionComponent<EmptyProps> = props => {
  const { image = mac, description = '暂无数据', children } = props
  return (
    <div className="empty">
      <img src={image} alt={description} />
      {children}
      <div className="desc">{description}</div>
    </div>
  )
}

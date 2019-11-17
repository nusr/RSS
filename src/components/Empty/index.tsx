import React from 'react'
import { SvgIcon } from '../SvgIcon'
import './index.less'

type EmptyProps = {
  image?: string;
  description?: string;
}
export const Empty: React.FunctionComponent<EmptyProps> = (props) => {
  const {
    image = '',
    description = '暂无数据',
  } = props
  return (
    <div className="empty">
      {image ? <img src={image} alt={description}/> : <SvgIcon icon="empty"/>}
      <div>{description}</div>
    </div>
  )
}

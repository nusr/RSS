import React, { useState } from 'react'
import { SvgIcon } from '../SvgIcon'
import './index.less'

type AvatarProps = {
  size?: number;
  src: string;
  default?: boolean;
}
export const Avatar: React.FunctionComponent<AvatarProps> = props => {
  const { src = '', size = 32, children } = props
  const [imageUrl, setImageUrl] = useState<string>(src)

  function onError() {
    setImageUrl('')
  }

  return (
    <div className="avatar" style={{ width: size, height: size }}>
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" onError={onError} />
      ) : (
        <SvgIcon icon="rss" className="default"/>
      )}

      {children}
    </div>
  )
}

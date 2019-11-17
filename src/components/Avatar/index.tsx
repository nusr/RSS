import React, { useState } from 'react'
import './index.less'

type AvatarProps = {
  size?: number;
  src: string;
}
export const Avatar: React.FunctionComponent<AvatarProps> = (props) => {
  const {
    src = '',
    size = 32,
  } = props
  const [imageUrl, setImageUrl] = useState<string>(src)
  
  function onError() {
    setImageUrl('')
  }
  
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      {
        imageUrl && <img src={imageUrl} alt="avatar" onError={onError}/>
      }
    </div>
  )
}

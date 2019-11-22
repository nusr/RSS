import React from 'react'
import './index.less'
export type IconType =
  | 'rss'
  | 'all'
  | 'check-circle'
  | 'close'
  | 'compass'
  | 'dot-filled'
  | 'dot-outlined'
  | 'empty'
  | 'file-text'
  | 'folder'
  | 'list-filled'
  | 'list-outlined'
  | 'plus'
  | 'search'
  | 'star-filled'
  | 'star-outlined'
  | 'warning'
  | 'refresh'
type SvgIconProps = {
  icon: IconType;
  className?: string;
  onClick?(): void;
  color?: string;
  size?: number;
}
export const SvgIcon: React.FunctionComponent<SvgIconProps> = props => {
  const { className = '', icon, size, color = 'currentColor', ...rest } = props
  return (
    <svg
      className={`svg-icon ${className}`}
      fill={color}
      aria-hidden="true"
      style={{ fontSize: size }}
      {...rest}>
      <use xlinkHref={`#icon-${icon}`} />
    </svg>
  )
}

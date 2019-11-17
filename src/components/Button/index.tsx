import React from 'react'
import { SvgIcon, IconType } from '../SvgIcon'
import './index.less'

type EmptyProps = {
  icon?: IconType;
  onClick?(e: any): void;
  type?: 'ghost' | 'danger' | 'primary';
  className?: string;
}
export const Button: React.FunctionComponent<EmptyProps> = props => {
  const { icon, children, type = 'ghost', className = '',onClick, ...rest } = props
  return (
    <div className={`button ${type} ${className}`} onClick={onClick} {...rest}>
      {icon && <SvgIcon icon={icon} />}
      {children}
    </div>
  )
}

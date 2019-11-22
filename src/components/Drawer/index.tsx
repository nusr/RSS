import React from 'react'
import './index.less'
type DrawerProps = {
  visible: boolean;
  className?: string;
  width?: number | string;
  onClose?(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
  style?: React.CSSProperties;
}
export const Drawer: React.FunctionComponent<DrawerProps> = props => {
  const {
    visible,
    children,
    className,
    width = 400,
    onClose,
    style = {},
    ...rest
  } = props
  return (
    <div
      className="custom-drawer"
      style={{
        display: visible ? 'block' : 'none',
        ...style,
      }}
      {...rest}>
      <div className="overlay" onClick={onClose} />
      <div className={`modal ${className}`} style={{ width }}>
        {children}
      </div>
    </div>
  )
}

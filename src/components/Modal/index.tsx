import React from 'react'
import { SvgIcon } from '../SvgIcon'
import './index.less'
import { Button } from '../Button'
import { useLanguageModel } from '../../store'
type ModalProps = {
  visible: boolean;
  className?: string;
  title?: string;
  width?: number;
  onCancel?(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
  onOk?(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
  closable?: boolean;
  style?: React.CSSProperties;
}
export const Modal: React.FunctionComponent<ModalProps> = props => {
  const { getLanguageData } = useLanguageModel()
  const {
    visible,
    children,
    className,
    width = 500,
    title,
    onCancel,
    style = {},
    closable,
    onOk,
    ...rest
  } = props
  return (
    <div
      className="custom-modal"
      style={{
        display: visible ? 'block' : 'none',
        ...style,
      }}
      {...rest}>
      <div className="overlay" onClick={onCancel} />
      <div className="modal" style={{ width }}>
        <div className="header">
          <div className="title">{title}</div>
          <div onClick={onCancel}>{closable && <SvgIcon icon="close" />}</div>
        </div>
        <div className={`body ${className}`}>{children}</div>
        <div className="footer">
          <Button onClick={onCancel}>{getLanguageData('cancel')}</Button>
          <Button type="primary" onClick={onOk}>
            {getLanguageData('ok')}
          </Button>
        </div>
      </div>
    </div>
  )
}

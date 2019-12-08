import React, { useEffect } from 'react'
export type ToastItemProps = {
  duration?: number;
  onClose?: Function;
  update?: boolean;
  closeIcon?: React.ReactNode;
  prefixCls?: string;
  closable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
  key: string;
  updateKey: string;
}
export const ToastItem: React.FunctionComponent<ToastItemProps> = props => {
  let closeTimer
  const {
    prefixCls = '',
    closable = false,
    className = '',
    style = {
      right: '50%',
    },
    onClick,
    closeIcon,
    children,
    onClose,
    duration = 3,
    update,
  } = props

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }
  function close(event?: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (event) {
      event.stopPropagation()
    }
    clearCloseTimer()
    onClose && onClose()
  }

  function startCloseTimer() {
    if (duration) {
      closeTimer = setTimeout(() => {
        close()
      }, duration * 1000)
    }
  }

  function restartCloseTimer() {
    clearCloseTimer()
    startCloseTimer()
  }
  /* eslint-disable */
  useEffect(() => {
    startCloseTimer()
    return clearCloseTimer
  }, [])
  useEffect(() => {
    if (update) {
      restartCloseTimer()
    }
  }, [update])
  /* eslint-enable */
  const componentClass = `${prefixCls}-notice`
  const closeClass = `${componentClass}-closable`
  return (
    <div
      className={`${componentClass} ${closable ? closeClass : ''} ${
        className ? className : ''
      }`}
      style={style}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={startCloseTimer}
      onClick={onClick}>
      <div className={`${componentClass}-content`}>{children}</div>
      {closable ? (
        <div tabIndex={0} onClick={close} className={`${componentClass}-close`}>
          {closeIcon || <span className={`${componentClass}-close-x`} />}
        </div>
      ) : null}
    </div>
  )
}

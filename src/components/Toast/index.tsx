import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ToastItem, ToastItemProps } from './ToastItem'
import './index.less'
let seed = 0
const now = Date.now()

function getUuid() {
  return `Toast_${now}_${seed++}`
}
type ToastOptions = {
  closeIcon?: React.ReactNode;
  className?: string;
  content: string;
  duration?: number;
  style?: React.CSSProperties;
}
type NotificationProps = {
  style: React.CSSProperties;
  maxCount: number;
  closeIcon: React.ReactNode;
  className: string;
}
type NotificationState = {
  notices: ToastItemProps[];
}
class Notification extends Component<NotificationProps, NotificationState> {
  static defaultProps = {
    style: {
      top: 65,
      left: '50%',
    },
  }

  state = {
    notices: [],
  }

  add = notice => {
    const key = (notice.key = notice.key || getUuid())
    const { maxCount } = this.props
    this.setState(previousState => {
      const { notices } = previousState
      const noticeIndex = notices.map(v => v.key).indexOf(key)
      const updatedNotices = notices.concat()
      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, notice)
      } else {
        if (maxCount && notices.length >= maxCount) {
          notice.updateKey =
            updatedNotices[0].updateKey || updatedNotices[0].key
          updatedNotices.shift()
        }
        updatedNotices.push(notice)
      }
      return {
        notices: updatedNotices,
      }
    })
  }

  remove = key => {
    this.setState(previousState => {
      return {
        notices: previousState.notices.filter(notice => notice.key !== key),
      }
    })
  }
  render() {
    const { closeIcon, className = '', style = {} } = this.props
    const { notices } = this.state
    return (
      <div className={`${className} Toast`} style={style}>
        {notices.map((notice, index) => {
          const update = Boolean(
            index === notices.length - 1 && notice.updateKey
          )
          const key = notice.updateKey ? notice.updateKey : notice.key
          const closeToast = () => {
            this.remove(notice.key)
            notice.onClose && notice.onClose()
          }
          return (
            <ToastItem
              prefixCls="Toast"
              closeIcon={closeIcon}
              {...notice}
              key={key}
              update={update}
              onClose={closeToast}
              onClick={notice.onClick}>
              {notice.content}
            </ToastItem>
          )
        })}
      </div>
    )
  }
}
function newNotificationInstance(properties, callback) {
  const { getContainer, ...props } = properties || {}
  const div = document.createElement('div')
  if (getContainer) {
    const root = getContainer()
    root.appendChild(div)
  } else {
    document.body.appendChild(div)
  }
  let called = false
  function ref(notification) {
    if (called) {
      return
    }
    called = true
    callback({
      notice(noticeProps) {
        notification.add(noticeProps)
      },
      removeNotice(key) {
        notification.remove(key)
      },
      component: notification,
      destroy() {
        ReactDOM.unmountComponentAtNode(div)
        div.parentNode.removeChild(div)
      },
    })
  }
  ReactDOM.render(<Notification {...props} ref={ref} />, div)
}

function toast(options: ToastOptions) {
  newNotificationInstance({}, notification => {
    notification.notice(options)
  })
}

export default toast

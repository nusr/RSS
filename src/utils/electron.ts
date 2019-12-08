import { remote } from 'electron'
const { dialog } = remote
export function showMessageBox(message: string) {
  dialog
    .showMessageBox({
      type: 'info',
      message,
    })
    .then(index => {
      console.info(index)
    })
}
export function showErrorBox(title: string, content = '') {
  dialog.showErrorBox(title, content)
}
export function Notification(
  title: string,
  clickCallback?: Function,
  body = ''
) {
  const notification = new window.Notification(title, {
    body,
    timestamp: 5000
  })
  notification.onclick = () => {
    if (clickCallback) {
      clickCallback()
    }
  }
}

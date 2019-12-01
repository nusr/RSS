export function timeToDateString(time: number) {
  return new Date(time).toDateString()
}

export function timeToTimeString(time: number) {
  return new Date(time).toTimeString().substring(0, 5)
}

export function timeToDateTimeString(time: number) {
  return new Date(time).toString().substring(0, 21)
}
/* eslint-disable */
export function throttle<F extends (...params: any[]) => void>(
  fn: F,
  delay: number
) {
  let isThrottled: boolean
  let lastThis: any
  let lastArgs: any[]
  const wrapper = function(this: any, ...args: any[]) {
    if (!this && !args.length) {
      return
    }
    if (isThrottled) {
      lastThis = this
      lastArgs = args
      return
    }
    isThrottled = true
    fn.apply(this, args)
    window.setTimeout(() => {
      isThrottled = false
      wrapper.apply(lastThis, lastArgs)
    }, delay)
  } as F
  return wrapper
}
/* eslint-enable */
export function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

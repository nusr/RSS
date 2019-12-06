import iconLite from 'iconv-lite'
import { Transform, TransformCallback } from 'stream'

export class TextTransform extends Transform {
  private temp = ''
  private charset = ''
  constructor(charset: string = '') {
    super()
    this.charset = charset
  }
  public _transform(
    chunk: string,
    encoding: string,
    callback: TransformCallback
  ) {
    this.temp += chunk
    callback()
  }
  private getEncodeType() {
    const list: string[] = this.charset.split(';')
    let result: string = ''
    for (let item of list) {
      const temp = item.split('=').map(item => item.trim())
      if (temp[0] === 'charset') {
        result = temp[1]
        break
      }
    }
    return result
  }
  public _flush(callback: TransformCallback) {
    const buffer = Buffer.from(this.temp)
    const charset = this.getEncodeType()
    let output = buffer.toString()
    if (charset && iconLite.encodingExists(charset)) {
      output = iconLite.decode(buffer, charset as string)
    }
    this.push(output)
    callback()
  }
}

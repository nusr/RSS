import char_det from 'chardet'
import iconv from 'iconv-lite'
import { Transform, TransformCallback } from 'stream'

export class IconvTransform extends Transform {
  private temp = ''
  public _transform(
    chunk: string,
    encoding: string,
    callback: TransformCallback
  ) {
    this.temp += chunk
    // TODO temp is too big
    callback()
  }
  public _flush(callback: TransformCallback) {
    const buffer = Buffer.from(this.temp)
    const charset = char_det.detect(buffer)
    let output = buffer.toString()
    if (charset) {
      output =
        typeof charset === 'string'
          ? iconv.decode(buffer, charset as string)
          : iconv.decode(buffer, (charset as char_det.Confidence[])[0].name)
    }
    this.push(output)
    callback()
  }
}

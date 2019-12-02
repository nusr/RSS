import fs from 'fs'
import { EDBName } from '../../shared'
export class BaseModel<Type> {
  private filePath: EDBName
  private fileEncoding = 'utf8'
  public constructor(filePath: EDBName) {
    this.filePath = filePath
  }
  // eslint-disable-next-line
  private isEmpty(value: any): boolean {
    return !value || !(Object.keys(value) || value).length
  }
  protected updateJsonFile(data: Type[], bool = false) {
    if (!this.filePath || this.isEmpty(data)) {
      return false
    }
    let jsonData = ''
    if (bool) {
      jsonData = JSON.stringify(data, null, 2)
    } else {
      jsonData = JSON.stringify(data)
    }
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, jsonData, this.fileEncoding, error => {
        if (error) {
          // TODO 无法调用 fs 模块
          console.error(error)
          reject(`JSON 写入${this.filePath}失败`)
        } else {
          resolve(data)
        }
      })
    })
  }

  protected readJsonFile(): Promise<Type[]> {
    return new Promise(resolve => {
      fs.readFile(this.filePath, this.fileEncoding, (error, data) => {
        if (error) {
          // console.error(error)
          resolve([])
          return
        }
        if (data) {
          resolve(JSON.parse(data))
        } else {
          resolve([])
        }
      })
    })
  }
}

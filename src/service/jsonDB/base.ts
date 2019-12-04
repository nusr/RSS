import fs from 'fs'
import path from 'path'
import { EDBName } from '../../shared'
export class BaseModel<Type> {
  private filePath: EDBName
  private fileEncoding = 'utf8'
  public constructor(filePath: EDBName) {
    this.filePath = filePath
    this.initDB()
  }
  private initDB() {
    fs.exists(this.getFilePath(), (isExist: boolean) => {
      if (!isExist) {
        this.updateJsonFile([])
      }
    })
  }
  // eslint-disable-next-line
  private isEmpty(value: any): boolean {
    return !value || !(Object.keys(value) || value).length
  }
  private getFilePath(): string {
    return path.join(process.cwd(), this.filePath)
  }
  protected updateJsonFile(data: Type[], bool = false) {
    const filePath = this.getFilePath()
    if (!filePath || this.isEmpty(data)) {
      return false
    }
    let jsonData = ''
    if (bool) {
      jsonData = JSON.stringify(data, null, 2)
    } else {
      jsonData = JSON.stringify(data)
    }
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, jsonData, this.fileEncoding, error => {
        if (error) {
          // TODO 无法调用 fs 模块
          console.error('updateJsonFile', error)
          reject(`JSON 写入${filePath}失败`)
        } else {
          resolve(data)
        }
      })
    })
  }

  protected readJsonFile(): Promise<Type[]> {
    const filePath = this.getFilePath()
    return new Promise(resolve => {
      fs.readFile(filePath, this.fileEncoding, (error, data) => {
        if (error) {
          console.error('readJsonFile', error)
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

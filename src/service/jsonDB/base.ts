import fs from 'fs'
import { EDBName } from '../../shared'
export class BaseModel<Type> {
  private filePath: EDBName
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
      fs.writeFile(this.filePath, jsonData, error => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  protected readJsonFile(): Promise<Type[]> {
    return new Promise(resolve => {
      fs.readFile(this.filePath, 'utf8', (error, data) => {
        if (error) {
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

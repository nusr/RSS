import fs from 'fs'
export class BaseModel<Type> {
  private filePath: string
  public constructor(filePath: string) {
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
          resolve(true)
        }
      })
    })
  }

  protected readJsonFile(): Promise<Type[]> {
    return new Promise(resolve => {
      fs.readFile(this.filePath, 'utf8', (error, data) => {
        if (error) {
          resolve(null)
          return
        }
        if (data) {
          resolve(JSON.parse(data))
        } else {
          resolve(null)
        }
      })
    })
  }
}

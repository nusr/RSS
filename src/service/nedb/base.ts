import { EDBName } from '../../shared'
import DataStore from 'nedb'
export class BaseModel<Type> {
  private dataBase: DataStore
  private filePath: string
  public constructor(filePath: EDBName) {
    this.filePath = filePath
    this.dataBase = new DataStore<Type>({
      filename: filePath,
      autoload: true,
    })
  }
  protected getAll() {
    return new Promise((resolve, reject) => {
      this.dataBase.find({}, (error: Error, list: Type[]) => {
        if (error) {
          console.error(error)
          reject()
        } else {
          resolve(list)
        }
      })
    })
  }
  public find(id: string) {
    return new Promise((resolve, reject) => {
      this.dataBase.find(
        {
          id,
        },
        (error: Error, item: Type[]) => {
          if (error) {
            console.error(error)
            reject()
          } else {
            resolve(item[0])
          }
        }
      )
    })
  }
  private async insertOne(data: Type) {
    return new Promise((resolve, reject) => {
      this.dataBase.insert(data, (error: Error) => {
        if (error) {
          console.error(error)
          reject()
        } else {
          resolve()
        }
      })
    })
  }
  protected async insert(list: Type[] = []) {
    for (let data of list) {
      // @ts-ignore
      const temp = await this.find(data.id)
      if (!temp) {
        await this.insertOne(data)
      }
    }
    return true
  }
  protected updateOne<T>(id: string, key: string, value: T) {
    return new Promise((resolve, reject) => {
      this.dataBase.update(
        { id },
        {
          $set: {
            [key]: value,
          },
        },
        { multi: true },
        (error: Error) => {
          if (error) {
            console.error(error)
            reject()
          } else {
            resolve()
          }
        }
      )
    })
  }
  protected updateAll(id: string, rest: Type) {
    return new Promise((resolve, reject) => {
      this.dataBase.update({ id }, rest, { upsert: true }, (error: Error) => {
        if (error) {
          console.error(error)
          reject()
        } else {
          resolve()
        }
      })
    })
  }
  protected remove(id: string) {
    return new Promise((resolve, reject) => {
      this.dataBase.remove({ id }, {}, (error: Error) => {
        if (error) {
          console.error(error)
          reject()
        } else {
          resolve()
        }
      })
    })
  }
  public removeAll() {
    return new Promise((resolve, reject) => {
      this.dataBase.remove(
        {},
        { multi: true },
        (error: Error, numRemoved: number) => {
          if (error) {
            console.error(error)
            reject()
          } else {
            console.info(`清空${this.filePath}，共${numRemoved}条数据！`)
            resolve(numRemoved)
          }
        }
      )
    })
  }
}

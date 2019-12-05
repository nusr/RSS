import { EDBName } from '../../shared'
import DataStore from 'nedb'
export class BaseModel<Type> {
  private dataBase: DataStore
  public constructor(filePath: EDBName) {
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
        (error: Error, item: Type) => {
          if (error) {
            console.error(error)
            reject()
          } else {
            resolve(item)
          }
        }
      )
    })
  }
  protected insert(list: Type[] = []) {
    return new Promise((resolve, reject) => {
      this.dataBase.insert(list, (error: Error) => {
        if (error) {
          console.error(error)
          reject()
        } else {
          resolve()
        }
      })
    })
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
}

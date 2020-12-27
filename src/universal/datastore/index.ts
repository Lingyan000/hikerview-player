import Datastore from 'lowdb'
// @ts-ignore
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'
import { dbChecker } from './dbChecker'

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

dbChecker()

class DB {
  private db: Datastore.LowdbSync<Datastore.AdapterSync>;
  constructor () {
    const adapter = new FileSync(path.join(STORE_PATH, '/data.json'))

    this.db = Datastore(adapter)
    this.db._.mixin(LodashId)
  }
  read () {
    return this.db.read()
  }
  get (key = '') {
    return this.read()
      .get(key)
      .value()
  }
  set (key: string, value: any) {
    return this.read()
      .set(key, value)
      .write()
  }
  has (key: string) {
    return this.read()
      .has(key)
      .value()
  }
  insert (key: string, value: any): void {
    return (
      this.read()
        .get(key)
        // @ts-ignore
        .insert(value)
        .write()
    )
  }
  unset (key: string, value: any): boolean {
    return this.read()
      .get(key)
      .unset(value)
      .value()
  }
  getById (key: string, id: string) {
    return (
      this.read()
        .get(key)
        // @ts-ignore
        .getById(id)
        .value()
    )
  }
  removeById (key: string, id: string) {
    return (
      this.read()
        .get(key)
        // @ts-ignore
        .removeById(id)
        .write()
    )
  }
}

export default new DB()

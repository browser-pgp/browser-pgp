import RxDB, { RxDatabase } from 'rxdb'
import { PGPUserCollection, initPGPUser } from '~modules/pgp-user'

type MyDatabaseCollections = {
  users: PGPUserCollection
}

RxDB.plugin(require('pouchdb-adapter-idb'))
let initPromise: Promise<any>
export async function init(force = false) {
  if (!force && initPromise) {
    return initPromise
  }
  initPromise = Promise.resolve().then(async () => {
    myDatabase = await RxDB.create({
      name: 'pgp',
      adapter: 'idb',
    })

    const initCollection = (
      tableName: keyof MyDatabaseCollections,
      f: (db: MyDatabase, tableName: string) => any,
    ) => {
      return f(myDatabase, tableName)
    }

    await Promise.all([initCollection('users', initPGPUser)])
  })
  return initPromise
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>

export let myDatabase: MyDatabase

export async function getMyDatabase() {
  await init()
  return myDatabase
}

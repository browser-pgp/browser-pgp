import RxDB, { RxDatabase } from 'rxdb'
import { PGPUserCollection, initPGPUser } from '~modules/pgp-user'

type MyDatabaseCollections = {
  users: PGPUserCollection
}

RxDB.plugin(require('pouchdb-adapter-idb'))
export async function init() {
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
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>

export let myDatabase: MyDatabase

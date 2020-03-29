import { getMyDatabase } from './db'
import RxDB from 'rxdb'

export async function sync() {
  await RxDB.plugin(await import('pouchdb-adapter-http'))
  const db = await getMyDatabase()
  db.collections.users
    .sync({
      remote: 'http://admin:rot@127.0.0.1:5984/browser-pgp',
      options: {
        // sync-options (optional) from https://pouchdb.com/api.html#replication
        live: true,
        // retry: true,
      },
    })
    .complete$.toPromise()
}

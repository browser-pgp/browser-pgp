import type { MyDatabase } from '~libs/db'
import { PGPUserSchema,  PGPUserDocType } from "./pgp-user";

export async function initPGPUser(db: MyDatabase,tableName:string) {
  console.log('init pgp user collection')
  await db.collection<PGPUserDocType>({
    name: tableName,
    schema: PGPUserSchema,
  })
}

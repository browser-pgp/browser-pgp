import { RxJsonSchema, RxCollection } from 'rxdb'
export type PGPUserDocType = {
  name: string
  email: string
  /**备注 */
  mark: string
}

export const PGPUserSchema: RxJsonSchema<PGPUserDocType> = {
  title: 'pgp user schema',
  version: 0,
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    mark: {
      type: 'string',
    },
  },
}

export type PGPUserCollection = RxCollection<PGPUserDocType>

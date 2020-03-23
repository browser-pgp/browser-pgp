import { RxJsonSchema, RxDocument, RxCollection } from 'rxdb'
export type PGPUserDocType = {
  name?: string
  email?: string
  publicKey: string
  privateKey?: string
  revocationCertificate?: string
}

export type PGPUserDucment = RxDocument<PGPUserDocType>

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
    publicKey: {
      type: 'string',
    },
    privateKey: {
      type: 'string',
    },
    revocationCertificate: {
      type: 'string',
    },
  },
  required: ['publicKey'],
}

export type PGPUserCollection = RxCollection<PGPUserDocType>

import { RxJsonSchema, RxDocument, RxCollection } from 'rxdb'
export type PGPUserDocType = {
  name?: string
  email?: string
  publicKey: string
  fingerprint: string
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
      default: '',
    },
    email: {
      type: 'string',
      default: '',
    },
    publicKey: {
      type: 'string',
    },
    fingerprint: {
      type: 'string',
      primary: true,
    },
    privateKey: {
      type: 'string',
    },
    revocationCertificate: {
      type: 'string',
    },
  },
  required: ['publicKey', 'fingerprint'],
}

export type PGPUserCollection = RxCollection<PGPUserDocType>

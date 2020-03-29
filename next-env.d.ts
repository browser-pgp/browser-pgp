/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly PATH_EXT_NAME: string
    readonly PATH_PREFIX: string
  }
}

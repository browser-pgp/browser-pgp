import openpgp from 'openpgp'
import { useEffect } from 'react'
import localforage from 'localforage'

export default () => {
  useEffect(() => {
    localforage.getItem<string>('5555').then(a => {
      console.log(a,777777)
    })
  })
  return <div>hello world</div>
}

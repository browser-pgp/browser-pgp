import { ImportUserState } from './ImportUser.state'
import { toDisplayKeyInfo } from '../KeyInfo/KeyInfo.state'
import * as openpgp from 'openpgp'
import { myDatabase } from '~libs/db'
import { useStepNotification } from '~modules/utils/useStepNotification'

export const useImportUser = () => {
  const [state, setState] = ImportUserState.useContainer()
  const importUserNotification = useStepNotification('导入用户公钥')
  const close = () => {
    setState(s => ({ ...s, open: false }))
  }
  const open = () => {
    setState(s => ({ ...s, open: true }))
  }
  const importUser = async (pubKey: string) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        let {
          keys: [key],
          err,
        } = await openpgp.key.readArmored(pubKey)
        if (err) {
          throw err[0]
        }
        let fingerprint = key.getFingerprint()
        console.log(fingerprint)
        let u = await myDatabase.users
          .findOne()
          .where('fingerprint')
          .eq(fingerprint)
          .$.toPromise()
        console.log(u)
        if (u) {
          throw new Error('公钥已存在')
        }
        const userid = (await key.getPrimaryUser()).user.userId.userid
        const { name, email } = openpgp.util.parseUserId(userid)
        await myDatabase.users.insert({
          publicKey: pubKey,
          fingerprint,
          name: name,
          email: email,
        })
        close()
      })
      .then(...importUserNotification)
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }
  return {
    state,
    setState,
    close,
    open,
    importUser,
  }
}

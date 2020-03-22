import { useSnackbar } from 'notistack'

export const useStepNotification = (
  step: string,
): [() => any, (e: any) => any] => {
  const { enqueueSnackbar } = useSnackbar()
  return [
    () => {
      enqueueSnackbar(`${step} 执行成功`)
    },
    (err: Error) => {
      enqueueSnackbar(`${step} 执行失败. 错误原因: ${err?.message}`)
      console.error(err)
    },
  ]
}

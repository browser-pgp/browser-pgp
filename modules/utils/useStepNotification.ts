import { useSnackbar } from 'notistack'

export interface StepErrorOutputConfig {
  console: boolean
  notistack: boolean
}
const DefaultStepErrorOutputConfig: StepErrorOutputConfig = {
  console: true,
  notistack: true,
}
export class StepError extends Error {
  public config: StepErrorOutputConfig = {
    console: true,
    notistack: true,
  }
  public setOutput(config: StepErrorOutputConfig) {
    Object.assign(this.config, config)
    return this
  }
}
export class NotistackOnlyError extends StepError {
  public config: StepErrorOutputConfig = {
    console: false,
    notistack: true,
  }
}

export class SilentError extends StepError {
  public config: StepErrorOutputConfig = {
    console: false,
    notistack: false,
  }
}

export const useStepNotification = (
  step: string,
): [() => any, (e: any) => any] => {
  const { enqueueSnackbar } = useSnackbar()
  return [
    () => {
      enqueueSnackbar(`${step} 执行成功`)
    },
    (err: Error) => {
      const outputConfig =
        err instanceof StepError ? err.config : DefaultStepErrorOutputConfig
      if (outputConfig.notistack) {
        enqueueSnackbar(`${step} 执行失败. 错误原因: ${err?.message}`)
      }
      if (outputConfig.console) {
        console.error(err)
      }
    },
  ]
}

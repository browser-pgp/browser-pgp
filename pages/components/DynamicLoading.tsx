import { Fragment } from 'react'
export const DynamicLoading = (props: {
  error?: Error | null
  isLoading?: boolean
  pastDelay?: boolean
  timedOut?: boolean
}) => {
  let body: JSX.Element
  if (props.error) {
    body = (
      <Fragment>
        出现错误:
        <pre>{props.error?.message}</pre>
      </Fragment>
    )
  }
  if (props.timedOut) {
    body = <Fragment>加载超时</Fragment>
  }
  if (props.isLoading) {
    body = <Fragment>loading</Fragment>
  }
  return <div style={{ padding: 15 }}>{body}</div>
}
export default DynamicLoading

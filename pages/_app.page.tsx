import React from 'react'
import App from 'next/app'

import dynamic from 'next/dynamic'
const Provider = dynamic(
  async () => {
    const mod = await import('./_provider')
    await mod.init().catch(err => {
      console.error(err)
      throw err
    })
    return mod.default
  },
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  },
)

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    if (typeof pageProps.statusCode !== 'undefined') {
      return <Component {...pageProps} />
    }
    return (
      <Provider>
        <Component {...pageProps} />
      </Provider>
    )
  }
}

export default MyApp

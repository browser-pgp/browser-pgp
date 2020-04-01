import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { MainColor } from './_theme.constant'

const CssBaseLine = `
html {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*, *::before, *::after {
  box-sizing: inherit;
}
strong, b {
  font-weight: 700;
}
body {
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
  font-size: 0.875rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  background-color: #fafafa;
}
@media print {
  body {
    background-color: #fff;
  }
}
body::backdrop {
  background-color: #fafafa;
}
`

class MyDocument extends Document {
  render() {
    return (
      <html lang="zh-hans">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="description"
            content="PGP in Browser is a pgp tool website Progressive Web App (PWA), not online, by use openpgp.js encrypt data in your browser, no ga track you"
          />
          <meta
            name="keywords"
            content="pgp,tool,browser,openpgp.js,online,pwa,Progressive Web App"
          />
          {/* /index.html is enough */}
          <meta name="robots" content="noindex, nofollow" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta name="theme-color" content={MainColor} />
          <style>{`
          html, body, #__next{
            height: 100%;
            width: 100%;
          }
          ${CssBaseLine}
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default MyDocument

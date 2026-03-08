import Document, { Head, Main, NextScript } from 'next/document'
import React from 'react'

// Custom Html wrapper — bypasses Next.js context check that fails in static generation
function Html({ children, ...props }: React.HTMLAttributes<HTMLHtmlElement>) {
  return <html {...props}>{children}</html>
}

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

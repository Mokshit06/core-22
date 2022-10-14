import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          id="cesium_base_url"
          strategy="beforeInteractive"
        >{`window.CESIUM_BASE_URL = "http://localhost:3000/cesium"`}</Script>
      </body>
    </Html>
  );
}

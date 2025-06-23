// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Welcome to your 1:1 session with SpiñO – the Spinozistic AI coach." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import Head from 'next/head';
import ChatBox from '../components/ChatBox';

export default function Home() {
  return (
    <>
      <Head>
        <title>SpiñO AI</title>
        <meta name="description" content="Your 1:1 Spinozist reflection assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', fontFamily: 'Georgia, serif' }}>
        <h1><strong>SpiñO AI</strong></h1>
        <ChatBox />
      </main>
    </>
  );
}
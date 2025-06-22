import React, { useState } from 'react';
import Head from 'next/head';

type Message = {
  sender: 'user' | 'spino';
  text: string;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessages: Message[] = [...messages, { sender: 'user' as const, text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');

      setMessages((prev) => [...prev, { sender: 'spino' as const, text: data.reply }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SpiñO – The Spinozist Coach</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-white text-black p-4">
        <h1 className="text-xl font-semibold mb-4">Welcome to a 1:1 session with SpiñO – the Spinozistic AI coach.</h1>
        <div className="space-y-2 mb-4 max-h-[60vh] overflow-y-auto border rounded p-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
              <span className="inline-block rounded px-3 py-1 bg-gray-100">{msg.text}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-grow border px-3 py-1 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your message..."
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-1 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </main>
    </>
  );
}
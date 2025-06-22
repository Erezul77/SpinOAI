'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Message {
  sender: 'user' | 'spino';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'spino', content: "Welcome to your 1:1 session with SpiñO. What's troubling you?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { sender: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages([...newMessages, { sender: 'spino', content: data.reply }]);
    } catch (err) {
      setError('Failed to fetch response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Image src="/spino_logo.png" alt="SpiñO Logo" width={64} height={64} />
        <h1 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>SpiñO AI</h1>
      </div>

      {messages.map((msg, idx) => (
        <p key={idx}>
          <strong>{msg.sender === 'user' ? 'You' : 'SpiñO'}:</strong> {msg.content}
        </p>
      ))}

      <textarea
        rows={3}
        style={{ width: '100%', marginTop: '1rem' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <br />
      <button onClick={handleSend} disabled={loading} style={{ marginTop: '0.5rem' }}>
        {loading ? 'Sending...' : 'Send'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  );
}

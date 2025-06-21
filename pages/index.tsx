import React, { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SpiñO AI</h1>

      <div style={{ marginBottom: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.role === 'user' ? 'You' : 'SpiñO'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <button onClick={handleSend} disabled={loading || !input.trim()}>
        {loading ? 'Thinking…' : 'Send'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

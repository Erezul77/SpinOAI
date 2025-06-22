// src/main.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

interface Message {
  sender: 'user' | 'spino';
  text: string;
}

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'spino', text: "Welcome to your 1:1 session with SpiñO. What's troubling you?" }
  ]);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { sender: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setMessages(prev => [...prev, { sender: 'spino', text: data.reply }]);
    } catch (err: any) {
      setError(err.message || 'Failed to get a reply.');
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SpiñO AI</h1>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender === 'user' ? 'You' : 'SpiñO'}:</strong> {msg.text}</p>
        ))}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        style={{ width: '100%', marginTop: '1rem' }}
      />
      <button onClick={sendMessage} disabled={!input.trim()} style={{ marginTop: '0.5rem' }}>
        Send
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);

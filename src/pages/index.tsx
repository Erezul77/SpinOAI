import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Welcome to your 1:1 session with SpiñO. What's troubling you?" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setError(`${res.status} ${data.error}`);
      }
    } catch (err) {
      setError('Failed to fetch reply.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Georgia, serif' }}>
      <h1><strong>SpiñO AI</strong></h1>
      {messages.map((msg, i) => (
        <p key={i}><strong>{msg.role === 'assistant' ? 'SpiñO:' : 'You:'}</strong> {msg.content}</p>
      ))}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        style={{ width: '100%', marginTop: '1rem' }}
      />
      <br />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{ marginTop: '0.5rem' }}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

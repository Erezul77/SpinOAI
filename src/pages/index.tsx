
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: "Welcome to your 1:1 session with SpiñO. What's troubling you?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await response.json();
      if (!data.content) throw new Error('No response');
      setMessages([...updatedMessages, { role: 'assistant', content: data.content }]);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'serif' }}>
      <h1><strong>SpiñO AI</strong></h1>
      {messages.map((msg, index) => (
        <p key={index}><strong>{msg.role === 'assistant' ? 'SpiñO' : 'You'}:</strong> {msg.content}</p>
      ))}
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginTop: '1rem' }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ marginTop: '0.5rem' }}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

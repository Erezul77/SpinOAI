import { useState } from 'react';

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to your 1:1 session with SpiñO. What's troubling you?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.result }]);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error.');
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>SpiñO AI</h1>

      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <strong>{msg.role === 'user' ? 'You' : 'SpiñO'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        style={{ width: '100%', marginTop: '1rem' }}
        disabled={loading}
      />
      <button onClick={handleSend} disabled={loading || !input.trim()} style={{ marginTop: '1rem' }}>
        Send
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  );
}


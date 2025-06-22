import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to your 1:1 session with SpiñO. What's troubling you?" }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: 'user', content: input }];
    setMessages(updatedMessages);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await res.json();
      const assistantMessage = data.message?.content || '[No response received]';

      setMessages([...updatedMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {messages.map((m, i) => (
        <p key={i}>
          <strong>{m.role === 'user' ? 'You' : 'SpiñO'}:</strong> {m.content}
        </p>
      ))}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        style={{ width: '100%', marginTop: '1rem' }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !input.trim()}
        style={{ marginTop: '0.5rem' }}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
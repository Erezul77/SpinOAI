import { useState } from 'react';
import axios from 'axios';

interface Message {
  sender: 'user' | 'spino';
  content: string;
}

export default function Main() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/chat', {
        messages: newMessages,
      });

      const reply = response.data.reply?.trim();
      if (reply) {
        setMessages([...newMessages, { sender: 'spino', content: reply }]);
      } else {
        setError("Invalid reply from SpiñO.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch response from SpiñO.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white text-black font-serif">
      {/* Head metadata – if using _app.tsx or index.html */}
      <head>
        <link rel="icon" type="image/x-icon" href="/src/assets/favicon.ico" />
        <title>SpiñO AI</title>
      </head>

      {/* Header */}
      <h1 className="text-4xl font-bold mb-4">SpiñO AI</h1>
      <p className="mb-6">
        <strong>SpiñO:</strong> Welcome to your 1:1 session with SpiñO. What's troubling you?
      </p>

      {/* Chat history */}
      <div className="mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.sender === 'user' ? 'You' : 'SpiñO'}:</strong> {msg.content}
          </p>
        ))}
        {loading && <p><strong>SpiñO:</strong> ...</p>}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <textarea
          className="border p-2 w-full h-20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your reflection..."
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>

      {/* Error message */}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

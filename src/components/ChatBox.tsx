import React, { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    const newMessage: Message = { role: 'user', content: input };
    const updatedMessages: Message[] = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (res.ok && data.result) {
        const assistantMessage: Message = { role: 'assistant', content: data.result };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl mb-4 font-bold text-center">Welcome to a 1:1 session with <span className="text-purple-600">SpiñO</span></h1>
      <div className="space-y-2 mb-4 max-h-[60vh] overflow-y-auto p-2 border rounded">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.role === 'user' ? 'bg-blue-100 text-left' : 'bg-purple-100 text-right'
            }`}
          >
            <span className="font-semibold">{m.role === 'user' ? 'You' : 'SpiñO'}:</span> {m.content}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 text-right">SpiñO is thinking…</div>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
      <div className="flex space-x-2">
        <input
          className="border p-2 flex-grow rounded"
          placeholder="Write your reflection..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

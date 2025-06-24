
import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Main: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome Love, How do you feel today?" }
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const filteredMessages = messages.filter(msg => msg.role === 'user');
    const newMessages = [...filteredMessages, userMessage];

    setMessages([...messages, userMessage]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', {
        messages: newMessages
      });

      const reply = res.data.reply?.content || 'SpiñO could not generate a reply.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('SpiñO could not generate a reply.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 font-serif">
      <header className="bg-white shadow p-4 text-center text-2xl font-bold tracking-wide text-indigo-700">
        SpiñO – Your Reflection Companion
      </header>

      <div className="max-w-2xl mx-auto bg-white mt-6 p-6 rounded-2xl shadow-md">
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-100 text-right ml-12'
                  : 'bg-gray-200 text-left mr-12'
              }`}
            >
              <div className="text-sm text-gray-700">
                <strong>{msg.role === 'user' ? 'You' : 'SpiñO'}:</strong> {msg.content}
              </div>
            </div>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-indigo-200 resize-none"
          placeholder="Type your reflection and press Enter to send..."
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="text-right mt-2">
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Main;

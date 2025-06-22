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

  const sendMessage = async () => {
    const newMessages: Message[] = [...messages, { sender: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/chat', {
        messages: newMessages,
      });

      const reply = response.data.reply;
      setMessages([...newMessages, { sender: 'spino', content: reply }]);
    } catch (err: any) {
      console.error(err);
      setError('Failed to get response from SpiñO.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Welcome to a 1:1 session with SpiñO – the Spinozistic AI coach.</h1>

      <div className="space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded ${msg.sender === 'user' ? 'bg-gray-200' : 'bg-blue-100'}`}>
            <strong>{msg.sender === 'user' ? 'You' : 'SpiñO'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          className="flex-1 border border-gray-300 rounded p-2"
          type="text"
          placeholder="Enter your reflection..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading || input.trim() === ''}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

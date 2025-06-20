import { useState } from 'react';
import './index.css';

function App() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendToOpenAI = async (userInput: string) => {
    const res = await fetch('/api/ask', {
      method: 'POST',
      body: JSON.stringify({ message: userInput }),
    });
    const data = await res.json();
    return data.reply;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendToOpenAI(input);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Error from OpenAI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1>🧠 SpiñO</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'SpiñO'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask something..."
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? 'Thinking…' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;

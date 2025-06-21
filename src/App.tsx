import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);

  const sendMessage = async () => {
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error: Unable to fetch response.' }]);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>SpiñO AI</h1>
      <div style={{ height: 400, border: '1px solid gray', borderRadius: 10, padding: 10, overflowY: 'scroll' }}>
        {messages.map((m, i) => (
          <div key={i}><strong>{m.role}:</strong> {m.content}</div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 10, padding: 10 }}>Send</button>
      </div>
    </div>
  );
}

export default App;
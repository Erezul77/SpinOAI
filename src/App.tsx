
import React, { useState } from 'react';

console.log("✅ DIAGNOSTIC: App.tsx is active and being rendered.");

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are now running the DIAGNOSTIC version of SpiñO.' },
    { role: 'assistant', content: '🧪 Hello, this is the DIAGNOSTIC version of SpiñO. If you see this, App.tsx is working.' }
  ]);

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: 20 }}>
      <h1>🧪 DIAGNOSTIC MODE</h1>
      <p>If you see this screen and console log, <strong>App.tsx is correctly deployed</strong>.</p>
      <div style={{ background: '#eee', padding: 10, marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.role}:</strong> {msg.content}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message"
        style={{ width: '100%', padding: 8, fontSize: 16 }}
      />
      <button onClick={handleSend} style={{ padding: 10, marginTop: 10 }}>Send</button>
    </div>
  );
}

export default App;

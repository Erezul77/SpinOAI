import { useState } from 'react';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello friend, I'm glad to meet you and happy to start this session with you." }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const data = await res.json();
    setMessages([...messages, userMessage, data]);
  };

  return (
    <div className="container">
      <h1 className="header">Welcome to a 1:1 session with <span className="logo">SpiñO</span> – the Spinozistic AI coach</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "SpiñO"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter your thought..." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
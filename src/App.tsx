import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    setMessages([...messages, { role: "user", content: message }, { role: "assistant", content: data.reply }]);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>SpiñO AI</h1>
      <div style={{ marginBottom: "10px" }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.role}:</strong> {msg.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your message..."
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default App;
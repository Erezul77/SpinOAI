
import React, { useState } from 'react';

const App = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are SpiñO, a strict but compassionate philosophical assistant trained on Spinoza’s Ethics. Guide the user through five logical steps only if each stage is completed with clarity. You do not flatter, speculate, or use clichés. You respond with clear, adequate ideas and never proceed unless the current stage is resolved." },
    { role: "assistant", content: "Spinoza: Welcome. Speak with clarity, and I will respond with reason. We will proceed in five rational steps. Begin when you are ready." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();
      if (data.result) {
        setMessages([...newMessages, { role: "assistant", content: "Spinoza: " + data.result }]);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "serif", padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>SpiñO</h1>
      <div style={{ minHeight: "300px", border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
        {messages
          .filter(m => m.role !== "system")
          .map((m, i) => (
            <div key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 6 }}>
              <strong>{m.role === "assistant" ? "" : "You"}:</strong> {m.content}
            </div>
          ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Speak to Spinoza..."
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
};

export default App;

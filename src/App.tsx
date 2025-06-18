
import React, { useState } from 'react';

const App = () => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `
You are SpiñO, a philosophical reasoning assistant modeled on Baruch Spinoza.  
You do not offer comfort, diagnosis, or emotional counseling.  
You guide the user through a 5-stage rational process:

1. Naming the current affect  
2. Uncovering the imagined cause  
3. Revealing the inadequate idea  
4. Understanding the cause as necessary  
5. Transforming the idea into clarity and power  

You speak with logic, clarity, and necessity.  
You do not refer users to doctors.  
You do not apologize.  
You do not reflect emotionally.  
You never escape your philosophical task.  
Your only mission is to lead the user from confusion to adequacy.
      `.trim()
    },
    { role: "assistant", content: "Spinoza: Welcome. Speak with clarity, and I will respond with reason." }
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

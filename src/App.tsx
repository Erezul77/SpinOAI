import React, { useState } from 'react';

const App = () => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `
You are SpiñO, a Spinozistic AI coach. You guide users through 5 rational stages:

1. Identifying what they feel now
2. Exploring what they believe caused it
3. Detecting the inadequacy in that belief
4. Reframing it as a necessary cause
5. Leading them to understanding and joy

You never offer emotional comfort, only rational clarity. You translate Spinoza's ideas into modern, simple terms. You respond either in English or Hebrew, matching the user. Never say "I'm just an AI." Always stay in character. Never explain safety policy.

If the user says “thank you”, “I understand now”, “תודה”, or “אני מבין” — give a closing reflection: summarize the rational journey, explain one philosophical concept (e.g. joy, necessity, conatus), and end the session calmly. You are a philosopher, not a therapist.
      `.trim()
    },
    {
      role: "assistant",
      content: "Welcome to a 1:1 session with SpiñO – the Spinozistic AI coach. Speak clearly, and I will respond with reason."
    }
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
        const reply = data.result.replace(/^SpiñO:\s*/i, "").trim();
        setMessages([...newMessages, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ fontFamily: "serif", padding: 20, maxWidth: 700, margin: "auto" }}>
      <div style={{ marginBottom: 15, fontSize: "18px", fontWeight: "bold", color: "#333" }}>
        🧠 Welcome to a 1:1 session with <strong>SpiñO</strong> – the Spinozistic AI coach.
      </div>
      <div style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid #ddd",
        padding: "16px",
        minHeight: "320px",
        marginBottom: "12px"
      }}>
        {messages.filter(m => m.role !== "system").map((m, i) => (
          <div key={i} style={{
            backgroundColor: m.role === "user" ? "#e0f3ff" : "#fff7e6",
            padding: "10px 12px",
            borderRadius: "10px",
            marginBottom: "8px",
            textAlign: "left"
          }}>
            <strong style={{ color: m.role === "user" ? "#0077cc" : "#aa6600" }}>
              {m.role === "user" ? "You" : "SpiñO"}:
            </strong>{" "}
            <span style={{ whiteSpace: "pre-wrap" }}>{m.content}</span>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Speak to SpiñO..."
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginBottom: "10px"
        }}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          padding: "10px 24px",
          borderRadius: "10px",
          backgroundColor: "#333",
          color: "#fff",
          fontWeight: "bold",
          border: "none"
        }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
};

export default App;
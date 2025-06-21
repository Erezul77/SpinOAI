
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import ChatMessage from "./components/ChatMessage";
import { saveSession } from "./saveSession";
import { generateSessionSummary } from "./sessionSummary";
import { exportSessionToJSON } from "./exportSession";
import "./index.css";

export default function App() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sessionSaved, setSessionSaved] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const endRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await response.json();
    setMessages(data.messages);

    if (data.messages.length >= 10 && !sessionSaved) {
      await saveSession(data.messages);
      const summary = generateSessionSummary(data.messages);
      console.log("Session Summary:", summary);
      setSessionSummary(summary);
      setSessionSaved(true);
    }
  };

  const handleExport = () => {
    exportSessionToJSON(messages);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app">
      <Header />
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index}>
            <ChatMessage message={msg} />
            {msg.role === "assistant" && (
              <div style={{ fontSize: "0.8rem", color: "#888", marginLeft: "1rem" }}>
                ΔP: {msg.deltaP ?? "-"} | ΔA: {msg.deltaA ?? "-"}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="input-bar">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your reflection..."
        />
        <button onClick={handleSend}>→</button>
        <button onClick={handleExport} style={{ marginLeft: "0.5rem" }}>Export</button>
      </div>

      {sessionSummary && (
        <div style={{ padding: "1rem", fontSize: "0.9rem", background: "#f8f8f8", marginTop: "1rem" }}>
          <strong>Session Summary:</strong><br />
          Total Exchanges: {sessionSummary.totalExchanges}<br />
          User Turns: {sessionSummary.userCount}, Assistant Turns: {sessionSummary.assistantCount}<br />
          Keywords: {sessionSummary.keywords.join(", ")}
        </div>
      )}
    </div>
  );
}

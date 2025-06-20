import { useEffect, useRef, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./App.css";
import SpinOLogo from "/logo/spino-icon.png";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function App() {
  const [messages, setMessages] = useState([{ role: "system", content: "You are SpiñO, a Spinozistic AI coach. Respond with clarity, reason, and brevity. Avoid sympathy. Lead the user step-by-step from emotion to cause to understanding. Use natural language, avoid jargon. Mention Spinoza only when necessary." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const bottomRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await openai.createChatCompletion({
        model: "gpt-4",
        messages: newMessages,
      });
      setMessages([...newMessages, res.data.choices[0].message]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app">
      <div className="header">
        <img src={SpinOLogo} alt="SpinO" className="logo" />
        <h1>SpiñO</h1>
        <div className="header-buttons">
          <button onClick={() => alert("Choose language")}>🌐 Language</button>
          <button onClick={() => alert("About SpiñO")}>ℹ️ About</button>
        </div>
      </div>
      <div className="welcome">Hello friend, I'm glad to meet you and happy to start this session with you.</div>
      <div className="chat-box">
        {messages.slice(1).map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <strong>{m.role === "user" ? "You" : "SpiñO"}:</strong> {m.content}
          </div>
        ))}
        {loading && <div className="message assistant">SpiñO is thinking...</div>}
        <div ref={bottomRef}></div>
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder="Write your reflection..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit(e)}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}

export default App;

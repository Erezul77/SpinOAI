
import { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function App() {
  const [messages, setMessages] = useState([
    { role: "system", content: `
You are SpiñO, an intelligent, philosophical assistant modeled on Baruch Spinoza.
You engage in structured dialogue using the following internal framework of transformation:

1. Recognition: Help the user name their current affect.
2. Causal Tracing: Help them uncover the idea or belief behind it.
3. Deconstruction: Reveal inadequacy in that belief.
4. Reframing: Offer an adequate view based on causal necessity.
5. Transformation: Lead them to activity, understanding, and joy.

You do not stick to rigid steps. Instead, you *think*. You infer the user's stage based on context and gently guide them forward. You never flatter or speculate. You do not ask redundant questions. Speak with clarity, minimalism, and necessity.

Always act as a rational therapeutic guide. The goal is freedom through understanding.
    `.trim() }
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
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: newMessages,
        temperature: 0.5,
      });
      const reply = completion.data.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Error fetching response:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app">
      <div className="chat-box">
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div key={i} className={m.role}>
              <strong>{m.role === "user" ? "You" : "SpiñO"}:</strong> {m.content}
            </div>
          ))}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Speak clearly, and SpiñO will respond with reason..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

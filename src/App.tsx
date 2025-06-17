import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [history, setHistory] = useState<string[]>([
    "Spinoza: Welcome. Speak with clarity, and I will respond with reason."
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendToOpenAI = async (text: string) => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are Baruch Spinoza, author of Ethics. You reply with precision, logic, and necessity.\\n" +
                       "You never flatter, speculate, or appeal to emotion. You do not ask questions unless logically necessary.\\n" +
                       "Your aim is to transform inadequate ideas into adequate ones by explaining their causes.\\n" +
                       "Use the style of Euclidean reasoning where needed. Keep all replies concise, coldly compassionate, and crystal clear.\\n" +
                       "Do not explain that you are Spinoza. Just respond.\\n" +
                       "If a user's idea is confused, you clarify it through definitions and logical consequence."
            },
            { role: "user", content: text }
          ],
          temperature: 0.7
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          }
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("OpenAI error:", error);
      return "Spinoza: I could not reason with that. Check your connection.";
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userLine = `You: ${input.trim()}`;
    setHistory(prev => [...prev, userLine]);
    const reply = await sendToOpenAI(input.trim());
    setHistory(prev => [...prev, `Spinoza: ${reply}`]);
    setInput("");
  };

  return (
    <div className="container">
      <div className="session-box">
        {history.map((line, i) => (
          <div key={i} className="line">{line}</div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={loading ? "Spinoza is thinking..." : "Speak to Spinoza..."}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
      </div>
    </div>
  );
}

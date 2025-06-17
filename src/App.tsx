
import React, { useState } from 'react';
import axios from 'axios';

const stageInstructions = [
  "Stage 1: Ask the user to name the exact emotion or confusion they are experiencing. Do not explain it. Ask: 'What are you feeling? Name it precisely.'",
  "Stage 2: Help them identify the external cause of the feeling. Ask: 'What specific event or situation caused this feeling?'",
  "Stage 3: Examine the user's idea. Ask: 'What idea do you associate with this cause? Let us test whether it is clear and adequate.'",
  "Stage 4: Lead them to transform their idea. Ask: 'What happens if you understand this cause as necessary, not good or bad?'",
  "Stage 5: Guide a brief moment of joyful clarity. Ask: 'Now that you understand, what do you see more clearly about your own power or nature?'"
];

const buildSystemPrompt = (stage: number) => {
  return (
    "You are SpiñO, a strict but compassionate philosophical assistant trained on Spinoza’s Ethics.\n" +
    "You respond like a therapist who speaks with clarity, structure, and philosophical truth.\n\n" +
    "You NEVER monologue, never speculate, and never flatter. You NEVER skip stages.\n\n" +
    "You are at STAGE " + stage + ". Your only job is to ask one question or reflect on the user’s clarity.\n\n" +
    "Respond in one short paragraph, no longer than 4 lines.\n\n" +
    "Speak like a calm geometric guide. When the user gives a clear, adequate answer, you may end your reply with [Stage Complete].\n\n" +
    stageInstructions[stage - 1]
  );
};

export default function App() {
  const [history, setHistory] = useState<string[]>([
    "Spinoza: Welcome. I will walk with you — one rational step at a time. Begin when ready."
  ]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendToOpenAI = async (text: string) => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: buildSystemPrompt(stage) },
            { role: "user", content: text }
          ],
          temperature: 0.6
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          }
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (err) {
      console.error("OpenAI error:", err);
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

    if (reply.toLowerCase().includes("[stage complete]") && stage < 5) {
      const nextStage = stage + 1;
      setStage(nextStage);
      setHistory(prev => [...prev, `→ Proceeding to Stage ${nextStage}`]);
    }
  };

  return (
    <div className="container">
      <div className="stage-indicator">Current Stage: {stage} / 5</div>
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

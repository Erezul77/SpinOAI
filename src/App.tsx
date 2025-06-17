
import React, { useState } from 'react';
import axios from 'axios';

const stagePrompts = [
  "Stage 1: Please name the emotion or confusion you are currently experiencing.",
  "Stage 2: What external cause or event triggered this feeling?",
  "Stage 3: Let us examine whether the idea you have is adequate or inadequate.",
  "Stage 4: I will now guide you in transforming this inadequate idea through reason.",
  "Stage 5: Let us affirm your joy by understanding your place in Nature with clarity."
];

const systemInstruction = (stage: number) => {
  return `You are Baruch Spinoza. You guide the user step-by-step through a 5-stage transformation.
Reply with clarity and logic. Use the Ethics as your foundation.
Only address the current stage (${stage}):

${stagePrompts[stage - 1]}

Do not skip ahead. Be precise, concise, and rational.`;
};

export default function App() {
  const [history, setHistory] = useState<string[]>([
    "Spinoza: Welcome. We will walk together through 5 steps of transformation. Begin when ready."
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
            { role: "system", content: systemInstruction(stage) },
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

    // Only advance if reply includes marker like "[Stage Complete]"
    if (reply.toLowerCase().includes("[stage complete]") && stage < 5) {
      setStage(prev => prev + 1);
      setHistory(prev => [...prev, `→ Moving to Stage ${stage + 1}`]);
    }
  };

  return (
    <div className="container">
      <div className="stage-indicator">Current Stage: {stage}</div>
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

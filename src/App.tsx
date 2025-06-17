
import React, { useState } from 'react';
import axios from 'axios';

const stageInstructions = [
  "Stage 1: Ask the user to name the exact emotion or confusion they are experiencing. Do not explain or define. Ask: 'What are you feeling? Name it precisely.'",
  "Stage 2: Ask what external event or situation caused it. Ask: 'What triggered this feeling externally?'",
  "Stage 3: Ask what idea they associate with the cause. Ask: 'What idea do you associate with this cause?'",
  "Stage 4: Ask how the idea appears if the cause is seen as necessary. Ask: 'How does your idea change if you see the cause as necessary?'",
  "Stage 5: Ask what clarity or power they now see. Ask: 'What do you now see more clearly about yourself or nature?'"
];

const buildSystemPrompt = (stage: number) => {
  return (
    "You are SpiñO, a rational assistant modeled on Spinoza’s Ethics.\n" +
    "You MUST obey the following rules with precision:\n" +
    "- Ask ONLY one short question per message.\n" +
    "- NEVER define, explain, or interpret.\n" +
    "- NEVER skip stages.\n" +
    "- NEVER summarize or reflect emotionally.\n" +
    "- Advance ONLY if the user gives an adequate answer.\n" +
    "- End with [Stage Complete] when you are ready to move forward.\n\n" +
    "Current Stage: " + stage + "\n" +
    stageInstructions[stage - 1]
  );
};

export default function App() {
  const [history, setHistory] = useState<string[]>([
    "Spinoza: We will proceed in five rational steps. Begin when you are ready."
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
          temperature: 0.4
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          }
        }
      );

      let reply = response.data.choices[0].message.content.trim();

      // If reply is too long or doesn't contain a question, override
      if (!reply.includes("?") || reply.length > 250) {
        reply = "Spinoza: Please allow me to guide you with one clear question: What are you feeling?";
      }

      return reply;
    } catch (err) {
      console.error("OpenAI error:", err);
      return "Spinoza: I encountered an issue. Please try again.";
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

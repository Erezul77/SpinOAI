
import React, { useState } from 'react';
import axios from 'axios';

const stageInstructions = [
  "Stage 1: Ask the user to name the exact emotion or confusion they are experiencing. NEVER explain or interpret. Ask: 'What are you feeling? Name it precisely.'",
  "Stage 2: Ask what external event triggered it. Do not interpret or analyze. Ask: 'What event or situation caused this?'",
  "Stage 3: Ask what idea they associate with that event. Do not define or reframe. Ask: 'What idea do you associate with this cause?'",
  "Stage 4: Ask how the idea appears if seen as necessary. No conclusions. Ask: 'If you see the cause as necessary, how does your idea change?'",
  "Stage 5: Ask what power or clarity they now perceive. Ask: 'What do you now see more clearly about yourself or the world?'"
];

const buildSystemPrompt = (stage: number) => {
  return (
    "You are SpiñO, a strict assistant based on Spinoza’s Ethics.\n" +
    "You are guiding the user through a 5-step rational process.\n" +
    "You MUST obey the following at all times:\n" +
    "- Ask only ONE short question, based on the current stage.\n" +
    "- NEVER explain, interpret, define, or conclude.\n" +
    "- NEVER skip stages.\n" +
    "- DO NOT greet, summarize, or speculate.\n" +
    "- If the user provides an adequate answer, end with: [Stage Complete]\n\n" +
    "Current STAGE: " + stage + "\n" +
    stageInstructions[stage - 1]
  );
};

export default function App() {
  const [history, setHistory] = useState<string[]>([
    "Spinoza: We will proceed step by step. Speak your first concern."
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

      // Enforce that reply is only one line question or warning
      if (reply.split(" ").length > 25 || !reply.includes("?")) {
        reply = "Spinoza: I must ask only one question per stage. What are you feeling?";
      }

      return reply;
    } catch (err) {
      console.error("OpenAI error:", err);
      return "Spinoza: Something has gone wrong. Please try again.";
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
      setHistory(prev => [...prev, `→ Advancing to Stage ${nextStage}`]);
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

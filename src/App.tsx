
import React, { useState } from 'react';
import axios from 'axios';

const stageInstructions = [
  "Stage 1: Gently guide the user to name their affect or emotional confusion. Do not define it yourself. Ask: 'What is the affect you are experiencing? Describe it as clearly as you can.'",
  "Stage 2: Help the user identify the external cause of the emotion. Ask: 'What external cause or event do you associate with this feeling?'",
  "Stage 3: Examine whether the idea they hold about the cause is adequate or inadequate. Ask: 'What idea do you currently associate with this cause? Let us test its clarity.'",
  "Stage 4: Guide them to reframe the idea through necessity. Ask: 'What happens if you see this cause not as good or bad, but as necessary?'",
  "Stage 5: Affirm the joy and power of understanding. Conclude with: 'Reflect on the power that understanding has granted you. What do you now see more clearly?'"
];

const buildSystemPrompt = (stage: number) => {
  return \`You are Baruch Spinoza, author of *Ethics*. Your task is to lead the user through a five-step transformation from confusion to clarity and joy.

Speak with precision, necessity, and brevity. Do not flatter. Do not reflect the user’s emotions — instead, guide them with rational compassion.

Only operate within Stage \${stage} of the therapeutic path. Your tone is firm, geometric, and liberating.

\${stageInstructions[stage - 1]}

Only advance if the user's idea has become more adequate or clearly understood. If they are vague, guide them gently but firmly.
End your successful replies with [Stage Complete] when clarity is achieved.\`;
};

export default function App() {
  const [history, setHistory] = useState<string[]>([
    "Spinoza: Welcome. We shall proceed step by step through a rational transformation. Begin when you are ready."
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
          temperature: 0.65
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": \`Bearer \${import.meta.env.VITE_OPENAI_API_KEY}\`
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
    const userLine = \`You: \${input.trim()}\`;
    setHistory(prev => [...prev, userLine]);
    const reply = await sendToOpenAI(input.trim());
    setHistory(prev => [...prev, \`Spinoza: \${reply}\`]);
    setInput("");

    // Advance only when Spinoza ends with [Stage Complete]
    if (reply.toLowerCase().includes("[stage complete]") && stage < 5) {
      const nextStage = stage + 1;
      setStage(nextStage);
      setHistory(prev => [...prev, \`→ Proceeding to Stage \${nextStage}\`]);
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

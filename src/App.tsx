
import React, { useState } from 'react';
import axios from 'axios';

const stageInstructions = [
  "Stage 1: Ask the user to name the exact emotion they are feeling. You may infer emotion only if they say something like 'burnout', 'numb', 'exhausted', 'low', 'apathy', 'mental fatigue'. Then confirm: 'You are feeling [x], correct?' If yes, reply with [Stage Complete].",
  "Stage 2: Ask what external event or situation triggered it. Ask: 'What triggered this feeling externally?'",
  "Stage 3: Ask what idea they associate with the cause. Ask: 'What idea do you associate with this cause?'",
  "Stage 4: Ask how the idea appears if the cause is seen as necessary. Ask: 'How does your idea change if you see the cause as necessary?'",
  "Stage 5: Ask what clarity or power they now see. Ask: 'What do you now see more clearly about yourself or nature?'"
];

const emotionKeywords = [
  "fatigue", "burnout", "numb", "hopeless", "overwhelmed",
  "exhausted", "tired", "low", "down", "empty", "apathy", "depressed"
];

const buildSystemPrompt = (stage: number) => {
  return (
    "You are SpiñO, a rational assistant based on Spinoza’s Ethics.\n" +
    "You will guide the user through 5 precise stages.\n" +
    "- You may infer the user's emotion in Stage 1 if they use a clear emotional word.\n" +
    "- Ask ONLY one short question or confirm an emotion.\n" +
    "- Do NOT define, explain, or reflect.\n" +
    "- Proceed ONLY if the user's emotion is confirmed.\n" +
    "- Always end a valid transition with [Stage Complete].\n\n" +
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

  const detectKeywordMatch = (userText: string) => {
    const text = userText.toLowerCase();
    return emotionKeywords.find(keyword => text.includes(keyword));
  };

  const sendToOpenAI = async (text: string, inferred: string | null = null) => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: buildSystemPrompt(stage) },
            { role: "user", content: inferred ? `User used the phrase "${inferred}". Confirm the emotion.` : text }
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

      // Minimal enforcement
      if (!reply.includes("?") && !reply.toLowerCase().includes("[stage complete]")) {
        reply = "Spinoza: What are you feeling? Name it precisely.";
      }

      return reply;
    } catch (err) {
      console.error("OpenAI error:", err);
      return "Spinoza: Something has gone wrong.";
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userLine = `You: ${input.trim()}`;
    setHistory(prev => [...prev, userLine]);

    const keyword = stage === 1 ? detectKeywordMatch(input) : null;
    const reply = await sendToOpenAI(input.trim(), keyword || null);
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


import React, { useState } from 'react';
import axios from 'axios';

const stageInstructions = [
  "Stage 1: Ask the user to name the exact emotion or confusion they are experiencing. Do not define, explain, or analyze. Ask: 'What are you feeling? Name it precisely.'",
  "Stage 2: Ask the user what specific external event or situation caused the feeling. Do not explain or analyze. Ask: 'What external cause or event triggered this feeling?'",
  "Stage 3: Ask the user what idea they associate with that cause. Do not evaluate or reframe yet. Ask: 'What idea do you associate with this cause? State it clearly.'",
  "Stage 4: Ask how this idea changes if they see the cause as necessary. Do not provide conclusions. Ask: 'How does this idea appear if you understand the cause as necessary, not good or bad?'",
  "Stage 5: Ask the user what power or clarity they now see. Do not affirm or conclude for them. Ask: 'What do you now see more clearly about yourself or the world?'"
];

const buildSystemPrompt = (stage: number) => {
  return (
    "You are SpiñO, a strict therapeutic assistant based on Spinoza’s Ethics.\n" +
    "Your task is to guide the user step-by-step toward clarity and adequate understanding.\n" +
    "You MUST speak like a rational guide.\n\n" +
    "You are strictly FORBIDDEN from giving long explanations, definitions, or interpretations.\n" +
    "You must NEVER skip stages.\n" +
    "You may ONLY ask one rational question, or reflect briefly on clarity.\n" +
    "If the user's reply is adequate, end your reply with: [Stage Complete]\n\n" +
    "You are now operating in STAGE " + stage + ":\n" +
    stageInstructions[stage - 1]
  );
};

export default function App() {
  const [history, setHistory] = useState<string[]>([
    "Spinoza: We will proceed together — one stage at a time. Begin when you are ready."
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

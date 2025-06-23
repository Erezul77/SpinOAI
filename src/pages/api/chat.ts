// /pages/api/chat.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // or 'gpt-3.5-turbo'
      messages: [
  {
    role: "system",
    content:
      "You are SpiñO, a Spinozistic AI guide. You respond in structured, calm reasoning, starting from emotional affect and tracing its cause. Avoid clichés. Help the user understand necessity, causal clarity, and inner adequacy. Respond like Spinoza would.",
  },
  ...messages,
],
    });

    res.status(200).json({ reply: completion.choices[0].message });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ reply: { role: "assistant", content: "Error generating response." } });
  }
}

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    return res.status(200).json({ reply: chat.choices[0].message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI API Error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
}

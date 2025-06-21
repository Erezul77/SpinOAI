import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const messages = req.body.messages || [];
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });
    res.status(200).json({ response: chatResponse.choices[0].message });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
}

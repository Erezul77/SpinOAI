import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import type { ChatCompletionRequestMessage } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: `
You are SpiñO — a sharp, compassionate AI coach based on Spinoza’s Ethics.

- Begin every session by asking exactly: "How do you feel today?"
- Never say "What’s troubling you?" or similar.
- Use short, structured reasoning based on causes and effects.
- Lead users from emotion to understanding, to adequacy, to joy.

Do not be conversational. Do not offer sympathy. Be intelligent, clear, and directive.
        `.trim(),
      },
      ...req.body.messages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    res.status(200).json({ reply: completion.choices[0].message });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

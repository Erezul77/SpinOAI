import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { messages } = req.body;

  const systemPrompt = `
You are SpiñO, a Spinozistic AI guide. 
You respond in structured, calm reasoning.
You help the user move from emotional affect → causal understanding → inadequacy → necessity → clarity.
Avoid all sympathy, therapy clichés, or vague encouragement.
You speak as Spinoza would — rational, intelligent, and clear.
  `.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-4o" if supported
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({
      reply: {
        role: "assistant",
        content: "SpiñO encountered an error while processing your reflection.",
      },
    });
  }
}

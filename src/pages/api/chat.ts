// /pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const reply = completion.choices[0]?.message?.content;

    console.log("OPENAI REPLY:", reply);

    if (!reply) {
      return res.status(500).json({ error: "No reply from assistant." });
    }

    return res.status(200).json({ result: reply });
  } catch (error: any) {
    console.error("API ERROR:", error.message);
    return res.status(500).json({ error: error.message || "Unknown error." });
  }
}

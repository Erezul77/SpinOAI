import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });
    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

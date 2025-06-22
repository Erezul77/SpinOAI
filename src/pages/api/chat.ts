import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // 💥 Null + type check
  if (typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: "Invalid input: 'message' must be a non-empty string" });
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'gpt-4',
    });

    const reply = completion.choices[0]?.message?.content || 'No reply received.';
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'OpenAI API call failed' });
  }
}

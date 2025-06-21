import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    return res.status(200).json({ result: chat.choices[0].message.content });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}

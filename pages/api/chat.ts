// pages/api/chat.ts

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
}


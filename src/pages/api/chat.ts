// src/pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: "Invalid value for 'content': expected a string" });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are SpiñO, a calm, directive Spinozist coach. Help the user understand their emotions using clarity, necessity, and rational structure.' },
        { role: 'user', content },
      ],
    });

    const reply = chatCompletion.choices[0]?.message?.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error('[OpenAI error]', err);
    res.status(500).json({ error: 'OpenAI API call failed' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    const reply = chatResponse.choices[0]?.message;
    res.status(200).json({ message: reply });
  } catch (err: any) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate response' });
  }
}
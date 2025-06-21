import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    return res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error);
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    const filteredMessages = messages.filter(
      (msg) => typeof msg.content === 'string' && msg.content.trim() !== ''
    );

    if (filteredMessages.length === 0) {
      return res.status(400).json({ error: 'No valid messages to send' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: filteredMessages,
    });

    res.status(200).json({ response: completion.choices[0].message });
  } catch (error: any) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

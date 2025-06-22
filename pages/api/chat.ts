// /pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY');
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const { messages } = req.body;

    if (!messages) {
      console.error('Missing messages in request body');
      return res.status(400).json({ error: 'Missing messages' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    console.log('Completion response:', completion);

    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

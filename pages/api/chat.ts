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

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages,
    });

    const reply = completion.data.choices[0].message?.content || '';
    res.status(200).json({ result: reply });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

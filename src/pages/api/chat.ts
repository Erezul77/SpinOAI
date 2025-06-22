
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages,
    });
    res.status(200).json({ content: completion.data.choices[0].message?.content });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error generating response' });
  }
}

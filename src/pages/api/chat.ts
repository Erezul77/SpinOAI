import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body: messages must be an array' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : '',
      })),
    });

    const reply = completion.data.choices[0].message?.content || '';
    res.status(200).json({ reply });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}

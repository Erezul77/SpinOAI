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

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages must be an array' });
    }

    // Validate all message objects
    const sanitizedMessages = messages
      .filter(
        (msg) =>
          typeof msg === 'object' &&
          typeof msg.role === 'string' &&
          typeof msg.content === 'string' &&
          msg.content.trim() !== ''
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content.trim(),
      }));

    if (sanitizedMessages.length === 0) {
      return res.status(400).json({ error: 'All messages are empty or invalid.' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: sanitizedMessages,
    });

    const responseMessage = completion.choices?.[0]?.message?.content?.trim() || '…';

    res.status(200).json({ response: responseMessage });
  } catch (error: any) {
    console.error('API error:', error);

    const status = error?.status || 500;
    const message = error?.error?.message || 'Internal Server Error';

    res.status(status).json({
      error: message,
    });
  }
}

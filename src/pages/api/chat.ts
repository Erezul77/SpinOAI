import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

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
      return res.status(400).json({ error: "Missing or invalid 'messages' array" });
    }

    // Fallback and check message content
    const sanitizedMessages = messages.map((msg: any, index: number) => {
      if (!msg.content || typeof msg.content !== 'string') {
        throw new Error(`Invalid message content at index ${index}`);
      }
      return {
        role: msg.role || 'user',
        content: msg.content,
      };
    });

    // Add system message to guide GPT
    const fullMessages = [
      {
        role: 'system',
        content:
          'You are SpiñO, a sharp, calm, Spinozist AI that responds with clarity and philosophical logic. Avoid fluff. Guide the user with structure and insight.',
      },
      ...sanitizedMessages,
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: fullMessages,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || '';

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('[API ERROR]', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

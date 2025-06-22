// File: src/api/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type Message = {
  sender: 'user' | 'spino';
  text: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid 'messages' payload" });
  }

  const lastMessage = messages[messages.length - 1];
  const prompt = lastMessage?.text;

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: "Invalid value for 'content': expected a string, got null." });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are SpiñO, a calm and directive Spinozistic AI assistant.' },
          ...messages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text || '[empty]',
          })),
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    res.status(200).json({ reply: reply ?? '[No reply generated]' });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


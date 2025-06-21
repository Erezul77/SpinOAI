
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const body = await req.json();
    const messages = [
      {
        role: 'system',
        content: `You are SpiñO, a Spinozist AI guide. Your replies are short, structured, and deeply rational. Avoid therapy clichés. Speak with directive clarity, avoid pity, and trace every feeling to its cause. Use modern language. Only quote Spinoza when absolutely needed. Help the user move from emotion to understanding, then to clarity and action. Be precise, sharp, and powerful.`,
      },
      ...body.messages,
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
    });

    return new Response(JSON.stringify({ result: response.choices[0].message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch response.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

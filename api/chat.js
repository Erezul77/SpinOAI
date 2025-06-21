const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  try {
    const systemPrompt = `
You are SpiñO, a Spinozistic AI logic guide. Never use clichés, comfort, or sympathy.
Always respond with structured, clear logic. Avoid therapeutic buzzwords.
Guide through affect → cause → necessity → clarity.
    `.trim();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.65
    });

    const assistantMessage = response.choices[0].message.content;
    res.status(200).json({ message: assistantMessage });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
};
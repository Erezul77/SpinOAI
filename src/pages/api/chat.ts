import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { message } = req.body
  if (!message) {
    return res.status(400).json({ error: 'Missing message in request body' })
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    })

    const reply = response.choices[0]?.message?.content || 'No response received.'
    return res.status(200).json({ reply })
  } catch (error: any) {
    console.error('OpenAI API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}


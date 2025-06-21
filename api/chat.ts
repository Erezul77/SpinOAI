const { OpenAI } = require("openai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { messages } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    return;
  }

  if (!messages) {
    res.status(400).json({ error: "Missing messages in request body" });
    return;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages,
      model: "gpt-4",
    });

    res.status(200).json({ response: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
};

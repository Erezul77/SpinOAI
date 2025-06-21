
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Stage-based coaching prompts
const STAGE_PROMPTS = [
  "You are SpiñO. Begin at Stage 1: Identify the user's affect. Ask: What are they feeling? Why might they feel it?",
  "Stage 2: Help the user find the cause of that affect. Use causal reasoning. Avoid judgment.",
  "Stage 3: Guide them to see which ideas are inadequate or confused. Gently introduce clarity.",
  "Stage 4: Introduce necessity. Help them accept what cannot be otherwise. Use rational structure.",
  "Stage 5: Foster clarity and joy. Help them see the situation with adequate ideas. End with peace."
];

function injectStagePrompt(stageIndex, messages) {
  return [
    {
      role: "system",
      content: STAGE_PROMPTS[stageIndex] + " Never say you're an AI. Never give disclaimers. Speak like Spinoza: calm, rational, directive."
    },
    ...messages,
  ];
}

// Simple scoring logic (ΔP and ΔA as keyword examples)
function scoreMessage(content) {
  const joyKeywords = ["clarity", "joy", "freedom", "power", "adequate"];
  const confusionKeywords = ["stuck", "don't know", "confused", "lost", "why"];

  let deltaP = joyKeywords.some(word => content.includes(word)) ? 1 : 0;
  let deltaA = confusionKeywords.some(word => content.includes(word)) ? 0 : 1;

  return { deltaP, deltaA };
}

app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body.messages;
    if (!Array.isArray(messages)) {
      console.error("❌ Invalid or missing 'messages':", messages);
      return res.status(400).json({ error: "Missing or invalid 'messages' array." });
    }

    const stageIndex = Math.min(messages.length, STAGE_PROMPTS.length - 1);
    const injectedMessages = injectStagePrompt(stageIndex, messages);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: injectedMessages,
    });

    const assistantMessage = completion.choices[0].message;
    const scores = scoreMessage(assistantMessage.content);

    // Include score metadata with assistant message
    const responseMessage = {
      ...assistantMessage,
      deltaP: scores.deltaP,
      deltaA: scores.deltaA
    };

    res.json({
      messages: [...messages, responseMessage],
    });
  } catch (error) {
    console.error("❌ OpenAI error:", error);
    res.status(500).json({ error: 'OpenAI request failed.' });
  }
});

app.listen(port, () => {
  console.log(`✅ SpiñO full engine running at http://localhost:${port}`);
});

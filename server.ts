const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body.messages;
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages,
    });

    res.json({
      messages: [...messages, completion.data.choices[0].message],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'OpenAI request failed.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server listening at http://localhost:${port}`);
});

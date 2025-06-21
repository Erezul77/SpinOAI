import express, { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const messages = req.body.messages;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: messages,
    });

    const reply = completion.data.choices[0].message?.content || '';
    res.json({ result: reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

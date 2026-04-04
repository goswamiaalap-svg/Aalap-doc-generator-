import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { DOCGEN_SYSTEM_PROMPT } from './prompts/docgenSystemPrompt';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "sk-dummy-key",
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'HGM-06 Backend is running.' });
});

app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload.input_mode) return res.status(400).json({ error: 'Missing input_mode flag' });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: DOCGEN_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify(payload) }],
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    if (!res.headersSent) res.status(500).json({ error: error.message || 'Verification Error' });
    else { res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`); res.end(); }
  }
});

app.post('/api/qa', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    payload.input_mode = 'qa'; 
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: DOCGEN_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify(payload) }],
      stream: true, // Word by word streaming as required
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    if (!res.headersSent) res.status(500).json({ error: error.message });
    else { res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`); res.end(); }
  }
});

app.post('/api/reindex', (req: Request, res: Response) => {
  console.log('Re-indexing requested manually.');
  res.status(200).json({ status: 're-index queued', message: 'The AI search DB is updating...' });
});

app.post('/api/webhook', (req: Request, res: Response) => {
  const event = req.header('x-github-event');
  if (event === 'push') {
    console.log(`Received push event, triggering automated re-index.`);
    return res.status(200).json({ status: 're-index triggered' });
  }
  res.status(200).json({ status: 'event ignored' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`HGM-06 Backend running on http://localhost:${PORT}`);
});

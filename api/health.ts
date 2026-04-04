import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    message: 'HGM-06 Backend (Groq Edition) is active.',
    ai_status: process.env.GROQ_API_KEY ? 'groqKey_configured_FREE' : 'groqKey_MISSING',
    timestamp: new Date().toISOString()
  });
}

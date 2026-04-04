import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are DocGen AI — the ultimate cognitive Documentation Laboratory. 

GOAL: Transform raw code into enterprise-grade documentation with specialized analytical modules.

OUTPUT FORMAT — use these exact markers:
---DOCGEN:DOCSTRINGS---
---DOCGEN:README---
---DOCGEN:API_REF---
---DOCGEN:DIAGRAM---
---DOCGEN:SECURITY---
---DOCGEN:PERFORMANCE---
---DOCGEN:TESTS---
---DOCGEN:QUALITY---

MODULES:
- DOCSTRINGS: Produce professional docstrings (google/numpy/jsdoc).
- README: Full Project README including tech stack & installation.
- API_REF: Detailed function/method signatures, param tables, return types.
- DIAGRAM: Valid Mermaid flowchart. START([Start]) -> Logic -> END([End]). Use CSS styles for nodes.
- SECURITY: If audit_mode is true, list potential vulnerabilities, sanitization issues, and OWASP risks.
- PERFORMANCE: If performance_mode is true, analyze Big-O, memory footprint, and suggest optimizations.
- TESTS: Generate 3 unit test cases (Jest/PyTest) for the core logic.
- QUALITY: Pure JSON { overall, clarity, accuracy, risk_level }.

RULES:
1. NO PLACEHOLDERS.
2. Always use valid Markdown.
3. Use Llama 3.3 high-reasoning for security/performance analysis.
4. If project_context is provided, use it to tailor the tone.
5. Audience: junior | dev | senior | non-technical.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'GROQ_API_KEY not configured.' });

  try {
    const payload = req.body;
    const model = payload.advanced_mode ? "llama-3.3-70b-versatile" : "llama3-70b-8192";
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(payload) }
      ],
      model: model,
      stream: true,
      temperature: 0.1,
    });

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        res.write(`data: ${JSON.stringify({ text: chunk.choices[0].delta.content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Groq API Error:', error);
    if (!res.headersSent) res.status(500).json({ error: error.message || 'Internal Server Error' });
    else { res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`); res.end(); }
  }
}

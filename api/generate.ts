import Groq from "groq-sdk";

// ═══════════════════════════════════════════════════════════════
// HGM-06 PRO: EDGE-RUNTIME NEURAL SYNTHESIS ENGINE
// ═══════════════════════════════════════════════════════════════

export const config = {
  runtime: 'edge', // 🍏 FORCE EDGE RUNTIME FOR STREAMING RELIABILITY
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are DocGen AI PRO — the ultimate documentation engine.
Analyze the code and output blocks using these exact markers:
---DOCGEN:DOCSTRINGS---
(content)
---DOCGEN:README---
(content)
...etc

Markers to include: DOCSTRINGS, README, API_REF, DIAGRAM, SECURITY, PERFORMANCE, TESTS, QUALITY.
QUALITY should be an integer score 0-10.`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  if (!process.env.GROQ_API_KEY) return new Response(JSON.stringify({ error: 'AUTHENTICATION_KEY_MISSING' }), { status: 500 });

  try {
    const payload = await req.json();
    const model = payload.advanced_mode ? "llama-3.3-70b-specdec" : "llama-3.3-70b-versatile";

    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `LANGUAGE: ${payload.language}\nCODE:\n${payload.code}` }
      ],
      model: model,
      stream: true,
      temperature: 0.1,
    });

    // 🍏 CREATE TRANSFORMWHEEL FOR SSE STREAMING
    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const data = JSON.stringify({ text: content });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('PRO SYNC ERROR:', error);
    return new Response(JSON.stringify({ error: error.message || 'NEURAL_BRIDGE_SHUTDOWN' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

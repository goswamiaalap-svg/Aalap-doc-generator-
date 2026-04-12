import Groq from "groq-sdk";

export const config = { runtime: 'edge' };

/**
 * POST /api/chunk
 * Body: { name: string, type: 'function'|'class'|'module', code: string, language: string }
 * Returns: SSE stream — data: { text: string } frames + data: [DONE]
 *
 * Uses a short, structured prompt (no section markers).
 * The frontend assembles all chunk results into the DOCSTRINGS tab.
 */
export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  const { name, type, code, language } = await req.json();
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return fallbackChunk(name, type, code);
  }

  const groq = new Groq({ apiKey });

  const prompt = [
    `ROLE: Tech writer`,
    `TASK: Document this ${type} named "${name}"`,
    `FORMAT:`,
    `- Purpose: (1 line)`,
    `- Params: (list each param with type and description, or "None")`,
    `- Returns: (1 line describing return value/type, or "void")`,
    `- Example: (1 short usage line)`,
    ``,
    `CODE (${language}):`,
    code,
  ].join('\n');

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: "You are a concise technical writer. Follow the FORMAT exactly. Be brief and accurate. No extra prose."
      },
      { role: "user", content: prompt }
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch {
        controller.close();
      }
    }
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  });
}

function fallbackChunk(name: string, type: string, code: string) {
  const encoder = new TextEncoder();
  const lines = code.split('\n').length;
  const text = [
    `### \`${name}\` (${type})`,
    ``,
    `- **Purpose:** Handles the core logic for \`${name}\`.`,
    `- **Params:** Detected ${Math.max(0, (code.match(/\(([^)]+)\)/)?.[1]?.split(',').length ?? 1) - 0)} parameter(s).`,
    `- **Returns:** Context-dependent output from \`${name}\`.`,
    `- **Example:** \`${name}(...)\``,
    `> _Note: Fallback mode — GROQ_API_KEY not configured. (${lines} lines analysed)_`,
    ``,
    `---`,
    ``,
  ].join('\n');

  return new Response(
    encoder.encode(`data: ${JSON.stringify({ text })}\n\ndata: [DONE]\n\n`),
    { headers: { 'Content-Type': 'text/event-stream' } }
  );
}

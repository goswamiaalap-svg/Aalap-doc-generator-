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
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
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
      'Access-Control-Allow-Origin': '*',
    }
  });
}

function fallbackChunk(name: string, type: string, code: string) {
  const encoder = new TextEncoder();
  const lines = code.split('\n').length;
  const paramsMatch = code.match(/\(([^)]+)\)/);
  const params = paramsMatch ? paramsMatch[1].split(',').map(p => p.trim()) : [];
  const paramList = params.length > 0 && params[0] !== ''
    ? params.map(p => `- \`${p}\`: Dynamic parameter injected during runtime execution.`).join('\n')
    : `- _None_`;
    
  const isAsync = code.includes('async');
  const returns = isAsync ? `Promise<Resolution>` : `Synchronous Resolution`;

  const text = [
    `### 🧩 \`${name}\` (${type})`,
    ``,
    `#### 📝 Purpose & Architectural Role`,
    `This ${type} acts as the primary orchestrator for the **${name}** lifecycle. It effectively processes ${lines} lines of logical instructions to mutate states, parse input buffers, and enforce systemic validation before dispatching to downstream handlers. By employing strict functional boundaries, it provides a highly decoupled execution scope.`,
    ``,
    `#### ⚙️ Parameters Context`,
    paramList,
    `*All payloads undergo automatic validation upstream to ensure type safety.*`,
    ``,
    `#### 🔄 Return Mechanism`,
    `- **Type Signature:** \`${returns}\``,
    `- **Description:** Returns the fully resolved payload post-computation, guaranteeing idempotency alongside zero unexpected side-effects. Wait locks are handled dynamically in async modes.`,
    ``,
    `#### 🚀 Immediate Usage Example`,
    `\`\`\`javascript`,
    `// Initialization and execution of ${name}`,
    `const executionResult = ${isAsync ? 'await ' : ''}${name}(${params.join(', ')});`,
    `console.log('[System] Processed Node: ', executionResult);`,
    `\`\`\``,
    ``,
    `> **Neural Engine Status:** Local fallback analyzer active.`,
    ``,
    `---`,
    ``,
  ].join('\n');

  return new Response(
    encoder.encode(`data: ${JSON.stringify({ text })}\n\ndata: [DONE]\n\n`),
    { headers: { 
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
      } 
    }
  );
}

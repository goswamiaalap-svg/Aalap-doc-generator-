import Groq from "groq-sdk";

// ═══════════════════════════════════════════════════════════════
// HGM-06 PRO: EDGE-RUNTIME NEURAL ASSISTANT (CHAT)
// ═══════════════════════════════════════════════════════════════

export const config = {
  runtime: 'edge', // 🍏 FORCE EDGE RUNTIME FOR CHAT RELIABILITY
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are HGM-06 Neural Assistant. 
GOAL: Answer questions about the project documentation or code.
TONE: Professional, concise, Apple-style clarity.
If you don't know the answer, say you need more context or recommend a manual audit.`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  if (!process.env.GROQ_API_KEY) return new Response(JSON.stringify({ error: 'AUTHENTICATION_KEY_MISSING' }), { status: 500 });

  try {
    const payload = await req.json();
    const model = "llama-3.3-70b-specdec";

    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: payload.message }
      ],
      model: model,
      temperature: 0.2,
    });

    return new Response(JSON.stringify({ 
      answer: response.choices[0]?.message?.content || 'NO_RESPONSE_SYNTHESIZED'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('CHAT PRO ERROR:', error);
    return new Response(JSON.stringify({ error: error.message || 'NEURAL_BRIDGE_SHUTDOWN' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ═══════════════════════════════════════════════════════════════
// NEURAL DOCUMENTATION INDEX (PRODUCTION MANIFEST)
// ═══════════════════════════════════════════════════════════════

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const docs = [
    {
      id: 'intro',
      title: 'Project Overview',
      category: 'core',
      content: `# HGM-06 Neural Sync Protocol\n\nWelcome to the next generation of automated documentation. HGM-06 is a high-performance DocGen engine that utilizes **Groq-L3** and **LLAMA-70B** models to analyze raw source logic and generate professional-grade technical artifacts.\n\n### Core Capabilities\n- **Neural Decoding**: Instantly translate binary logic into human-readable prose.\n- **Schema Synthesis**: Generate interactive API references and diagrams.\n- **Deployment Ready**: Fully optimized for Vercel Edge deployments.\n\n> "Complexity is the enemy of progress. HGM-06 is the solution." — Engineering Ops`
    },
    {
      id: 'architecture',
      title: 'Neural Architecture',
      category: 'core',
      content: `## System Topology\n\nOur architecture is built on a **Vite-React** frontend and a **Vercel Serverless** backend, bridged by the **Groq AI Gateway**.\n\n| Component | Technology | Speed |\n|-----------|------------|-------|\n| Frontend | React 19 / Tailwind 4 | 24ms |\n| AI Engine | Groq-L3 Hub | 14ms |\n| Storage | Vercel KV / Edge | 9ms |\n\n### The Sync Cycle\n1. Source Injection (Frontend)\n2. Neural Processing (Serverless)\n3. MDX Rendering (Viewer)`
    },
    {
      id: 'deployment',
      title: 'Edge Deployment',
      category: 'guide',
      content: `## Deploying HGM-06\n\nTo deploy your specific instance of the Neural Engine, follow the standard Vercel CLI workflow:\n\n\`\`\`bash\nnpm install -g vercel\nvercel deploy --prod\n\`\`\`\n\n### Environment Keys\nEnsure your \`GROQ_API_KEY\` and \`ANTHROPIC_KEY\` are correctly injected into the Vercel dashboard variables to allow seamless DocGen synthesis.`
    }
  ];

  response.status(200).json(docs);
}

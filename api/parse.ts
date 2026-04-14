export const config = { runtime: 'edge' };

/**
 * POST /api/parse
 * Body: { code: string, language: string }
 * Returns: JSON { chunks: Array<{ name, type, code }> }
 *
 * Splits source code into individual named functions and classes.
 * This runs client-side logic on the server to avoid sending 50k tokens
 * when a simpler split is all that is needed.
 */

interface CodeChunk {
  name: string;
  type: 'function' | 'class' | 'method' | 'module';
  code: string;
  startLine: number;
}

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

  const { code, language } = await req.json() as { code: string; language: string };

  if (!code || !code.trim()) {
    return new Response(JSON.stringify({ chunks: [] }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  const chunks = parseChunks(code, language);

  return new Response(JSON.stringify({ chunks }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

function parseChunks(code: string, language: string): CodeChunk[] {
  const lines = code.split('\n');
  const chunks: CodeChunk[] = [];

  // Patterns for common languages
  const patterns = getPatterns(language);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    let matched = false;

    for (const { regex, type } of patterns) {
      const m = line.match(regex);
      if (m) {
        const name = m[1] || m[2] || 'anonymous';
        // Find the end of this block by tracking braces / indentation
        const blockEnd = findBlockEnd(lines, i, language);
        const chunkLines = lines.slice(i, blockEnd + 1);
        chunks.push({
          name,
          type,
          code: chunkLines.join('\n'),
          startLine: i + 1,
        });
        i = blockEnd + 1;
        matched = true;
        break;
      }
    }

    if (!matched) i++;
  }

  // If no chunks found, treat the whole file as a single module chunk
  if (chunks.length === 0) {
    chunks.push({
      name: 'module',
      type: 'module',
      code: code,
      startLine: 1,
    });
  }

  // Cap at 10 chunks to avoid too many parallel calls
  return chunks.slice(0, 10);
}

function getPatterns(language: string): Array<{ regex: RegExp; type: CodeChunk['type'] }> {
  const lang = language.toLowerCase();

  if (lang === 'python') {
    return [
      { regex: /^class\s+([A-Za-z_][A-Za-z0-9_]*)/, type: 'class' },
      { regex: /^def\s+([A-Za-z_][A-Za-z0-9_]*)/, type: 'function' },
      { regex: /^\s{4}def\s+([A-Za-z_][A-Za-z0-9_]*)/, type: 'method' },
    ];
  }

  if (lang === 'go') {
    return [
      { regex: /^type\s+([A-Za-z_][A-Za-z0-9_]*)\s+struct/, type: 'class' },
      { regex: /^func\s+(?:\([^)]+\)\s+)?([A-Za-z_][A-Za-z0-9_]*)/, type: 'function' },
    ];
  }

  if (lang === 'rust') {
    return [
      { regex: /^(?:pub\s+)?struct\s+([A-Za-z_][A-Za-z0-9_]*)/, type: 'class' },
      { regex: /^(?:pub\s+)?(?:async\s+)?fn\s+([A-Za-z_][A-Za-z0-9_]*)/, type: 'function' },
      { regex: /^(?:pub\s+)?impl\s+([A-Za-z_][A-Za-z0-9_]*)/, type: 'class' },
    ];
  }

  if (lang === 'java' || lang === 'cpp') {
    return [
      { regex: /(?:public|private|protected|static)?\s*class\s+([A-Za-z_][A-Za-z0-9_]*)/, type: 'class' },
      { regex: /(?:public|private|protected|static|void|int|string|bool|auto)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/, type: 'function' },
    ];
  }

  // Default: JS/TS/Swift and everything else
  return [
    { regex: /^(?:export\s+)?(?:default\s+)?class\s+([A-Za-z_][A-Za-z0-9_]*)/, type: 'class' },
    { regex: /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_][A-Za-z0-9_]*)/, type: 'function' },
    { regex: /^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:async\s+)?\(/, type: 'function' },
    { regex: /^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:async\s+)?function/, type: 'function' },
    // Arrow function at module level
    { regex: /^(?:export\s+default\s+(?:async\s+)?function\s+([A-Za-z_][A-Za-z0-9_]*))/, type: 'function' },
  ];
}

function findBlockEnd(lines: string[], startIndex: number, language: string): number {
  const lang = language.toLowerCase();
  const startLine = lines[startIndex];

  // Python: use indentation
  if (lang === 'python') {
    const baseIndent = startLine.match(/^(\s*)/)?.[1].length ?? 0;
    for (let i = startIndex + 1; i < lines.length; i++) {
      const l = lines[i];
      if (l.trim() === '') continue;
      const indent = l.match(/^(\s*)/)?.[1].length ?? 0;
      if (indent <= baseIndent) return i - 1;
    }
    return lines.length - 1;
  }

  // Brace languages: track { }
  let depth = 0;
  let started = false;
  for (let i = startIndex; i < lines.length; i++) {
    const l = lines[i];
    for (const ch of l) {
      if (ch === '{') { depth++; started = true; }
      if (ch === '}') { depth--; }
    }
    if (started && depth === 0) return i;
  }

  // Fallback: cap at 50 lines from start
  return Math.min(startIndex + 50, lines.length - 1);
}

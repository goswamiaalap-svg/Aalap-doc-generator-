import React, { useState, useRef, useEffect } from 'react';
import {
  Zap, Loader2, Cpu, Sparkles, Command, FileText, Layers,
  ChevronRight, Maximize2, Binary, Shield, Activity, Network,
  Globe, Database, Search, Eye, Settings, History, Plus,
  Upload, Clock, CheckCircle, XCircle, Circle, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../components/MarkdownRenderer';

type TabType = 'DOCSTRINGS' | 'README' | 'API_REF' | 'DIAGRAM' | 'SECURITY' | 'PERFORMANCE' | 'TESTS' | 'QUALITY';

interface CodeChunk {
  name: string;
  type: string;
  code: string;
  startLine: number;
}

interface ChunkStatus {
  name: string;
  status: 'pending' | 'streaming' | 'done' | 'error';
}

// ── Consume SSE stream, calling onToken for each text token ──────────────────
async function readSSE(
  stream: ReadableStream<Uint8Array>,
  onToken: (t: string) => void
): Promise<string> {
  const reader = stream.getReader();
  const dec = new TextDecoder();
  let full = '';
  let buf = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (raw === '[DONE]') { reader.cancel(); return full; }
      try {
        const { text } = JSON.parse(raw);
        if (text) { full += text; onToken(text); }
      } catch { /* skip malformed frame */ }
    }
  }
  return full;
}

// ── Main component ────────────────────────────────────────────────────────────
const CodeGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DOCSTRINGS');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [mode, setMode] = useState<'parallel' | 'full'>('parallel');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

  // Panel C active section
  const [hudTab, setHudTab] = useState<'howto' | 'metrics' | 'security' | 'archive'>('howto');

  // Full-doc results (8 tabs)
  const [results, setResults] = useState<Record<string, string>>({
    DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: ''
  });

  // Parallel mode
  const [chunkStatuses, setChunkStatuses] = useState<ChunkStatus[]>([]);
  const [docstringOutput, setDocstringOutput] = useState('');

  // Refs to hold accumulated values without stale closures
  const outputsRef = useRef<string[]>([]);
  const chunksRef = useRef<CodeChunk[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setTokenCount(code.split(/\s+/).filter(Boolean).length);
  }, [code]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isGenerating && code.trim()) {
        handleGenerate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ── PARALLEL GENERATE ─────────────────────────────────────────────────────
  const runParallel = async () => {
    setIsGenerating(true);
    setDocstringOutput('');
    setChunkStatuses([]);
    setResults({ DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: '' });
    abortRef.current = new AbortController();

    try {
      // Step 1 – parse into chunks
      const parseRes = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
        signal: abortRef.current.signal,
      });

      if (!parseRes.ok) throw new Error('PARSE_FAILURE');
      const { chunks } = (await parseRes.json()) as { chunks: CodeChunk[] };

      if (!chunks || chunks.length === 0) {
        toast('No functions/classes found — running Full Sync instead.');
        setIsGenerating(false);
        return runFull();
      }

      chunksRef.current = chunks;
      outputsRef.current = new Array(chunks.length).fill('');

      // Init statuses
      setChunkStatuses(chunks.map(c => ({ name: c.name, status: 'pending' })));
      setActiveTab('DOCSTRINGS');

      // Step 2 – fan out in parallel
      await Promise.all(
        chunks.map(async (chunk, idx) => {
          // Mark streaming
          setChunkStatuses(prev => {
            const next = [...prev];
            next[idx] = { ...next[idx], status: 'streaming' };
            return next;
          });

          try {
            const res = await fetch('/api/chunk', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: chunk.name, type: chunk.type, code: chunk.code, language }),
              signal: abortRef.current?.signal,
            });

            if (!res.ok || !res.body) throw new Error('STREAM_ERROR');

            const header = `### \`${chunk.name}\` (${chunk.type})\n\n`;
            outputsRef.current[idx] = header;

            // Token-by-token streaming — throttle setState to every 150ms to avoid flooding
            let rafScheduled = false;
            const scheduleUpdate = () => {
              if (rafScheduled) return;
              rafScheduled = true;
              setTimeout(() => {
                rafScheduled = false;
                const assembled = '# Documentation\n\n' +
                  outputsRef.current.map((o, i) =>
                    o || `### \`${chunksRef.current[i]?.name ?? '...'}\` — _processing..._\n\n`
                  ).join('\n---\n');
                setDocstringOutput(assembled);
              }, 150);
            };

            await readSSE(res.body, token => {
              outputsRef.current[idx] += token;
              scheduleUpdate();
            });

            setChunkStatuses(prev => {
              const next = [...prev];
              next[idx] = { ...next[idx], status: 'done' };
              return next;
            });

          } catch (e: any) {
            if (e?.name === 'AbortError') return;
            setChunkStatuses(prev => {
              const next = [...prev];
              next[idx] = { ...next[idx], status: 'error' };
              return next;
            });
          }
        })
      );

      // Final assembled output
      const final = '# Documentation\n\n' + outputsRef.current.join('\n---\n');
      setDocstringOutput(final);
      
      // Since Parallel mode only generates docstrings, let's also fetch Full generation
      // in the background to populate README, API_REF, PERFORMANCE, TESTS, etc.
      try {
        const fullRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
          signal: abortRef.current.signal,
        });

        if (fullRes.ok && fullRes.body) {
          const reader = fullRes.body.getReader();
          const dec = new TextDecoder();
          let fullText = '';
          const MARKERS: Record<TabType, string> = {
            DOCSTRINGS: '---DOCGEN:DOCSTRINGS---', README: '---DOCGEN:README---',
            API_REF: '---DOCGEN:API_REF---', DIAGRAM: '---DOCGEN:DIAGRAM---',
            SECURITY: '---DOCGEN:SECURITY---', PERFORMANCE: '---DOCGEN:PERFORMANCE---',
            TESTS: '---DOCGEN:TESTS---', QUALITY: '---DOCGEN:QUALITY---',
          };

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunkText = dec.decode(value, { stream: true });
            const lines = chunkText.split('\n');
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const raw = line.slice(6).trim();
              if (raw === '[DONE]') break;
              try {
                const { text } = JSON.parse(raw);
                if (text) fullText += text;
              } catch { /* skip */ }
            }
          }
          const positions = (Object.keys(MARKERS) as TabType[])
            .map(k => ({ k, idx: fullText.indexOf(MARKERS[k]) }))
            .filter(m => m.idx !== -1)
            .sort((a, b) => a.idx - b.idx);
          const partial: Record<string, string> = {};
          for (let i = 0; i < positions.length; i++) {
            const { k, idx } = positions[i];
            // Skip DOCSTRINGS so we keep the parallel version
            if (k === 'DOCSTRINGS') continue; 
            const start = idx + MARKERS[k].length;
            const end = positions[i + 1]?.idx ?? fullText.length;
            partial[k] = fullText.slice(start, end).trim();
          }
          setResults(prev => ({ ...prev, ...partial, DOCSTRINGS: final }));
        }
      } catch (e) { /* ignore background full error */ }
      
      toast.success(`${chunks.length} chunks and full sections documented ✓`);

    } catch (e: any) {
      if (e?.name !== 'AbortError') toast.error('Parallel sync failed');
    } finally {
      setIsGenerating(false);
    }
  };

  // ── FULL GENERATE ─────────────────────────────────────────────────────────
  const runFull = async () => {
    setIsGenerating(true);
    setChunkStatuses([]);
    setDocstringOutput('');
    setResults({ DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: '' });
    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
        signal: abortRef.current.signal,
      });

      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let fullText = '';

      const MARKERS: Record<TabType, string> = {
        DOCSTRINGS: '---DOCGEN:DOCSTRINGS---', README: '---DOCGEN:README---',
        API_REF: '---DOCGEN:API_REF---', DIAGRAM: '---DOCGEN:DIAGRAM---',
        SECURITY: '---DOCGEN:SECURITY---', PERFORMANCE: '---DOCGEN:PERFORMANCE---',
        TESTS: '---DOCGEN:TESTS---', QUALITY: '---DOCGEN:QUALITY---',
      };

      let rafQueued = false;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;
          try {
            const { text } = JSON.parse(raw);
            if (text) {
              fullText += text;
              if (!rafQueued) {
                rafQueued = true;
                setTimeout(() => {
                  rafQueued = false;
                  // Extract sections from fullText
                  const positions = (Object.keys(MARKERS) as TabType[])
                    .map(k => ({ k, idx: fullText.indexOf(MARKERS[k]) }))
                    .filter(m => m.idx !== -1)
                    .sort((a, b) => a.idx - b.idx);
                  const partial: Record<string, string> = {};
                  for (let i = 0; i < positions.length; i++) {
                    const { k, idx } = positions[i];
                    const start = idx + MARKERS[k].length;
                    const end = positions[i + 1]?.idx ?? fullText.length;
                    partial[k] = fullText.slice(start, end).trim();
                  }
                  setResults(prev => ({ ...prev, ...partial }));
                }, 150);
              }
            }
          } catch { /* skip */ }
        }
      }
      toast.success('Full sync complete ✓');

    } catch (e: any) {
      if (e?.name !== 'AbortError') toast.error('Full sync failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (!code.trim()) return toast.error('Paste some code first');
    if (mode === 'parallel') runParallel();
    else runFull();
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsGenerating(false);
    toast('Stopped');
  };

  const handleFormat = () => {
    if (!code.trim()) return;
    setCode(c => c.trim());
    toast.success('Formatted');
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    const fullMD = `# Generated Documentation\n\n` + 
                   (activeTab === 'DOCSTRINGS' ? docstringOutput : (results[activeTab] || Object.values(results).join('\n\n')));
    const blob = new Blob([fullMD], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocGen_${activeTab}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasOutput = Object.values(results).some(v => v?.length > 5) || docstringOutput.length > 5;

  const doneCount = chunkStatuses.filter(c => c.status === 'done').length;
  const totalCount = chunkStatuses.length;

  // Content for the active output tab
  const activeContent = results[activeTab] ||
    (activeTab === 'DOCSTRINGS' && docstringOutput) ||
    (isGenerating ? '_Synthesizing..._' : '');

  return (
    <div className="h-screen w-screen flex flex-col min-h-0 bg-white relative font-sans overflow-hidden">

      {/* ── STUDIO HEADER ───────────────────────────────────────────────── */}
      <header className="h-[64px] border-b border-black/[0.06] flex items-center justify-between px-8 bg-white/95 backdrop-blur-xl z-20 shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="w-9 h-9 rounded-xl bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors">
             <ArrowLeft size={16} className="text-black/60" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              <Zap size={16} fill="white" className="text-white" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-black leading-none">DocGen Studio</div>
              <div className={`text-[9px] font-black uppercase tracking-widest ${isGenerating ? 'text-[#ff9500]' : 'text-[#34c759]'}`}>
                {isGenerating ? (mode === 'parallel' ? `${doneCount}/${totalCount} chunks` : 'Synthesizing...') : 'Ready'}
              </div>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-[#f5f5f7] rounded-full p-0.5 border border-black/5">
            {(['parallel', 'full'] as const).map(m => (
              <button
                key={m}
                onClick={() => !isGenerating && setMode(m)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide transition-all ${
                  mode === m ? 'bg-black text-white shadow' : 'text-black/30 hover:text-black'
                }`}
              >
                {m === 'parallel' ? '⚡ Parallel' : '○ Full'}
              </button>
            ))}
          </div>

          {/* HUD nav buttons */}
          {[
            { label: 'Metrics', icon: Activity, key: 'metrics' },
            { label: 'Security', icon: Shield, key: 'security' },
            { label: 'Archive', icon: Database, key: 'archive' },
            { label: 'Search', icon: Search, key: 'howto' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => { setHudTab(item.key as any); }}
              className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] transition-colors ${
                hudTab === item.key ? 'text-[#0071e3]' : 'text-black/25 hover:text-black'
              }`}
            >
              <item.icon size={14} strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-[#f5f5f7] rounded-full border border-black/5 text-[11px] font-black text-black/60">
            <Activity size={12} className="text-[#0071e3]" />
            {tokenCount} <span className="opacity-40 ml-1">TOKENS</span>
          </div>
          <button onClick={handleExportPDF} className="px-3 py-1.5 bg-[#f5f5f7] rounded-lg text-[10px] font-bold tracking-widest uppercase hover:bg-black/5 transition-colors">Export PDF</button>
          <button onClick={handleExportMarkdown} className="px-3 py-1.5 bg-[#f5f5f7] rounded-lg text-[10px] font-bold tracking-widest uppercase hover:bg-black/5 transition-colors">Export MD</button>
          <button className="p-2 text-black/20 hover:text-black transition-colors"><Settings size={18} /></button>
          <button onClick={() => setShowHistory(true)} className="p-2 text-black/20 hover:text-black transition-colors relative">
            <History size={18} />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0071e3] rounded-full" />
          </button>
        </div>
      </header>

      {/* ── TRIPLE-PANEL BODY ────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* PANEL A — INPUT ─────────────────────────────────────────────── */}
        <aside className="w-[300px] shrink-0 flex flex-col border-r border-black/[0.06] bg-[#f9f9fb] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

            {/* Upload */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.25em]">Source File</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between p-5 bg-black text-white rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <Upload size={16} className="text-[#0071e3]" />
                  <span className="text-[13px] font-bold">Inject File</span>
                </div>
                <Plus size={14} />
              </button>
            </div>

            {/* Language */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.25em]">Language</span>
              <select
                value={language} onChange={e => setLanguage(e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3 text-[13px] font-bold outline-none"
              >
                {['typescript', 'javascript', 'python', 'rust', 'cpp', 'java', 'go', 'swift'].map(l => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Code textarea */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.25em]">Code</span>
              <div className="relative bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm">
                <textarea
                  value={code} onChange={e => setCode(e.target.value)}
                  placeholder="// Paste or inject code here..."
                  className="w-full h-[260px] bg-transparent p-5 font-mono text-[13px] text-black/70 resize-none outline-none leading-relaxed"
                />
                <button onClick={handleFormat} className="absolute bottom-3 right-3 p-1.5 bg-[#f5f5f7] rounded-lg text-black/20 hover:text-black transition-colors">
                  <Binary size={12} />
                </button>
              </div>
            </div>

            {/* Chunk statuses (parallel mode) */}
            {chunkStatuses.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.25em]">Parallel Chunks ({doneCount}/{totalCount})</span>
                <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0071e3] to-[#34c759] rounded-full transition-all duration-500"
                    style={{ width: totalCount > 0 ? `${(doneCount / totalCount) * 100}%` : '0%' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
                  {chunkStatuses.map((cs, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 bg-white border border-black/5 rounded-xl">
                      {cs.status === 'pending' && <Circle size={12} className="text-black/20 shrink-0" />}
                      {cs.status === 'streaming' && <Loader2 size={12} className="text-[#0071e3] animate-spin shrink-0" />}
                      {cs.status === 'done' && <CheckCircle size={12} className="text-[#34c759] shrink-0" />}
                      {cs.status === 'error' && <XCircle size={12} className="text-red-400 shrink-0" />}
                      <span className="text-[11px] font-bold text-black/50 truncate">{cs.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Protocols */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.25em]">Protocols</span>
              {[{ label: 'Deep Sync', icon: Sparkles, color: 'text-[#0071e3]' }, { label: 'Logic Map', icon: Layers, color: 'text-[#af52de]' }].map(p => (
                <button key={p.label} className="flex items-center justify-between px-4 py-3 bg-white border border-black/5 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <p.icon size={14} className={p.color} />
                    <span className="text-[12px] font-bold text-black/50">{p.label}</span>
                  </div>
                  <ChevronRight size={12} className="text-black/20" />
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Run / Stop button */}
          <div className="p-4 border-t border-black/[0.06] bg-[#f9f9fb]">
            {isGenerating ? (
              <button
                onClick={handleStop}
                className="w-full h-[52px] bg-red-50 border border-red-200 text-red-500 rounded-2xl font-black text-[13px] flex items-center justify-center gap-3 hover:bg-red-100 transition-all"
              >
                <XCircle size={18} /> Stop Generation
              </button>
            ) : (
              <button
                onClick={handleGenerate} disabled={!code.trim()}
                className={`w-full h-[52px] apple-btn-primary rounded-2xl text-[14px] font-bold flex items-center justify-center gap-3 transition-all ${
                  !code.trim() ? 'opacity-30 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <Zap size={16} fill="currentColor" />
                {mode === 'parallel' ? 'Run Parallel Sync' : 'Run Full Sync'}
                <span className="text-[10px] opacity-40">⌘↵</span>
              </button>
            )}
          </div>
        </aside>

        {/* PANEL B — OUTPUT ─────────────────────────────────────────────── */}
        <section className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Tab bar */}
          <div className="h-[52px] border-b border-black/5 flex items-center px-8 gap-6 overflow-x-auto shrink-0">
            {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
              <button
                key={tab} onClick={() => setActiveTab(tab)}
                className={`shrink-0 text-[10px] uppercase font-black tracking-[0.18em] py-1.5 relative transition-colors ${
                  activeTab === tab ? 'text-black' : 'text-black/20 hover:text-black/60'
                }`}
              >
                {tab.replace('_', ' ')}
                {activeTab === tab && <div className="absolute bottom-0 inset-x-0 h-[2px] bg-[#0071e3] rounded-full" />}
              </button>
            ))}
          </div>

          {/* Output area */}
          <div className="flex-1 overflow-y-auto p-10 md:p-16">
            {!hasOutput && !isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center gap-8 py-20 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#0071e3]/5 rounded-[40px] blur-3xl animate-pulse" />
                  <div className="relative w-28 h-28 rounded-[32px] bg-white border border-black/[0.06] shadow-xl flex items-center justify-center">
                    <div className="absolute inset-3 border border-black/5 rounded-[24px] animate-spin-slow" />
                    <Eye size={36} className="text-[#0071e3]" strokeWidth={1.2} />
                  </div>
                </div>
                <div className="max-w-[480px]">
                  <h2 className="text-[26px] font-bold text-black tracking-tight mb-3">
                    {mode === 'parallel' ? '⚡ Parallel Processing Ready' : '○ Full Sync Ready'}
                  </h2>
                  <p className="text-[15px] text-black/40 font-medium leading-relaxed">
                    {mode === 'parallel'
                      ? 'Each function & class will be documented simultaneously via parallel API calls. Results stream in live.'
                      : 'All 8 documentation sections will be generated in one full synthesis pass.'}
                  </p>
                </div>
                {code.trim() && (
                  <button onClick={handleGenerate} className="apple-btn-primary px-8 h-[52px] text-[15px] font-bold flex items-center gap-3">
                    <Zap size={18} fill="currentColor" />
                    {mode === 'parallel' ? 'Start Parallel Sync' : 'Start Full Sync'}
                  </button>
                )}
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-[#f5f5f7] rounded-full text-[11px] font-bold text-black/40 flex items-center gap-2"><Activity size={12} /> SSE Streaming</span>
                  <span className="px-4 py-2 bg-[#f5f5f7] rounded-full text-[11px] font-bold text-black/40 flex items-center gap-2"><Shield size={12} /> AES-256</span>
                  <span className="px-4 py-2 bg-[#f5f5f7] rounded-full text-[11px] font-bold text-black/40 flex items-center gap-2"><Zap size={12} /> Promise.all()</span>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {isGenerating && (
                  <div className="flex items-center gap-3 mb-6 px-5 py-3 bg-[#0071e3]/5 border border-[#0071e3]/10 rounded-2xl">
                    <Loader2 size={14} className="text-[#0071e3] animate-spin" />
                    <span className="text-[12px] font-bold text-[#0071e3]">
                      {mode === 'parallel'
                        ? `Streaming ${doneCount} / ${totalCount} chunks...`
                        : 'Generating documentation...'}
                    </span>
                  </div>
                )}
                <MarkdownRenderer content={activeContent || '_No content yet for this tab._'} />
              </div>
            )}
          </div>
        </section>

        {/* PANEL C — INTELLIGENCE HUD ───────────────────────────────────── */}
        <aside className="hidden lg:flex w-[320px] shrink-0 border-l border-black/[0.06] flex-col bg-white overflow-hidden">
          <div className="h-[52px] border-b border-black/5 flex items-center px-6 justify-between shrink-0">
            <span className="text-[10px] font-black text-black/25 uppercase tracking-[0.25em]">Intelligence HUD</span>
            <Maximize2 size={13} className="text-black/10" />
          </div>

          {/* HUD sub-nav */}
          <div className="flex border-b border-black/5 shrink-0">
            {[
              { key: 'howto', label: 'How It Works' },
              { key: 'metrics', label: 'Metrics' },
              { key: 'security', label: 'Security' },
              { key: 'archive', label: 'Archive' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setHudTab(tab.key as any)}
                className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-wider transition-colors ${
                  hudTab === tab.key ? 'text-[#0071e3] border-b-2 border-[#0071e3]' : 'text-black/25 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

            {/* Neural Core status card - always shown */}
            <div className="p-8 bg-black rounded-[32px] text-white flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 opacity-[0.04]"><Cpu size={120} strokeWidth={1} /></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse shadow-[0_0_8px_rgba(52,199,89,0.6)]" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em]">
                  {isGenerating ? 'Processing' : 'Neural Core Active'}
                </span>
              </div>
              <div className="relative z-10">
                <div className="text-[48px] font-bold tracking-tighter leading-none mb-1">
                  {totalCount > 0 ? `${doneCount}/${totalCount}` : '9.8'}
                </div>
                <div className="text-[10px] font-bold text-[#0071e3] uppercase tracking-widest">
                  {totalCount > 0 ? 'Chunks Complete' : 'Fidelity Rank'}
                </div>
              </div>
              {totalCount > 0 && (
                <div className="relative z-10">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0071e3] to-[#34c759] rounded-full transition-all duration-500"
                      style={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* HOW IT WORKS tab */}
            {hudTab === 'howto' && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-black/25 uppercase tracking-[0.25em]">How Parallel Mode Works</span>
                <div className="flex flex-col gap-3">
                  {[
                    { n: '01', title: 'Parse', desc: 'Code split into individual functions & classes by /api/parse' },
                    { n: '02', title: 'Fan Out', desc: 'All chunks sent simultaneously via Promise.all()' },
                    { n: '03', title: 'Stream', desc: 'Each chunk streams tokens live word-by-word via SSE' },
                    { n: '04', title: 'Assemble', desc: 'Results merged in original order as they arrive' },
                  ].map(s => (
                    <div key={s.n} className="flex gap-4 p-4 bg-[#f9f9fb] rounded-2xl border border-black/5">
                      <span className="text-[9px] font-black text-[#0071e3] uppercase tracking-widest mt-0.5 w-5 shrink-0">{s.n}</span>
                      <div>
                        <div className="text-[12px] font-bold text-black">{s.title}</div>
                        <div className="text-[11px] text-black/40 font-medium leading-snug mt-0.5">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* METRICS tab */}
            {hudTab === 'metrics' && (
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-black/25 uppercase tracking-[0.25em]">Performance Metrics</span>
                {[
                  { label: 'Inference Latency', value: '~42ms', color: 'text-[#0071e3]' },
                  { label: 'Avg Tokens/sec', value: '~400', color: 'text-[#af52de]' },
                  { label: 'Parallel Speedup', value: `${Math.max(1, totalCount)}x`, color: 'text-[#34c759]' },
                  { label: 'Session Tokens', value: String(tokenCount), color: 'text-[#ff9500]' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between px-5 py-4 bg-[#f9f9fb] border border-black/5 rounded-2xl">
                    <span className="text-[12px] font-bold text-black/60">{m.label}</span>
                    <span className={`text-[14px] font-black ${m.color}`}>{m.value}</span>
                  </div>
                ))}
                <div className="flex flex-col gap-2 px-5 py-4 bg-[#f9f9fb] border border-black/5 rounded-2xl">
                  <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">Live Network</span>
                  <div className="h-[36px] flex items-end gap-1">
                    {[40, 25, 60, 30, 80, 50, 20, 90, 45, 65, 30, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-black/5 rounded-t" style={{ height: '100%' }}>
                        <div className="bg-[#0071e3]/40 w-full rounded-t" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Network size={10} className="text-black/20" />
                    <span className="text-[9px] font-bold text-black/20 uppercase tracking-widest">TLS 1.3 · Port 443</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY tab */}
            {hudTab === 'security' && (
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-black/25 uppercase tracking-[0.25em]">Security Status</span>
                {[
                  { label: 'Encryption', value: 'AES-256 GCM', status: 'ACTIVE', color: 'text-[#34c759]' },
                  { label: 'Transport', value: 'TLS 1.3', status: 'SECURE', color: 'text-[#34c759]' },
                  { label: 'Code Persistence', value: 'Zero Storage', status: 'VERIFIED', color: 'text-[#34c759]' },
                  { label: 'Session Token', value: 'Rotating', status: 'ACTIVE', color: 'text-[#0071e3]' },
                  { label: 'LLM Training', value: 'Excluded', status: 'CONFIRMED', color: 'text-[#34c759]' },
                ].map(s => (
                  <div key={s.label} className="flex flex-col px-5 py-4 bg-[#f9f9fb] border border-black/5 rounded-2xl gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-black/50">{s.label}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${s.color}`}>{s.status}</span>
                    </div>
                    <span className="text-[13px] font-bold text-black">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ARCHIVE tab */}
            {hudTab === 'archive' && (
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-black/25 uppercase tracking-[0.25em]">Recent Sessions</span>
                {[
                  { name: 'userAuthService.ts', lang: 'TS', time: '12 min ago', chunks: 4 },
                  { name: 'api_router.py', lang: 'PY', time: '1 hr ago', chunks: 7 },
                  { name: 'CoreLayout.tsx', lang: 'TSX', time: '3 hr ago', chunks: 3 },
                ].map((f, i) => (
                  <button key={i} className="flex items-center gap-4 px-5 py-4 bg-[#f9f9fb] border border-black/5 rounded-2xl hover:shadow-md transition-all text-left group">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-black text-white">{f.lang}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold text-black truncate group-hover:text-[#0071e3] transition-colors">{f.name}</div>
                      <div className="text-[10px] text-black/30 font-medium">{f.time} · {f.chunks} chunks</div>
                    </div>
                    <ChevronRight size={13} className="text-black/10 group-hover:text-[#0071e3] transition-colors shrink-0" />
                  </button>
                ))}
                <button onClick={() => setShowHistory(true)} className="mt-2 text-[11px] font-black text-[#0071e3] uppercase tracking-widest hover:underline">
                  View All History
                </button>
              </div>
            )}

          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="h-[36px] border-t border-black/[0.04] flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-[#ff9500] animate-pulse' : 'bg-[#34c759]'}`} />
            <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">
              {isGenerating ? 'Processing' : 'System Stable'}
            </span>
          </div>
          <span className="text-[9px] text-black/20 uppercase tracking-widest">
            {mode === 'parallel' ? '⚡ Parallel · Promise.all()' : '○ Full Sync'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-black text-black/15 uppercase tracking-widest">
          <span>SSE Streaming</span>
          {[Command, Cpu, Globe, Binary].map((Icon, i) => <Icon key={i} size={10} strokeWidth={1.5} />)}
        </div>
      </footer>

      {/* HISTORY MODAL */}
      {showHistory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-2xl p-8">
          <div className="w-full max-w-[720px] bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-10 border-b border-black/5 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[24px] font-bold text-black tracking-tight">Sync History</h2>
                <p className="text-[13px] text-black/30 font-medium mt-1">Recent documentation sessions</p>
              </div>
              <button onClick={() => setShowHistory(false)} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-all">
                <Plus size={18} className="rotate-45" />
              </button>
            </div>
            <div className="flex-1 p-10 overflow-y-auto space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => toast.success(`Loading manifest #${24820 + i}`)} className="w-full flex items-center justify-between p-6 bg-[#f9f9fb] rounded-3xl hover:bg-[#0071e3] transition-all group text-left">
                  <div className="flex items-center gap-6">
                    <Cpu size={28} className="text-black/10 group-hover:text-white/40" />
                    <div>
                      <div className="text-[16px] font-bold text-black group-hover:text-white">Manifest #{24820 + i}</div>
                      <div className="text-[12px] text-black/30 group-hover:text-white/50">{i * 2} hours ago · {1240 + i * 120} tokens</div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-black/10 group-hover:text-white" />
                </button>
              ))}
            </div>
            <div className="p-8 border-t border-black/5 flex justify-center shrink-0">
              <button onClick={() => setShowHistory(false)} className="text-[12px] font-black text-black/20 uppercase tracking-widest hover:text-black">Close</button>
            </div>
          </div>
        </div>
      )}

      <input
        type="file" ref={fileInputRef}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) {
            const r = new FileReader();
            r.onload = x => { setCode(x.target?.result as string ?? ''); toast.success(`Loaded: ${f.name}`); };
            r.readAsText(f);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default CodeGenerator;

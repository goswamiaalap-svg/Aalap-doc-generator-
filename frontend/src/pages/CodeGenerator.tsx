import React, { useState, useRef, useEffect } from 'react';
import {
  Zap, Loader2, Cpu, Sparkles, Command, FileText, Layers,
  ChevronRight, Maximize2, Binary, Shield, Activity, Network,
  Globe, Database, Search, Eye, Settings, History, Plus,
  Upload, Clock, CheckCircle, XCircle, Circle, ArrowLeft, X, Download 
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
  const [history, setHistory] = useState<{name: string, lang: string, time: string, tokens: number, type: string, code: string}[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

  // Panel C active section
  const [hudTab, setHudTab] = useState<'how-it-works' | 'metrics' | 'security' | 'archive'>('how-it-works');

  // Full-doc results (4 primary tabs + 4 supplementary)
  const [results, setResults] = useState<Record<string, string>>({
    DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: ''
  });

  // Parallel mode
  const [chunkStatuses, setChunkStatuses] = useState<ChunkStatus[]>([]);
  const [docstringOutput, setDocstringOutput] = useState('');
  const [fileName, setFileName] = useState<string>('');

  // Refs to hold accumulated values without stale closures
  const outputsRef = useRef<string[]>([]);
  const chunksRef = useRef<CodeChunk[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('docgen_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('docgen_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    setTokenCount(code.split(/\s+/).filter(Boolean).length);
  }, [code]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isGenerating && code.trim()) {
        handleGenerate();
      }
      if (e.key === 'Escape' && showHistory) {
        setShowHistory(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isGenerating, code, showHistory]);

  const addToHistory = (name: string, lang: string, tokens: number, type: string, codeContent: string) => {
    const newItem = {
      name: name || 'Untitled Module',
      lang: lang.toUpperCase(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokens,
      type,
      code: codeContent
    };
    setHistory(prev => [newItem, ...prev.slice(0, 9)]); // Keep last 10
  };

  // ── PARALLEL GENERATE ─────────────────────────────────────────────────────
  const runParallel = async () => {
    setIsGenerating(true);
    setDocstringOutput('');
    setChunkStatuses([]);
    setResults({ DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: '' });
    abortRef.current = new AbortController();
    
    addToHistory(fileName || 'Parallel Sync', language, tokenCount, 'Parallel Sync', code);

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
        runFull();
        return;
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
      
      // Background full sync
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
      
      toast.success(`${chunks.length} chunks documented ✓`);

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
    
    addToHistory(fileName || 'Full Sync', language, tokenCount, 'Full Sync', code);

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

          <div className="flex bg-[#f5f5f7] rounded-full p-0.5 border border-black/5 mx-2">
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
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-[#f5f5f7] rounded-full border border-black/5 text-[11px] font-black text-black/60">
            <Activity size={12} className="text-[#0071e3]" />
            {tokenCount} <span className="opacity-40 ml-1">TOKENS</span>
          </div>
          <button onClick={handleExportPDF} className="px-3 py-1.5 bg-[#f5f5f7] rounded-lg text-[10px] font-bold tracking-widest uppercase hover:bg-black/5 transition-colors">Export PDF</button>
          <button onClick={handleExportMarkdown} className="px-3 py-1.5 bg-[#f5f5f7] rounded-lg text-[10px] font-bold tracking-widest uppercase hover:bg-black/5 transition-colors">Export MD</button>
          <button onClick={() => setShowHistory(true)} className="p-2 text-black/20 hover:text-black transition-colors relative">
            <History size={18} />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0071e3] rounded-full" />
          </button>
          <button className="apple-btn-primary h-9 px-6 text-[12px] font-bold">Upgrade</button>
        </div>
      </header>

      {/* ── TRIPLE-PANEL BODY ────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* PANEL A — INPUT ─────────────────────────────────────────────── */}
        <aside className="w-[300px] shrink-0 flex flex-col border-r border-black/[0.06] bg-[#f9f9fb] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar">

            {/* Source Inputs */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.25em]">Source Ingest</span>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-black/[0.06] rounded-2xl hover:bg-black hover:text-white transition-all group"
                >
                  <Upload size={18} className="text-[#0071e3]" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Inject File</span>
                </button>
                <button
                  onClick={() => toast.error('ZIP ingestion requires Architect plan')}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-black/[0.06] rounded-2xl hover:bg-black hover:text-white transition-all group opacity-50"
                >
                  <Layers size={18} className="text-[#ff9500]" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Inject ZIP</span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20"><Globe size={14} /></div>
                <input 
                  type="text" 
                  placeholder="GitHub URL..."
                  className="w-full bg-white border border-black/[0.06] rounded-xl pl-12 pr-4 py-3 text-[12px] font-bold outline-none focus:border-[#0071e3] transition-all"
                  onKeyDown={e => e.key === 'Enter' && toast.error('GitHub Sync requires an active session')}
                />
              </div>

              {fileName && (
                <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f7] rounded-xl border border-black/5">
                  <span className="text-[11px] font-bold text-black/60 truncate max-w-[180px]">{fileName}</span>
                  <button onClick={() => setFileName('')} className="text-black/20 hover:text-red-500"><XCircle size={14} /></button>
                </div>
              )}
            </div>

            {/* Language */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.25em]">Neural Grammar</span>
              <select
                value={language} onChange={e => setLanguage(e.target.value)}
                className="w-full bg-white border border-black/[0.06] rounded-xl px-4 py-3 text-[12px] font-bold outline-none appearance-none cursor-pointer hover:border-[#0071e3] transition-all"
              >
                {['typescript', 'javascript', 'python', 'rust', 'cpp', 'java', 'go', 'swift'].map(l => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Code textarea */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.25em]">Code Buffer</span>
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
            {chunkStatuses.length > 0 && mode === 'parallel' && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.25em]">Parallel Chunks ({doneCount}/{totalCount})</span>
                <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0071e3] to-[#34c759] rounded-full transition-all duration-500"
                    style={{ width: totalCount > 0 ? `${(doneCount / totalCount) * 100}%` : '0%' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
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
          </div>

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
          <div className="h-[52px] border-b border-black/5 flex items-center px-8 gap-10 overflow-x-auto shrink-0 no-scrollbar">
            {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM'] as TabType[]).map(tab => (
              <button
                key={tab} onClick={() => setActiveTab(tab)}
                className={`shrink-0 text-[10px] uppercase font-bold tracking-[0.2em] py-1.5 relative transition-colors ${
                  activeTab === tab ? 'text-black' : 'text-black/25 hover:text-black/60'
                }`}
              >
                {tab.replace('_', ' ')}
                {activeTab === tab && <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-[#0071e3] rounded-full" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-10 md:p-16 custom-scrollbar">
            {!hasOutput && !isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-apple-fade">
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-[#0071e3]/5 rounded-[40px] blur-3xl animate-pulse" />
                  <div className="relative w-32 h-32 rounded-[36px] bg-white border border-black/[0.08] shadow-2xl flex items-center justify-center">
                    <Zap size={48} className="text-[#0071e3]" strokeWidth={1.2} fill="currentColor" />
                  </div>
                </div>
                <div className="max-w-[520px]">
                  <h2 className="text-[32px] font-bold text-black tracking-tight mb-4 flex items-center justify-center gap-4">
                    <Zap size={28} className="text-[#0071e3]" fill="currentColor" />
                    Parallel Processing Ready
                  </h2>
                  <p className="text-[17px] text-black/45 font-medium leading-relaxed mb-12">
                    Each function & class will be documented simultaneously via parallel API calls. Results stream in live.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-8 mb-16 opacity-40">
                     <div className="flex items-center gap-2.5">
                        <Network size={14} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">SSE Streaming</span>
                     </div>
                     <div className="flex items-center gap-2.5">
                        <Shield size={14} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">AES-256</span>
                     </div>
                     <div className="flex items-center gap-2.5">
                        <Zap size={14} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Promise.all()</span>
                     </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <button onClick={() => fileInputRef.current?.click()} className="h-14 px-10 bg-black text-white rounded-full text-[15px] font-bold hover:scale-105 transition-all shadow-xl">Inject File</button>
                     <button onClick={() => setCode(`export function calculateNeuralPath(nodes: Node[]) {\n  // Logic synthesis example\n  return nodes.reduce((acc, n) => acc + n.fidelity, 0);\n}`)} className="h-14 px-10 bg-white border border-black/10 rounded-full text-[15px] font-bold hover:bg-black hover:text-white transition-all shadow-sm">Try Example</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[900px] mx-auto">
                {isGenerating && (
                  <div className="flex items-center gap-3 mb-10 px-6 py-4 bg-[#0071e3]/5 border border-[#0071e3]/10 rounded-[20px]">
                    <Loader2 size={16} className="text-[#0071e3] animate-spin" />
                    <span className="text-[13px] font-bold text-[#0071e3]">
                      {mode === 'parallel'
                        ? `Streaming logical chunks: ${doneCount} / ${totalCount} complete`
                        : 'Performing deep synthesis...'}
                    </span>
                  </div>
                )}
                <MarkdownRenderer content={activeContent || '_Synthesizing section..._'} />
              </div>
            )}
          </div>
        </section>

        {/* PANEL C — INTELLIGENCE HUD ───────────────────────────────────── */}
        <aside className="hidden lg:flex w-[340px] shrink-0 border-l border-black/[0.06] flex-col bg-[#fbfbfd] overflow-hidden">
          <div className="h-[64px] border-b border-black/5 flex items-center px-8 justify-between shrink-0">
            <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">Intelligence HUD</span>
            <Activity size={14} className="text-[#0071e3]" />
          </div>

          <div className="flex border-b border-black/5 shrink-0">
            {[
              { key: 'how-it-works', label: 'How it Works' },
              { key: 'metrics', label: 'Metrics' },
              { key: 'security', label: 'Security' },
              { key: 'archive', label: 'Archive' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setHudTab(tab.key as any)}
                className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all ${
                  hudTab === tab.key ? 'text-[#0071e3] bg-white border-r border-black/5' : 'text-black/30 hover:text-black hover:bg-black/[0.02]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 no-scrollbar">
            {/* AI Summary Card */}
            <div className="p-8 bg-black rounded-[40px] text-white flex flex-col gap-8 relative overflow-hidden shadow-2xl group z-10 transition-all hover:bg-[#111]">
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Neural Core Active</span>
                  </div>
                  <div className="text-[56px] font-bold tracking-tighter leading-none">9.8</div>
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="h-[1px] w-full bg-white/10" />
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                     <span className="text-white/40">Tokens Synthesized</span>
                     <span>{results.QUALITY ? '6,240' : '0'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                     <span className="text-white/40">Latency Buffer</span>
                     <span className="text-[#34c759]">OPTIMAL</span>
                  </div>
               </div>
            </div>

            {/* Content for HUD sections */}
            <div className="flex-1 flex flex-col gap-10">
              {hudTab === 'how-it-works' ? (
                <div className="flex flex-col gap-8 animate-apple-fade">
                   <span className="text-[10px] font-black text-black/25 uppercase tracking-[0.3em]">How Parallel Mode Works</span>
                   <div className="flex flex-col gap-4">
                      {[
                        { step: '01', title: 'Parse', text: 'Code split into individual functions & classes by /api/parse' },
                        { step: '02', title: 'Fan Out', text: 'All chunks sent simultaneously via Promise.all()' },
                        { step: '03', title: 'Stream', text: 'Each chunk streams tokens live word-by-word via SSE' },
                        { step: '04', title: 'Assemble', text: 'Results merged in original order as they arrive' }
                      ].map(s => (
                        <div key={s.step} className="p-6 bg-white border border-black/5 rounded-[24px] flex flex-col gap-2 hover:shadow-lg transition-all">
                           <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-[#0071e3]">{s.step}</span>
                              <span className="text-[14px] font-bold text-black">{s.title}</span>
                           </div>
                           <p className="text-[12px] text-black/40 font-medium leading-relaxed">{s.text}</p>
                        </div>
                      ))}
                   </div>
                </div>
              ) : results[hudTab.toUpperCase()] ? (
                <div className="animate-apple-fade">
                   <span className="text-[10px] font-black text-black/25 uppercase tracking-[0.3em] mb-6 block">Analysis Insight</span>
                   <div className="prose-studio-sidebar h-full">
                      <MarkdownRenderer content={results[hudTab.toUpperCase()]} />
                   </div>
                </div>
              ) : (
                <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                   <Binary size={40} strokeWidth={1} />
                   <p className="text-[11px] font-bold uppercase tracking-widest">Awaiting Synthesis</p>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* FOOTER */}
      <footer className="h-[40px] border-t border-black/[0.05] flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-[#ff9500] animate-pulse' : 'bg-[#34c759]'}`} />
            <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">
              {isGenerating ? 'Synthesizing Manifest' : 'Neural Core Encrypted'}
            </span>
          </div>
          <div className="h-3 w-[1px] bg-black/5" />
          <span className="text-[10px] font-bold text-black/15 uppercase tracking-widest">TLS 1.3 · AES-256</span>
        </div>
        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black text-[#0071e3] uppercase tracking-widest">v1.2.4 Manifest Stable</span>
        </div>
      </footer>

      {/* HISTORY MODAL EXHIBIT */}
      {showHistory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/40 backdrop-blur-3xl p-8" onClick={() => setShowHistory(false)}>
          <div className="w-full max-w-[800px] bg-white border border-black/10 rounded-[56px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[85vh] animate-apple-slide" onClick={e => e.stopPropagation()}>
            <div className="px-12 pt-12 pb-8 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[32px] font-bold text-black tracking-tight">Project History</h2>
                <p className="text-[15px] text-black/30 font-medium mt-1">Navigate your recent architectural maps</p>
              </div>
              <button onClick={() => setShowHistory(false)} className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 px-12 pb-12 overflow-y-auto space-y-4 custom-scrollbar">
               {history.length > 0 ? history.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => { 
                    setCode(item.code); 
                    setShowHistory(false); 
                    toast.success(`Restored: ${item.name}`); 
                  }} 
                  className="w-full flex items-center justify-between p-8 bg-[#fbfbfd] border border-black/[0.03] rounded-[32px] hover:bg-white hover:shadow-xl hover:border-transparent transition-all group text-left outline-none"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center group-hover:bg-[#0071e3] transition-colors">
                      <span className="text-[11px] font-black text-white">{item.lang.substring(0, 3)}</span>
                    </div>
                    <div>
                      <div className="text-[18px] font-bold text-black">{item.name}</div>
                      <div className="flex items-center gap-3 mt-1.5 opacity-30">
                         <span className="text-[11px] font-black uppercase tracking-widest">{item.time}</span>
                         <div className="w-1 h-1 bg-black rounded-full" />
                         <span className="text-[11px] font-black uppercase tracking-widest">{item.tokens} tokens</span>
                         <div className="w-1 h-1 bg-black rounded-full" />
                         <span className="text-[11px] font-black uppercase tracking-widest text-[#0071e3]">{item.type}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-black/5 group-hover:text-black transition-colors" />
                </button>
              )) : (
                <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                   <Clock size={40} strokeWidth={1} />
                   <p className="text-[11px] font-bold uppercase tracking-widest">No Recent Manifests</p>
                </div>
              )}
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
            setFileName(f.name);
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

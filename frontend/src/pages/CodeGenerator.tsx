import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap,
  Loader2,
  Cpu,
  Share2,
  Trash2,
  Download,
  Info,
  Sparkles,
  Command,
  FileText,
  AlertTriangle,
  RefreshCw,
  Activity,
  Terminal,
  Layers,
  ChevronRight,
  Maximize2,
  Binary,
  Shield,
  Activity as Pulse,
  Save,
  Globe,
  Database,
  Search,
  Eye,
  Settings,
  History
} from 'lucide-react';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../components/MarkdownRenderer';

type TabType = 'DOCSTRINGS' | 'README' | 'API_REF' | 'DIAGRAM' | 'SECURITY' | 'PERFORMANCE' | 'TESTS' | 'QUALITY';

const CodeGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DOCSTRINGS');
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({
    DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: ''
  });
  const [language, setLanguage] = useState('typescript');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTokenCount(code.split(/\s+/).filter(x => x.length).length);
  }, [code]);

  const handleGenerate = async () => {
    if (!code.trim()) return toast.error('INPUT REQUIRED');
    setIsGenerating(true);
    setErrorDetails(null);
    setResults({ DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: '' });
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (!reader) throw new Error('STREAM_FAILURE');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
             try {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') break;
                const data = JSON.parse(dataStr);
                if (data.text) {
                  fullText += data.text;
                  extractMarkers(fullText);
                }
             } catch (e) {}
          }
        }
      }
      toast.success('NEURAL SYNC COMPLETE');
    } catch (err: any) {
      setErrorDetails(err.message);
      toast.error('BRIDGE FAILURE');
    } finally {
      setIsGenerating(false);
    }
  };

  const extractMarkers = (text: string) => {
    const markers: Record<string, string> = {
      DOCSTRINGS: '---DOCGEN:DOCSTRINGS---', README: '---DOCGEN:README---', API_REF: '---DOCGEN:API_REF---',
      DIAGRAM: '---DOCGEN:DIAGRAM---', SECURITY: '---DOCGEN:SECURITY---', PERFORMANCE: '---DOCGEN:PERFORMANCE---',
      TESTS: '---DOCGEN:TESTS---', QUALITY: '---DOCGEN:QUALITY---'
    };
    const newResults: Record<string, string> = {};
    const markerKeys = Object.keys(markers);
    for (let i = 0; i < markerKeys.length; i++) {
        const currentKey = markerKeys[i] as TabType;
        const currentMarker = markers[currentKey];
        const nextMarker = markerKeys[i+1] ? markers[markerKeys[i+1]] : null;
        const startIdx = text.indexOf(currentMarker);
        if (startIdx !== -1) {
            const contentStart = startIdx + currentMarker.length;
            const contentEnd = nextMarker ? text.indexOf(nextMarker, contentStart) : text.length;
            const content = text.slice(contentStart, contentEnd === -1 ? text.length : contentEnd).trim();
            newResults[currentKey] = content;
        }
    }
    setResults(prev => ({ ...prev, ...newResults }));
  };

  const score = results.QUALITY ? parseInt(results.QUALITY) : 0;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-48px)] bg-[#ffffff] relative overflow-hidden selection:bg-[#0071e3]/10">
      
      {/* 🍏 NEURAL TECHNICAL GRID — BACKGROUND POLISH */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ 
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }} />

      {/* 🍏 HIGH-DENSITY HEADER — THE OS HUD */}
      <header className="h-[72px] border-b border-black/[0.06] flex items-center justify-between px-10 relative z-20 bg-white/80 backdrop-blur-xl">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-5">
               <div className="w-10 h-10 rounded-[14px] bg-black text-white flex items-center justify-center shadow-lg">
                  <Zap size={18} fill="white" />
               </div>
               <div className="flex flex-col">
                  <h1 className="text-[18px] font-bold text-[#1d1d1f] tracking-tight">Stage 4 Synthesis Hub</h1>
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-black text-[#34c759] uppercase tracking-widest animate-pulse">Sync Active</span>
                     <div className="h-1 w-1 bg-black/10 rounded-full" />
                     <span className="text-[9px] font-bold text-black/20 uppercase tracking-widest">v2.4 PRO Tier</span>
                  </div>
               </div>
            </div>
            <div className="h-10 w-[1px] bg-black/[0.04]" />
            <nav className="hidden xl:flex items-center gap-8">
               {[ ['Metrics', Activity], ['Security', Shield], ['Archive', Database], ['Explorer', Globe] ].map(([label, Icon]: any) => (
                 <button key={label} className="flex items-center gap-3 text-[11px] font-bold text-black/30 hover:text-black transition-colors uppercase tracking-[0.15em]">
                    <Icon size={14} strokeWidth={1.5} />
                    {label}
                 </button>
               ))}
            </nav>
         </div>
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-4 px-5 py-2.5 bg-[#f5f5f7] border border-black/[0.04] rounded-full">
               <Pulse size={14} className="text-[#0071e3]" />
               <span className="text-[11px] font-black tracking-widest text-[#1d1d1f]">0.92 <small className="opacity-30">GB/S</small></span>
               <div className="h-4 w-[1px] bg-black/10" />
               <span className="text-[11px] font-black tracking-widest text-[#1d1d1f]">{tokenCount} <small className="opacity-30">TOKENS</small></span>
            </div>
            <div className="flex gap-2">
               <button className="p-3 text-black/10 hover:text-black transition-colors"><Settings size={18} /></button>
               <button className="p-3 text-black/10 hover:text-black transition-colors"><History size={18} /></button>
            </div>
         </div>
      </header>

      {/* 🍏 MAIN TRIPLE-PANEL HUD ARCHITECTURE */}
      <main className="flex-1 flex overflow-hidden relative z-10 w-full">
        
        {/* 🍏 PANEL A: THE LOGIC DOCK */}
        <aside className="w-[320px] flex flex-col border-r border-black/[0.06] bg-[#f5f5f7]/40 p-8 gap-10 shrink-0">
           <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Logic Injection</span>
              <div className="flex flex-col gap-3">
                 <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="w-full bg-white border border-black/[0.08] shadow-sm rounded-2xl px-5 py-3.5 text-[14px] text-[#1d1d1f] font-bold outline-none"
                 >
                    {[ 'typescript', 'javascript', 'python', 'rust', 'cpp', 'java', 'go', 'swift' ].map(l => (
                        <option key={l} value={l}>{l.toUpperCase()}</option>
                    ))}
                 </select>
                 <div className="bg-white border border-black/[0.04] rounded-[28px] h-[340px] relative shadow-lg shadow-black/[0.01] p-1">
                    <textarea 
                      value={code} onChange={e => setCode(e.target.value)}
                      placeholder="// Inject source logic..."
                      className="w-full h-full bg-transparent p-7 font-mono text-[14px] text-[#1d1d1f]/75 resize-none outline-none custom-scrollbar leading-[1.7]"
                    />
                 </div>
              </div>
           </div>

           <div className="flex-1 flex flex-col gap-6">
              <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Sync Protocols</span>
              <div className="flex flex-col gap-3">
                 {[ 
                   {label: 'Deep Synthesis', icon: <Sparkles size={14} />, color: 'text-[#0071e3]'},
                   {label: 'Architecture Map', icon: <Layers size={14} />, color: 'text-[#af52de]'},
                   {label: 'Sec. Rotation', icon: <Shield size={14} />, color: 'text-[#34c759]'}
                 ].map(p => (
                   <button key={p.label} className="w-full flex items-center justify-between p-4 bg-white border border-black/[0.04] rounded-2xl group hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                         <span className={p.color}>{p.icon}</span>
                         <span className="text-[12px] font-bold text-black/50">{p.label}</span>
                      </div>
                      <ChevronRight size={14} className="opacity-20 translate-x-[-4px] group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                   </button>
                 ))}
              </div>
           </div>

           <button 
             onClick={handleGenerate} disabled={isGenerating || !code.trim()}
             className={`apple-btn-primary w-full h-[72px] text-[18px] font-bold shadow-2xl relative overflow-hidden ${
                 isGenerating || !code.trim() ? 'opacity-10 scale-[0.98]' : 'hover:scale-[1.02] active:scale-95'
             }`}
           >
              {isGenerating ? <Loader2 size={24} className="animate-spin" /> : 'Run Neural Sync'}
           </button>
        </aside>

        {/* 🍏 PANEL B: THE ANALYTICAL CORE — ALIGNMENT FIXED */}
        <section className="flex-1 flex flex-col min-w-0 bg-white relative">
           <div className="h-[60px] border-b border-black/[0.04] flex items-center justify-start px-10 gap-8">
              {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`text-[10px] uppercase font-black tracking-[0.2em] transition-all relative py-2 ${
                      activeTab === tab ? 'text-black' : 'text-black/20 hover:text-black/40'
                  }`}
                >
                  {tab.replace('_', ' ')}
                  {activeTab === tab && <div className="absolute bottom-0 inset-x-0 h-[2px] bg-[#0071e3] rounded-full" />}
                </button>
              ))}
           </div>
           
           <div className="flex-1 overflow-y-auto w-full custom-scrollbar selection:bg-[#0071e3]/10">
              <div className="max-w-[100%] mx-auto p-12 md:p-20">
                 {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-40">
                       <div className="p-16 rounded-full bg-[#f5f5f7] mb-12 relative animate-apple-fade scale-125">
                          <Eye size={48} className="text-black/5" strokeWidth={1} />
                       </div>
                       <h2 className="text-[20px] font-bold text-black tracking-tight mb-4 uppercase tracking-[0.2em]">Manifest Buffer Ready</h2>
                       <p className="text-[14px] text-black/20 max-w-[320px] font-medium leading-relaxed uppercase">Stage 4 Logical Manifest Initialization Queue</p>
                    </div>
                 ) : (
                    <div className="animate-apple-fade max-w-full">
                       {activeTab === 'QUALITY' ? (
                          <div className="flex flex-col items-center gap-24 py-10 scale-90 md:scale-100">
                             <div className="relative">
                                <svg width="240" height="240" viewBox="0 0 150 150" className="transform -rotate-90">
                                   <circle cx="75" cy="75" r="68" stroke="rgba(0,0,0,0.02)" strokeWidth="4" fill="transparent" />
                                   <circle cx="75" cy="75" r="68" stroke="#0071e3" strokeWidth="4" fill="transparent" strokeDasharray={427} strokeDashoffset={427 - (427 * score * 10) /100} strokeLinecap="round" className="transition-all duration-[2000ms]" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                   <span className="text-[88px] font-bold text-[#1d1d1f] tracking-tighter leading-none">{score}</span>
                                   <span className="text-[12px] font-black text-[#0071e3] uppercase mt-4">Neural Rank</span>
                                </div>
                             </div>
                             <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-[800px]">
                                {[ ['Latency', 9.8, 'ms'], ['Integrity', 99.1, '%'], ['Drift', 0.42, 'pts'], ['Scan', score*10, '%'] ].map(([l, v, s]: any) => (
                                   <div key={l} className="border-l border-black/[0.08] pl-8">
                                      <span className="text-[9px] font-black text-black/20 uppercase tracking-widest">{l}</span>
                                      <p className="text-[24px] font-bold text-[#1d1d1f] tracking-tighter">{v}{s}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       ) : (
                          <div className="prose prose-stone max-w-full 
                              text-[19px] text-[#1d1d1f]/75 leading-[1.8] font-medium break-words
                              prose-headings:text-[#1d1d1f] prose-headings:font-bold prose-headings:tracking-tighter
                              prose-pre:bg-[#f5f5f7] prose-pre:border-none prose-pre:rounded-[36px] prose-pre:p-14 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]
                              prose-code:max-w-full prose-code:overflow-x-auto
                          ">
                             <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Recalibrating manifest...' : '# Waiting for logical injection...')} />
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        </section>

        {/* 🍏 PANEL C: THE ARCHITECTURE HUD — NEW SPACE FILLER */}
        <aside className="hidden lg:flex w-[340px] border-l border-black/[0.06] flex-col overflow-hidden bg-white">
           <div className="h-[60px] border-b border-black/[0.04] flex items-center px-8">
              <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Synthesis Intelligence</span>
           </div>
           
           <div className="flex-1 p-8 flex flex-col gap-10 overflow-y-auto no-scrollbar">
              {/* DIAGNOSTIC PULSE CARD */}
              <div className="p-8 bg-black rounded-[40px] text-white flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Binary size={100} strokeWidth={1} />
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Processor Node Active</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[42px] font-bold tracking-tighter leading-none">88.42%</span>
                    <span className="text-[11px] font-medium text-white/30 mt-2 uppercase tracking-widest">Synthesis Fidelity</span>
                 </div>
                 <div className="h-[1px] w-full bg-white/10" />
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>Cluster: G-Edge-01</span>
                    <span>9.4ms</span>
                 </div>
              </div>

              {/* RECENT SYNPASES LIST */}
              <div className="flex flex-col gap-6">
                 <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Recent Synapses</span>
                 <div className="flex flex-col gap-4">
                    {[ 'Core_Layout_v2.tsx', 'Neural_Bridge_Node.go', 'AES_Rotation.py', 'Manifest_Doc.md' ].map(file => (
                      <div key={file} className="flex items-center justify-between p-5 bg-[#f5f5f7] rounded-3xl hover:bg-black transition-all group cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black/20 group-hover:text-black transition-all">
                               <FileText size={14} />
                            </div>
                            <span className="text-[12px] font-bold text-black/50 group-hover:text-white/60 transition-all">{file}</span>
                         </div>
                         <Plus size={14} className="text-black/10 group-hover:text-white" />
                      </div>
                    ))}
                 </div>
              </div>

              {/* SYSTEM HEALTH GRID */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                 {[ ['Uptime', '100%'], ['Bridge', 'Secure'], ['Cache', 'Enabled'], ['Stage', '4.2'] ].map(([k, v]) => (
                    <div key={k} className="p-5 border border-black/[0.04] rounded-[24px]">
                       <span className="text-[8px] font-black text-black/20 uppercase tracking-widest block mb-1">{k}</span>
                       <span className="text-[13px] font-bold text-black/60 truncate">{v}</span>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="p-8 border-t border-black/[0.06] bg-[#f5f5f7]/40">
              <button className="apple-btn-secondary w-full h-[56px] border-none text-[13px] font-bold text-black/30 hover:text-black">
                 View Laboratory Logs
              </button>
           </div>
        </aside>
      </main>

      {/* 🍏 LOGIC STREAM FOOTER — FINAL FILLER */}
      <footer className="h-[40px] border-t border-black/[0.06] flex items-center justify-between px-10 relative z-20 bg-white">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
               <span className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em]">System Normal</span>
            </div>
            <div className="h-3 w-[1px] bg-black/10" />
            <span className="text-[9px] font-medium text-black/20 uppercase tracking-[0.1em]">Neural Engine v2.4-stable-cluster-01</span>
         </div>
         <div className="flex items-center gap-6 text-[9px] font-black text-black/20 uppercase tracking-[0.2em]">
            <span>Latency: 0.94ms</span>
            <span className="text-[#0071e3]">Encrypted</span>
         </div>
      </footer>

      <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onload = x => setCode(x.target?.result as string); r.readAsText(f); } }} className="hidden" />
    </div>
  );
};

export default CodeGenerator;

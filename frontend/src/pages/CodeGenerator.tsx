import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap,
  Loader2,
  Cpu,
  Sparkles,
  Command,
  FileText,
  Layers,
  ChevronRight,
  Maximize2,
  Binary,
  Shield,
  Activity,
  Network,
  Globe,
  Database,
  Search,
  Eye,
  Settings,
  History,
  Plus,
  Upload,
  Clock
} from 'lucide-react';
const Pulse = Activity;
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
  const [tokenCount, setTokenCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTokenCount(code.split(/\s+/).filter((x: string) => x.length > 0).length);
  }, [code]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isGenerating && code.trim()) handleGenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGenerating, code]);

  const handleGenerate = async () => {
    if (!code.trim()) return toast.error('INPUT REQUIRED');
    setIsGenerating(true);
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
                if (data.text) { fullText += data.text; extractMarkers(fullText); }
             } catch (e) {}
          }
        }
      }
      toast.success('NEURAL SYNC COMPLETE');
    } catch (err: any) {
      toast.error('BRIDGE FAILURE');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormat = () => {
     if(!code.trim()) return;
     toast.success('LAB FORMATTING APPLIED');
     // Simulated formatting for visual richness
     setCode((prev: string) => prev.trim());
  };

  const extractMarkers = (text: string) => {
    const markers: Record<TabType, string> = {
      DOCSTRINGS: '---DOCGEN:DOCSTRINGS---',
      README: '---DOCGEN:README---',
      API_REF: '---DOCGEN:API_REF---',
      DIAGRAM: '---DOCGEN:DIAGRAM---',
      SECURITY: '---DOCGEN:SECURITY---',
      PERFORMANCE: '---DOCGEN:PERFORMANCE---',
      TESTS: '---DOCGEN:TESTS---',
      QUALITY: '---DOCGEN:QUALITY---'
    };

    const newResults: Record<string, string> = {};
    const markerPositions = (Object.keys(markers) as TabType[])
      .map(key => ({ key, index: text.indexOf(markers[key]) }))
      .filter(m => m.index !== -1)
      .sort((a, b) => a.index - b.index);

    for (let i = 0; i < markerPositions.length; i++) {
        const current = markerPositions[i];
        const next = markerPositions[i+1];
        const start = current.index + markers[current.key].length;
        const end = next ? next.index : text.length;
        newResults[current.key] = text.slice(start, end).trim();
    }
    setResults(prev => ({ ...prev, ...newResults }));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#ffffff] relative selection:bg-[#0071e3]/10 font-sans">
      
      {/* 🍏 HIGH-DENSITY HEADER HUD */}
      <header className="h-[72px] border-b border-black/[0.06] flex items-center justify-between px-10 relative z-20 bg-white/80 backdrop-blur-xl">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-5">
               <div className="w-10 h-10 rounded-[14px] bg-black text-white flex items-center justify-center shadow-lg">
                  <Zap size={18} fill="white" />
               </div>
               <div className="flex flex-col">
                  <h1 className="text-[18px] font-bold text-[#1d1d1f] tracking-tight">Stage 4 Synthesis Hub</h1>
                  <span className="text-[9px] font-black text-[#34c759] uppercase tracking-widest animate-pulse">Sync Active</span>
               </div>
            </div>
            <div className="h-10 w-[1px] bg-black/[0.04]" />
            <nav className="flex items-center gap-8">
               {[ {label: 'Metrics', icon: Activity}, {label: 'Security', icon: Shield}, {label: 'Archive', icon: Database}, {label: 'Search', icon: Search} ].map((item: any) => (
                 <button key={item.label} onClick={() => toast.success(`${item.label.toUpperCase()} PROTOCOL ACTIVE`)} className="flex items-center gap-3 text-[11px] font-black text-black/30 hover:text-black transition-colors uppercase tracking-[0.16em]">
                    <item.icon size={15} strokeWidth={1.5} />
                    {item.label}
                 </button>
               ))}
            </nav>
         </div>
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-4 px-6 py-3 bg-[#f5f5f7] border border-black/[0.02] rounded-full shadow-inner">
               <Pulse size={14} className="text-[#0071e3]" />
               <span className="text-[11px] font-black tracking-widest text-[#1d1d1f]">0.92 <small className="opacity-20 uppercase ml-1">GB/S</small></span>
               <div className="h-4 w-[1px] bg-black/10" />
               <span className="text-[11px] font-black tracking-widest text-[#1d1d1f]">{tokenCount} <small className="opacity-20 uppercase ml-1">TOKENS</small></span>
            </div>
            <div className="flex gap-2">
               <button onClick={() => toast.success('LAB SETTINGS SYNCED')} className="p-3 text-black/20 hover:text-black transition-colors"><Settings size={20} /></button>
               <button onClick={() => setShowHistory(true)} className="p-3 text-black/20 hover:text-black transition-colors relative">
                  <History size={20} />
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#0071e3] rounded-full" />
               </button>
            </div>
         </div>
      </header>

      {/* 🍏 MAIN TRIPLE-PANEL HUD ARCHITECTURE */}
      <main className="flex-1 flex overflow-hidden relative z-10 w-full">
        
        {/* 🍏 PANEL A: THE LOGIC DOCK — SCROLLABLE SIDEBAR FIXED */}
        <aside className="w-[320px] flex flex-col border-r border-black/[0.06] bg-[#f5f5f7]/40 relative shrink-0">
           <div className="flex-1 overflow-y-auto custom-scrollbar p-10 flex flex-col gap-10 pb-[100px]">
              {/* PROMINENT UPLOAD BUTTON — NEW ADVANCED FEATURE */}
              <div className="flex flex-col gap-6">
                 <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Sovereign Batch</span>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full flex items-center justify-between p-6 bg-black text-white rounded-[28px] shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                 >
                    <div className="flex items-center gap-4">
                       <Upload size={18} className="text-[#0071e3] group-hover:rotate-12 transition-transform" />
                       <span className="text-[13px] font-bold">Inject File</span>
                    </div>
                    <Plus size={16} />
                 </button>
              </div>

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
                    <div className="bg-white border border-black/[0.04] rounded-[28px] h-[280px] relative shadow-lg shadow-black/[0.01] p-1">
                       <textarea 
                         value={code} onChange={e => setCode(e.target.value)}
                         placeholder="// Inject logic..."
                         className="w-full h-full bg-transparent p-7 font-mono text-[14px] text-[#1d1d1f]/75 resize-none outline-none custom-scrollbar leading-[1.7]"
                       />
                       <button onClick={handleFormat} className="absolute bottom-5 right-5 p-2 bg-[#f5f5f7] rounded-lg text-black/20 hover:text-black transition-colors"><Binary size={14} /></button>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                 <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Sync Protocols</span>
                 {[ {label: 'Deep Sync', icon: Sparkles, color: 'text-[#0071e3]'}, {label: 'Logic Map', icon: Layers, color: 'text-[#af52de]'} ].map(p => (
                    <button key={p.label} onClick={() => toast.success(`${p.label.toUpperCase()} MODE ACTIVE`)} className="flex items-center justify-between p-4 bg-white border border-black/[0.04] rounded-2xl hover:shadow-lg transition-all group">
                       <div className="flex items-center gap-4">
                          <span className={p.color}><p.icon size={14} /></span>
                          <span className="text-[12px] font-bold text-black/50">{p.label}</span>
                       </div>
                       <ChevronRight size={14} className="opacity-10 group-hover:opacity-100 transition-opacity" />
                    </button>
                 ))}
              </div>
           </div>

           {/* 🍏 STICKY ACTION BUTTON */}
           <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#f5f5f7]/80 backdrop-blur-md border-t border-black/[0.04] z-30">
              <button 
                onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                className={`apple-btn-primary w-full h-[64px] text-[16px] font-bold shadow-2xl relative overflow-hidden flex items-center justify-center gap-3 ${
                    isGenerating || !code.trim() ? 'opacity-10 scale-[0.98]' : 'hover:scale-[1.02]'
                }`}
              >
                 {isGenerating ? <Loader2 size={24} className="animate-spin" /> : (
                   <>
                     <Zap size={18} fill="currentColor" />
                     Run Neural Sync
                     <span className="text-[10px] opacity-40 ml-2">⌘↵</span>
                   </>
                 )}
              </button>
           </div>
        </aside>

        {/* 🍏 PANEL B: THE ANALYTICAL CORE — ALIGNMENT FIXED */}
        <section className="flex-1 flex flex-col min-w-0 bg-white relative">
           <div className="h-[60px] border-b border-black/[0.04] flex items-center justify-start px-10 gap-8 overflow-x-auto no-scrollbar">
              {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`shrink-0 text-[10px] uppercase font-black tracking-[0.2em] transition-all relative py-2 ${
                      activeTab === tab ? 'text-black' : 'text-black/20 hover:text-black'
                  }`}
                >
                  {tab.replace('_', ' ')}
                  {activeTab === tab && <div className="absolute bottom-0 inset-x-0 h-[2px] bg-[#0071e3] rounded-full shadow-[0_0_10px_rgba(0,113,227,0.5)]" />}
                </button>
              ))}
           </div>
           
           <div className="flex-1 overflow-y-auto w-full custom-scrollbar selection:bg-[#0071e3]/10">
              <div className="max-w-full mx-auto p-12 md:p-24">
                 {!Object.values(results).some((v: any) => v?.length > 5) && !isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 lg:py-40 animate-apple-fade relative w-full max-w-[800px] mx-auto">
                       {/* Advanced Background Grid Elements */}
                       <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]" />
                       
                       <div className="relative mb-16 scale-[1.2]">
                          <div className="absolute inset-0 bg-[#0071e3]/5 rounded-[40px] blur-[40px] animate-pulse" />
                          <div className="absolute inset-0 bg-[#af52de]/5 rounded-[40px] blur-[60px] animate-pulse animation-delay-500" />
                          <div className="p-12 rounded-[40px] bg-white border border-black/[0.04] shadow-3xl relative z-10 flex flex-col items-center justify-center overflow-hidden group">
                             <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#0071e3] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                             
                             {/* Central Scanning Eye */}
                             <div className="w-24 h-24 rounded-full border-[2px] border-black/5 flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-2 border-[1px] border-black/10 rounded-full animate-spin-slow" />
                                <div className="absolute inset-4 border-[1px] border-dashed border-[#0071e3]/30 rounded-full animate-spin-reverse-slow" />
                                <Eye size={36} className="text-[#0071e3]" strokeWidth={1.5} />
                             </div>
                             
                             <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent mt-4 mb-4" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">AWAITING LOGIC STREAM</span>
                          </div>
                       </div>
                       
                       <div className="flex flex-col items-center z-10 bg-white/50 backdrop-blur-sm p-8 rounded-[32px] border border-black/5">
                          <h2 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-4 leading-none">Ready for Injection</h2>
                          <p className="text-[15px] text-[#1d1d1f]/40 max-w-[400px] font-medium leading-[1.6]">
                             Neural Manifest Extraction Mode v4.2 is prepared. Input source code logic to begin Stage 4 deep synthesis.
                          </p>
                          <div className="flex gap-4 mt-8">
                             <div className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f7] rounded-full text-[11px] font-bold text-black/50">
                                <Activity size={14} /> 0.4ms Latency
                             </div>
                             <div className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f7] rounded-full text-[11px] font-bold text-black/50">
                                <Shield size={14} /> AES-256 Lock
                             </div>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="animate-apple-fade w-full transition-all duration-700">
                       <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Initializing Neural Sync...' : '# Waiting for logic injection...')} />
                    </div>
                 )}
              </div>
           </div>
        </section>

        {/* 🍏 PANEL C: THE ARCHITECTURE HUD — SCROLLABLE FIXED */}
        <aside className="hidden lg:flex w-[340px] border-l border-black/[0.06] flex-col bg-white overflow-y-auto custom-scrollbar">
           <div className="h-[60px] border-b border-black/[0.04] flex items-center px-8 justify-between">
              <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Intelligence HUD</span>
              <Maximize2 size={14} className="text-black/10 hover:text-black cursor-pointer" />
           </div>
           <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
               
               {/* DIAGNOSTIC PULSE CARD */}
               <div className="p-10 bg-[#1d1d1f] rounded-[40px] text-white flex flex-col gap-8 shadow-3xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                     <Cpu size={180} strokeWidth={1} />
                  </div>
                  <div className="flex items-center justify-between w-full relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#32d74b] animate-pulse shadow-[0_0_12px_rgba(50,215,75,0.6)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Neural Core Active</span>
                     </div>
                  </div>
                  <div className="flex flex-col relative z-10">
                     <span className="text-[56px] font-bold tracking-tighter leading-none mb-1">9.8</span>
                     <span className="text-[11px] font-medium text-[#0071e3] uppercase tracking-[0.2em]">Logic Fidelity Rank</span>
                  </div>
                  <div className="h-[1px] w-full bg-white/10 relative z-10" />
                  <div className="flex flex-col gap-3 relative z-10">
                     <div className="flex items-center justify-between text-[11px] font-bold text-white/50">
                        <span>CPU Thread Load</span>
                        <span className="text-white">14%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#0071e3] to-[#af52de] w-[14%]" />
                     </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-2 relative z-10">
                     <span className="flex items-center gap-1.5"><Cpu size={12} /> Cluster-01</span>
                     <span className="flex items-center gap-1.5"><Clock size={12} /> 0.94ms</span>
                  </div>
               </div>

               {/* REAL-TIME OPERATIONS (NEW SECTION) */}
               <div className="flex flex-col gap-6">
                  <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Live Network Traffic</span>
                  <div className="bg-[#f5f5f7] border border-black/[0.04] p-6 rounded-[32px] flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#1d1d1f]">Inference Latency</span>
                        <span className="text-[13px] font-black text-[#0071e3]">~42ms</span>
                     </div>
                     <div className="h-[40px] flex items-end gap-1">
                        {[40, 25, 60, 30, 80, 50, 20, 90, 45, 65, 30, 50].map((h, i) => (
                           <div key={i} className="flex-1 bg-black/5 rounded-t-sm" style={{ height: '100%' }}>
                              <div className="bg-[#0071e3]/40 w-full rounded-t-sm transition-all duration-300" style={{ height: `${h}%` }} />
                           </div>
                        ))}
                     </div>
                     <div className="flex items-center gap-2 mt-2">
                        <Network size={12} className="text-black/30" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">TCP Port 443 Secured</span>
                     </div>
                  </div>
               </div>

               {/* RECENT SYNPASES LIST */}
               <div className="flex flex-col gap-6 flex-1">
                  <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Historical Nodes</span>
                  <div className="flex flex-col gap-3">
                     {[ { name: 'Core_Layout_v2.tsx', lang: 'TSX' }, { name: 'Neural_Bridge_Node.go', lang: 'GO' }, { name: 'api_router.py', lang: 'PY' } ].map((file, idx) => (
                       <div key={idx} className="flex items-center justify-between p-5 bg-white border border-black/[0.06] rounded-[24px] hover:shadow-lg transition-all group cursor-pointer hover:border-black/20">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-black/40 group-hover:text-[#0071e3] transition-colors relative">
                                <FileText size={16} strokeWidth={2} />
                                <div className="absolute -bottom-1 -right-1 bg-black text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-[4px]">{file.lang}</div>
                             </div>
                             <div className="flex flex-col">
                               <span className="text-[13px] font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">{file.name}</span>
                               <span className="text-[10px] font-medium text-black/40">{12 + idx * 4} min ago</span>
                             </div>
                          </div>
                          <ChevronRight size={14} className="text-black/10 group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                       </div>
                     ))}
                  </div>
               </div>
            </div>
        </aside>
      </main>

      {/* 🍏 HISTORY MODAL — ADVANCED FEATURE */}
      {showHistory && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-3xl animate-apple-fade p-10">
            <div className="w-full max-w-[800px] bg-white rounded-[60px] shadow-3xl overflow-hidden flex flex-col">
               <div className="p-12 border-b border-black/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-[28px] font-bold text-black tracking-tight">Sync History</h2>
                    <p className="text-[13px] font-medium text-black/30 mt-2">Access your last 50 neural manifestations.</p>
                  </div>
                  <button onClick={() => setShowHistory(false)} className="p-4 bg-black text-white rounded-full hover:scale-110 active:scale-95 transition-all"><Plus size={24} className="rotate-45" /></button>
               </div>
               <div className="flex-1 p-12 overflow-y-auto no-scrollbar space-y-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-8 bg-[#f5f5f7] rounded-[40px] group hover:bg-[#0071e3] transition-all cursor-pointer">
                       <div className="flex items-center gap-8">
                          <Cpu size={32} className="text-black/10 group-hover:text-white/40" />
                          <div>
                             <h4 className="text-[18px] font-bold text-black transition-colors group-hover:text-white">Neural Manifest #{24823 - i}</h4>
                             <span className="text-[12px] font-medium text-black/30 group-hover:text-white/40">Synthesized 2 hours ago • {1240+i} tokens</span>
                          </div>
                       </div>
                       <ChevronRight size={24} className="text-black/10 group-hover:text-white" />
                    </div>
                  ))}
               </div>
               <div className="p-10 bg-[#f5f5f7]/50 border-t border-black/5 flex items-center justify-center">
                  <button onClick={() => setShowHistory(false)} className="text-[13px] font-black text-black/20 uppercase tracking-widest hover:text-black">Dismiss Archive</button>
               </div>
            </div>
         </div>
      )}

      {/* 🍏 LOGIC STREAM FOOTER */}
      <footer className="h-[40px] border-t border-black/[0.06] flex items-center justify-between px-10 relative z-20 bg-white">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
               <span className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em]">System Protocols Stable</span>
            </div>
            <span className="text-[9px] font-medium text-black/20 uppercase tracking-[0.1em]">Edge Node: G-Lab-Cluster-01</span>
         </div>
         <div className="flex items-center gap-10 text-[9px] font-black text-black/20 uppercase tracking-[0.2em]">
            <span>Latency: 0.94ms</span>
            {[Command, Cpu, Globe, Binary].map((Icon, i) => <Icon key={i} size={11} strokeWidth={1.5} />)}
         </div>
      </footer>

      <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onload = x => setCode(x.target?.result as string); r.readAsText(f); } }} className="hidden" />
    </div>
  );
};

export default CodeGenerator;

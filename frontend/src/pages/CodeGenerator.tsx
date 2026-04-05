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
  History,
  Plus,
  Rocket,
  Upload,
  Clock,
  Eye as ViewIcon
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
  const [showHistory, setShowHistory] = useState(false);
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
                if (data.text) { fullText += data.text; extractMarkers(fullText); }
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

  const handleFormat = () => {
     if(!code.trim()) return;
     toast.success('LAB FORMATTING APPLIED');
     // Simulated formatting for visual richness
     setCode(prev => prev.trim());
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
    <div className="flex-1 flex flex-col h-[calc(100vh-48px)] bg-[#ffffff] relative overflow-hidden selection:bg-[#0071e3]/10 font-sans">
      
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
        
        {/* 🍏 PANEL A: THE LOGIC DOCK */}
        <aside className="w-[320px] flex flex-col border-r border-black/[0.06] bg-[#f5f5f7]/40 p-10 gap-10 shrink-0">
           
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

           <div className="flex-1 flex flex-col gap-4">
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

           <button 
             onClick={handleGenerate} disabled={isGenerating || !code.trim()}
             className={`apple-btn-primary w-full h-[72px] text-[18px] font-bold shadow-2xl relative overflow-hidden ${
                 isGenerating || !code.trim() ? 'opacity-10 scale-[0.98]' : 'hover:scale-[1.02]'
             }`}
           >
              {isGenerating ? <Loader2 size={24} className="animate-spin" /> : 'Run Neural Sync'}
           </button>
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
                 {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-40 animate-apple-fade">
                       <div className="p-16 rounded-full bg-[#f5f5f7] mb-12 relative scale-125">
                          <Eye size={48} className="text-black/5" strokeWidth={1} />
                       </div>
                       <h2 className="text-[20px] font-bold text-black tracking-tight mb-4 uppercase tracking-[0.2em]">Ready for Injection</h2>
                       <p className="text-[14px] text-black/20 max-w-[320px] font-medium leading-relaxed uppercase">Neural Manifest Extraction Mode v4.2</p>
                    </div>
                 ) : (
                    <div className="animate-apple-fade w-full transition-all duration-700">
                       <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Initializing Neural Sync...' : '# Waiting for logic injection...')} />
                    </div>
                 )}
              </div>
           </div>
        </section>

        {/* 🍏 PANEL C: THE ARCHITECTURE HUD */}
        <aside className="hidden lg:flex w-[340px] border-l border-black/[0.06] flex-col overflow-hidden bg-white">
           <div className="h-[60px] border-b border-black/[0.04] flex items-center px-8 justify-between">
              <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Intelligence HUD</span>
              <Maximize2 size={14} className="text-black/10 hover:text-black cursor-pointer" />
           </div>
           
           <div className="flex-1 p-8 flex flex-col gap-10 overflow-y-auto no-scrollbar">
              {/* DIAGNOSTIC PULSE CARD */}
              <div className="p-10 bg-black rounded-[48px] text-white flex flex-col gap-10 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Rocket size={100} strokeWidth={1} />
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-pulse shadow-[0_0_8px_rgba(52,199,89,1)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Engine v4.2</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[48px] font-bold tracking-tighter leading-none">9.8</span>
                    <span className="text-[11px] font-medium text-[#0071e3] mt-3 uppercase tracking-widest">Logic Fidelity Rank</span>
                 </div>
                 <div className="h-[1px] w-full bg-white/10" />
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                    <span className="flex items-center gap-2"><Cpu size={12} /> Cluster-01</span>
                    <span className="flex items-center gap-2"><Clock size={12} /> 0.94ms</span>
                 </div>
              </div>

              {/* RECENT SYNPASES LIST */}
              <div className="flex flex-col gap-8">
                 <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em]">Historical Nodes</span>
                 <div className="flex flex-col gap-4">
                    {[ 'Core_Layout_v2.tsx', 'Neural_Bridge_Node.go' ].map(file => (
                      <div key={file} className="flex items-center justify-between p-6 bg-[#f5f5f7] rounded-[28px] hover:bg-black transition-all group cursor-pointer border border-black/5">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-black/20 group-hover:text-black transition-all">
                               <FileText size={16} strokeWidth={1.5} />
                            </div>
                            <span className="text-[13px] font-bold text-black/40 group-hover:text-white/60 transition-all">{file}</span>
                         </div>
                         <ViewIcon size={16} className="text-black/10 group-hover:text-white" />
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
               <div className="w-1.5 h-1.5 rounded-full bg-[#34c759]" strokeWidth={1} />
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

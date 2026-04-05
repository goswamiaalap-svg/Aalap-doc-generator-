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
  Maximize2
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
  const [language, setLanguage] = useState('javascript');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🍏 FUTURISTIC REAL-TIME INSIGHTS (METRICS SYNC)
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
                const data = JSON.parse(line.slice(6).trim());
                if (data.text) {
                  fullText += data.text;
                  extractMarkers(fullText);
                }
             } catch (e) {}
          }
        }
      }
      toast.success('SYNTHESIS COMPLETE');
    } catch (err: any) {
      setErrorDetails(err.message);
      toast.error('RECALIBRATING BRIDGE');
    } finally {
      setIsGenerating(false);
    }
  };

  const extractMarkers = (text: string) => {
    const markers: Record<string, string> = {
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
    <div className="flex-1 flex flex-col p-8 lg:p-14 gap-10 animate-apple-fade relative z-10 h-[calc(100vh-48px)] bg-[#ffffff] no-scrollbar overflow-y-auto">
      
      {/* 🍏 FUTURISTIC STUDIO HEADER HUD */}
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-[18px] bg-black text-white flex items-center justify-center shadow-xl shadow-black/10 transition-transform hover:rotate-6">
               <Zap size={22} fill="white" strokeWidth={1} />
            </div>
            <div className="flex flex-col">
               <h1 className="text-[22px] font-bold text-[#1d1d1f] tracking-tight leading-none">Neural Studio <span className="text-black/10">v2.4</span></h1>
               <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-[8px] bg-[#34c759]/5 border border-[#34c759]/10 text-[9px] font-black text-[#34c759] uppercase tracking-widest">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
                     Live Bridge
                  </div>
                  <span className="text-[10px] font-bold text-black/20 uppercase tracking-[0.16em]">Architectural Manifest Laboratory</span>
               </div>
            </div>
         </div>
         <div className="hidden xl:flex items-center gap-10">
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-black/15 uppercase tracking-widest mb-1">Decryption Speed</span>
               <span className="text-[16px] font-bold text-black group hover:text-[#0071e3] transition-colors tracking-tight">0.94 <span className="text-[11px] opacity-20">MB/s</span></span>
            </div>
            <div className="h-10 w-[1px] bg-black/[0.04]" />
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-black/15 uppercase tracking-widest mb-1">Density Index</span>
               <span className="text-[16px] font-bold text-black tracking-tight">{tokenCount.toLocaleString()} <span className="text-[11px] opacity-20">TOKENS</span></span>
            </div>
         </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-12 items-stretch h-full overflow-hidden">
        
        {/* 🍏 FUTURISTIC INPUT BUFFER (LAB HUD) */}
        <div className="xl:w-[40%] flex flex-col min-h-0 bg-[#f5f5f7]/60 border border-black/[0.04] p-10 rounded-[48px] relative group hover:bg-white hover:shadow-2xl hover:border-black/5 transition-all duration-700">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <Terminal size={18} className="text-black/30 group-hover:text-[#0071e3] transition-colors" />
                 <span className="text-[12px] font-black text-black/25 uppercase tracking-widest">Source Buffer Injection</span>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setCode('')} className="p-2 text-black/10 hover:text-[#ff3b30] transition-colors"><Trash2 size={16} /></button>
                 <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="bg-white border border-black/[0.08] shadow-sm rounded-xl px-4 py-2.5 text-[14px] text-[#1d1d1f] font-bold outline-none cursor-pointer hover:border-black/20 transition-all"
                 >
                    {[ 'javascript', 'typescript', 'python', 'rust', 'cpp', 'java', 'go', 'swift', 'php' ].map(l => (
                        <option key={l} value={l}>{l.toUpperCase()}</option>
                    ))}
                 </select>
              </div>
           </div>

           <div className="flex-1 bg-white border border-black/[0.03] rounded-[32px] relative shadow-lg shadow-black/[0.01] p-1">
              <textarea 
                value={code} onChange={e => setCode(e.target.value)}
                placeholder="// Initialize source logic for neural synthesis..."
                className="w-full h-full bg-transparent p-10 font-mono text-[15px] text-[#1d1d1f]/75 resize-none outline-none placeholder:text-black/5 custom-scrollbar leading-[1.7]"
              />
              <div className="absolute top-5 right-5 opacity-5 group-hover:opacity-20 transition-opacity">
                 <div className="w-1.5 h-1.5 rounded-full bg-black mb-2" />
                 <div className="w-1.5 h-1.5 rounded-full bg-black mb-2" />
                 <div className="w-1.5 h-1.5 rounded-full bg-black" />
              </div>
           </div>
           
           <div className="flex justify-between items-center mt-10">
              <div className="flex items-center gap-6">
                 <button onClick={() => fileInputRef.current?.click()} className="text-[13px] font-bold text-black/30 hover:text-black transition-colors flex items-center gap-2 group-btn">
                    <FileText size={16} strokeWidth={1.2} />
                    Load Local
                 </button>
              </div>
              <button 
                onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                className={`apple-btn-primary px-12 h-[64px] text-[17px] font-bold shadow-[0_20px_40px_-10px_rgba(0,113,227,0.3)] transition-all ${
                    isGenerating || !code.trim() ? 'opacity-10 cursor-not-allowed scale-[0.98]' : 'opacity-100 hover:scale-105 active:scale-95'
                }`}
              >
                 {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={18} fill="white" strokeWidth={1} />}
                 {isGenerating ? 'Synthesizing...' : 'Run Pro Sync'}
              </button>
           </div>
        </div>

        {/* 🍎 FUTURISTIC OUTPUT HUD — 100% RELIABILITY NEURAL BUFFER */}
        <div className="xl:w-[60%] flex flex-col min-h-0 bg-[#ffffff] border border-black/[0.08] p-10 rounded-[48px] shadow-2xl shadow-black/[0.03] overflow-hidden relative">
           
           {/* 🍏 SIMULATED LAB DECORATION */}
           <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-black/[0.02] rounded-bl-full -z-10" />

           {errorDetails ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 animate-apple-slide">
                 <div className="p-10 rounded-[40px] bg-black text-white mb-10 shadow-2xl shadow-black/20">
                    <AlertTriangle size={56} strokeWidth={1.2} className="text-[#f5a623]" />
                 </div>
                 <h2 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-4 leading-none">Bridge Recalibration Needed</h2>
                 <p className="text-[17px] text-black/35 max-w-[360px] font-medium leading-relaxed mb-12">
                   Your sync was interrupted by an external gateway bottleneck. Initializing failover protocols...
                 </p>
                 <button onClick={handleGenerate} className="flex items-center gap-4 px-10 py-5 bg-[#0071e3] text-white rounded-3xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#0071e3]/20">
                    <RefreshCw size={20} />
                    <span>Run Neural Re-Sync</span>
                 </button>
              </div>
           ) : (
             <>
               <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar pb-2">
                  <div className="flex items-center gap-4 no-scrollbar pr-10">
                    {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                      <button 
                        key={tab} onClick={() => setActiveTab(tab)}
                        className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] uppercase font-bold tracking-[0.16em] transition-all ${
                            activeTab === tab 
                            ? 'bg-black text-white shadow-xl shadow-black/20' 
                            : 'text-black/30 hover:text-black hover:bg-black/[0.03]'
                        }`}
                      >
                        {tab.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4 shrink-0 px-4">
                     {[Share2, Download, Maximize2].map((Icon, i) => (
                        <button key={i} className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/[0.03] text-black/20 hover:text-black transition-colors">
                           <Icon size={16} strokeWidth={1.5} />
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                  {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                     <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="p-10 rounded-full bg-[#f5f5f7] mb-10 relative">
                           <div className="absolute inset-0 border-2 border-dashed border-black/5 rounded-full animate-[spin_20s_linear_infinite]" />
                           <Activity size={40} className="text-black/10" strokeWidth={1.2} />
                        </div>
                        <h2 className="text-[22px] font-bold text-[#1d1d1f] tracking-tight uppercase mb-4">Neural Buffer Ready</h2>
                        <p className="text-[15px] text-black/30 max-w-[340px] font-medium leading-relaxed uppercase tracking-widest">
                           STAGE 4 ARCHITECTURAL SCAN ACTIVE
                        </p>
                     </div>
                  ) : (
                    <div className="h-full">
                      {activeTab === 'QUALITY' ? (
                         <div className="flex flex-col items-center justify-center h-full gap-24 py-10 font-sans">
                            <div className="relative group">
                               <div className="absolute inset-0 border-2 border-black/5 rounded-full animate-ping opacity-10" />
                               <svg width="280" height="280" viewBox="0 0 150 150" className="transform -rotate-90">
                                  <circle cx="75" cy="75" r="68" stroke="rgba(0,0,0,0.02)" strokeWidth="4" fill="transparent" />
                                  <circle 
                                    cx="75" cy="75" r="68" 
                                    stroke="#1d1d1f" 
                                    strokeWidth="4" 
                                    fill="transparent" 
                                    strokeDasharray={427} 
                                    strokeDashoffset={427 - (427 * score * 10) / 100} 
                                    strokeLinecap="round" 
                                    className="transition-all duration-[2500ms] ease-[cubic-bezier(0.1,1,0.2,1)]" 
                                  />
                               </svg>
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex flex-col items-center">
                                     <span className="text-[88px] font-bold text-[#1d1d1f] tracking-[-0.05em] leading-none">{score}</span>
                                     <span className="text-[13px] font-black text-[#0071e3] uppercase tracking-[0.2em] mt-8">Logical Density</span>
                                  </div>
                               </div>
                            </div>
                            <div className="w-full max-w-[480px] grid grid-cols-2 gap-12 text-left">
                               {[
                                  { label: 'Latency Bridge', val: 9.842, suffix: 'ms', icon: <Zap size={14} className="text-[#0071e3]" /> },
                                  { label: 'Neural Integrity', val: 99.14, suffix: '%', icon: <Shield size={14} className="text-[#32d74b]" /> },
                                  { label: 'Logical Drift', val: 0.42, suffix: 'pts', icon: <Activity size={14} className="text-[#ff375f]" /> },
                                  { label: 'Architecture Scan', val: score * 10, suffix: '%', icon: <Layers size={14} className="text-[#af52de]" /> }
                               ].map((stat) => (
                                 <div key={stat.label} className="border-l border-black/[0.08] pl-8 group">
                                    <div className="flex items-center gap-3 mb-2">
                                       {stat.icon}
                                       <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <p className="text-[28px] font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors tracking-tighter">{stat.val}{stat.suffix}</p>
                                 </div>
                               ))}
                            </div>
                         </div>
                      ) : (
                         <div className="prose prose-stone max-w-none 
                             text-[18px] text-[#1d1d1f]/75 leading-[1.8] font-medium
                             prose-headings:text-[#1d1d1f] prose-headings:font-bold prose-headings:tracking-tighter
                             prose-h2:text-[28px] prose-h2:mt-14 prose-h2:mb-10 border-b border-black/[0.06] pb-6
                             prose-pre:bg-[#f5f5f7] prose-pre:border-none prose-pre:rounded-[36px] prose-pre:p-14 shadow-inner
                         ">
                            <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Initializing high-density synthesis...' : '# Waiting for logical injection...')} />
                         </div>
                      )}
                    </div>
                  )}
               </div>
             </>
           )}
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onload = x => setCode(x.target?.result as string); r.readAsText(f); } }} className="hidden" />
    </div>
  );
};

export default CodeGenerator;

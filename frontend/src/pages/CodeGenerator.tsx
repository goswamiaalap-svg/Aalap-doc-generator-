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
  Save
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
    <div className="flex-1 flex gap-8 p-10 lg:p-14 animate-apple-fade relative z-10 h-[calc(100vh-48px)] bg-[#ffffff] no-scrollbar overflow-x-hidden overflow-y-auto">
      
      {/* 🍏 SYSTEMATIC TECHNICAL DOCK — THE OS SIDEBAR */}
      <aside className="hidden lg:flex w-[80px] flex-col items-center py-10 bg-[#f5f5f7]/60 border border-black/[0.04] rounded-[48px] gap-12 sticky top-0 self-start">
         <div className="space-y-12">
            {[Zap, Terminal, Binary, Shield, Command].map((Icon, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group group-btn">
                <div className={`p-4 rounded-[18px] transition-all bg-white shadow-sm group-hover:scale-110 ${i === 1 ? 'text-[#0071e3] shadow-xl' : 'text-black/15'}`}>
                   <Icon size={20} strokeWidth={1.5} />
                </div>
              </div>
            ))}
         </div>
         <div className="flex-1 border-l border-black/[0.04]" />
         <button className="p-4 rounded-full bg-black text-white hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/10">
            <Pulse size={20} />
         </button>
      </aside>

      <div className="flex-1 flex flex-col gap-10">
        
        {/* 🍏 SYSTEMATIC STUDIO HEADER — NEURAL HUD */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
           <div className="flex items-center gap-8">
              <div className="flex flex-col">
                 <h1 className="text-[24px] font-bold text-[#1d1d1f] tracking-tighter">Neural Studio <span className="opacity-10">PRO</span></h1>
                 <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">v2.4 Technical Lab OS Active</span>
                    <div className="flex items-center gap-2 group cursor-pointer">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#34c759] group-hover:animate-ping" />
                       <span className="text-[10px] font-bold text-[#34c759] uppercase tracking-widest">Logic Bridge Synchronized</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-10">
              <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black text-black/15 uppercase tracking-[0.2em] mb-1">Architecture Depth</span>
                 <div className="flex items-center gap-2">
                    <div className="h-1 w-12 bg-black/[0.04] rounded-full overflow-hidden">
                       <div className="h-full bg-[#0071e3]" style={{ width: `${Math.min(100, tokenCount/10)}%` }} />
                    </div>
                    <span className="text-[13px] font-bold text-black/40">{tokenCount} <span className="text-[10px] opacity-20">TOKENS</span></span>
                 </div>
              </div>
              <button className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.03] text-black/20 hover:text-black transition-all">
                 <Save size={18} strokeWidth={1.5} />
              </button>
           </div>
        </div>

        <div className="flex-1 flex flex-col xl:flex-row gap-12 items-stretch min-h-0 overflow-hidden pb-10">
          
          {/* 🍏 SOURCE BUFFER — THE INJECTION HUD */}
          <div className="xl:w-[42%] flex flex-col min-h-0 bg-[#f5f5f7]/60 border border-black/[0.02] p-8 rounded-[48px] animate-apple-slide">
             <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                   <span className="text-[12px] font-black text-black/25 uppercase tracking-widest">Logic Injection Core</span>
                </div>
                <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="bg-white border border-black/[0.08] shadow-sm rounded-xl px-4 py-2.5 text-[14px] text-[#1d1d1f] font-bold outline-none cursor-pointer"
                >
                    {[ 'javascript', 'typescript', 'python', 'rust', 'cpp', 'java', 'go', 'swift', 'php' ].map(l => (
                        <option key={l} value={l}>{l.toUpperCase()}</option>
                    ))}
                </select>
             </div>

             <div className="flex-1 bg-white border border-black/[0.04] rounded-[36px] relative shadow-lg shadow-black/[0.01] p-1 mb-8">
                <textarea 
                  value={code} onChange={e => setCode(e.target.value)}
                  placeholder="// Synchronize architectural source for neural synthesis..."
                  className="w-full h-full bg-transparent p-10 font-mono text-[15px] text-[#1d1d1f]/75 resize-none outline-none placeholder:text-black/5 custom-scrollbar leading-[1.8]"
                />
             </div>
             
             <div className="flex justify-between items-center px-2">
                <button onClick={() => fileInputRef.current?.click()} className="text-[13px] font-bold text-black/30 hover:text-black flex items-center gap-3 uppercase tracking-widest">
                   <FileText size={18} strokeWidth={1.2} />
                   Load Node
                </button>
                <button 
                  onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                  className={`apple-btn-primary px-12 h-[68px] text-[18px] font-bold shadow-2xl transition-all ${
                      isGenerating || !code.trim() ? 'opacity-10 cursor-not-allowed scale-[0.98]' : 'opacity-100'
                  }`}
                >
                   {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={20} fill="white" />}
                   <span className="ml-4">{isGenerating ? 'Synthesizing...' : 'Run Neural Sync'}</span>
                </button>
             </div>
          </div>

          {/* 🍎 ANALYTICAL TERMINAL — THE MANIFEST HUB */}
          <div className="xl:w-[58%] flex flex-col min-h-0 bg-[#ffffff] border border-black/[0.08] p-10 rounded-[48px] shadow-2xl shadow-black/[0.04] overflow-hidden group">
             
             <div className="flex items-center justify-between mb-10 overflow-x-auto no-scrollbar pb-2">
                <div className="flex items-center gap-4">
                  {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                    <button 
                      key={tab} onClick={() => setActiveTab(tab)}
                      className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] uppercase font-bold tracking-[0.2em] transition-all ${
                          activeTab === tab 
                          ? 'bg-black text-white shadow-2xl' 
                          : 'text-black/30 hover:text-black'
                      }`}
                    >
                      {tab.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 shrink-0 px-6">
                   {[Share2, Download, Maximize2].map((Icon, i) => (
                      <button key={i} className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/[0.03] text-black/15 hover:text-black">
                         <Icon size={16} strokeWidth={1.5} />
                      </button>
                   ))}
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                   <div className="h-full flex flex-col items-center justify-center text-center p-10">
                      <div className="p-12 rounded-[40px] bg-[#f5f5f7] mb-12 relative animate-apple-fade">
                         <div className="absolute inset-0 border-[3px] border-dashed border-black/5 rounded-[40px] animate-[spin_30s_linear_infinite]" />
                         <Cpu size={48} className="text-black/10" strokeWidth={1} />
                      </div>
                      <h2 className="text-[20px] font-bold text-black tracking-tight mb-4 uppercase tracking-[0.14em]">Buffer Empty</h2>
                      <p className="text-[14px] text-black/30 max-w-[320px] font-medium leading-relaxed">Stage 4 Decryption Engine Idle. Inject source code to generate systematic architectural blueprints.</p>
                   </div>
                ) : (
                  <div className="h-full animate-apple-fade">
                    {activeTab === 'QUALITY' ? (
                       <div className="flex flex-col items-center justify-center h-full gap-20 py-10">
                          <div className="relative group">
                             <div className="absolute inset-0 border-2 border-[#0071e3]/10 rounded-full animate-ping opacity-10" />
                             <svg width="260" height="260" viewBox="0 0 150 150" className="transform -rotate-90">
                                <circle cx="75" cy="75" r="68" stroke="rgba(0,0,0,0.02)" strokeWidth="4" fill="transparent" />
                                <circle 
                                  cx="75" cy="75" r="68" 
                                  stroke="#0071e3" 
                                  strokeWidth="4" 
                                  fill="transparent" 
                                  strokeDasharray={427} 
                                  strokeDashoffset={427 - (427 * score * 10) / 100} 
                                  strokeLinecap="round" 
                                  className="transition-all duration-[2000ms]" 
                                />
                             </svg>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                   <span className="text-[88px] font-bold text-[#1d1d1f] tracking-[-0.05em] leading-none">{score}</span>
                                   <span className="text-[12px] font-black text-[#0071e3] uppercase tracking-[0.2em] mt-8">Neural Score</span>
                                </div>
                             </div>
                          </div>
                          <div className="w-full max-w-[480px] grid grid-cols-2 gap-12 text-left">
                             {[
                                { label: 'Latency Bridge', val: 9.8, suffix: 'ms', icon: <Zap size={14} className="text-[#0071e3]" /> },
                                { label: 'Structural Logic', val: 99.1, suffix: '%', icon: <Pulse size={14} className="text-[#32d74b]" /> },
                                { label: 'Entropy Rank', val: 0.4, suffix: 'pts', icon: <Activity size={14} className="text-[#ff375f]" /> },
                                { label: 'Architecture Scan', val: score * 10, suffix: '%', icon: <Layers size={14} className="text-[#af52de]" /> }
                             ].map((stat) => (
                               <div key={stat.label} className="border-l border-black/[0.08] pl-8">
                                  <div className="flex items-center gap-3 mb-2">
                                     {stat.icon}
                                     <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">{stat.label}</span>
                                  </div>
                                  <p className="text-[28px] font-bold text-[#1d1d1f] tracking-tighter">{stat.val}{stat.suffix}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                    ) : (
                       <div className="prose prose-stone max-w-none 
                           text-[18px] text-[#1d1d1f]/75 leading-[1.8] font-medium
                           prose-headings:text-[#1d1d1f] prose-headings:font-bold prose-headings:tracking-tighter
                           prose-h2:text-[34px] prose-h2:mt-16 prose-h2:mb-8 border-b border-black/[0.06] pb-6
                           prose-pre:bg-[#f5f5f7] prose-pre:border-none prose-pre:rounded-[36px] prose-pre:p-14 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]
                       ">
                          <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Initializing high-density synthesis...' : '# Waiting for logical injection...')} />
                       </div>
                    )}
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onload = x => setCode(x.target?.result as string); r.readAsText(f); } }} className="hidden" />
    </div>
  );
};

export default CodeGenerator;

import React, { useState, useRef } from 'react';
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
  FileText
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      if (!response.ok) throw new Error('Generation failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
             const dataStr = line.slice(6).trim();
             if (dataStr === '[DONE]') break;
             try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  fullText += data.text;
                  extractMarkers(fullText);
                }
             } catch (e) {}
          }
        }
      }
      toast.success('DECODING COMPLETE');
    } catch (err: any) {
      toast.error('SYNC INTERRUPT');
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
    <div className="flex-1 flex flex-col p-10 lg:p-20 gap-16 animate-apple-fade relative z-10 h-[calc(100vh-48px)] bg-[#ffffff] selection:bg-blue-500/10 no-scrollbar overflow-y-auto">
      
      {/* 🍏 APPLE STUDIO PRO HEADER */}
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg shadow-black/10">
               <Zap size={18} fill="white" strokeWidth={1} />
            </div>
            <div className="flex flex-col">
               <h1 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight leading-none">Neural Studio Pro</h1>
               <span className="text-[12px] font-semibold text-black/25 uppercase tracking-widest mt-2">v2.4 High-Performance Tier</span>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-[#f5f5f7] border border-black/[0.04] rounded-full text-[12px] font-bold text-black/45">
               <Command size={14} />
               <span>CMD + S to Synchronize</span>
            </div>
         </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-16 items-stretch h-full overflow-hidden">
        
        {/* 🍏 INPUT PANEL — APPLE PRO PRECISION */}
        <div className="xl:w-[42%] flex flex-col min-h-0 bg-[#f5f5f7] border border-black/[0.04] p-10 rounded-[32px]">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <FileText size={18} className="text-black/30" />
                 <span className="text-[14px] font-bold text-black/35 uppercase tracking-widest">Logic Terminal</span>
              </div>
              <select 
                  value={language} onChange={e => setLanguage(e.target.value)}
                  className="bg-white border border-black/[0.08] shadow-sm rounded-xl px-4 py-2.5 text-[14px] text-[#1d1d1f] transition-all font-bold outline-none cursor-pointer"
              >
                  {[ 'javascript', 'typescript', 'python', 'rust', 'cpp', 'java', 'go', 'swift', 'php' ].map(l => (
                      <option key={l} value={l}>{l.toUpperCase()}</option>
                  ))}
              </select>
           </div>

           <div className="flex-1 bg-white border border-black/[0.06] rounded-[24px] relative shadow-sm p-1">
              <textarea 
                value={code} onChange={e => setCode(e.target.value)}
                placeholder="Synchronize source logic..."
                className="w-full h-full bg-transparent p-7 font-['SF_Mono','JetBrains_Mono'] text-[15px] text-[#1d1d1f]/80 resize-none outline-none placeholder:text-black/5 custom-scrollbar leading-[1.6] transition-opacity"
              />
           </div>
           
           <div className="flex justify-between items-center mt-10">
              <div className="flex items-center gap-4">
                 <button onClick={() => fileInputRef.current?.click()} className="apple-btn-secondary text-[14px] font-semibold text-black/55 hover:text-black">
                    Fetch Local
                 </button>
                 <button onClick={() => setCode('')} className="p-2 text-black/15 hover:text-[#ff3b30] transition-colors">
                    <Trash2 size={18} strokeWidth={1.5} />
                 </button>
              </div>
              <button 
                onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                className={`apple-btn-primary px-10 h-[56px] text-[16px] font-bold shadow-xl shadow-[#0071e3]/20 ${
                    isGenerating || !code.trim() ? 'opacity-10 cursor-not-allowed' : 'opacity-100 hover:scale-[1.02] active:scale-98'
                }`}
              >
                 {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} fill="white" strokeWidth={1} />}
                 {isGenerating ? 'Synthesizing...' : 'Run Pro Sync'}
              </button>
           </div>
        </div>

        {/* 🍎 OUTPUT PANEL — APPLE PRO OUTPUT (FORCED HIGH CONTRAST) */}
        <div className="xl:w-[58%] flex flex-col min-h-0 bg-[#ffffff] border border-black/[0.08] p-10 rounded-[32px] shadow-2xl shadow-black/[0.03] overflow-hidden">
           <div className="flex items-center gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
              {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-5 py-3 rounded-xl text-[12px] uppercase font-bold tracking-[0.14em] transition-all shadow-sm ${
                      activeTab === tab 
                      ? 'bg-black text-white' 
                      : 'bg-black/[0.03] text-black/40 hover:text-black hover:bg-black/[0.05]'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
           </div>

           <div className="flex-1 bg-white p-2 overflow-y-auto custom-scrollbar">
              {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                 <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="p-8 rounded-full bg-[#f5f5f7] mb-8">
                       <Cpu size={36} className="text-black/10" strokeWidth={1.2} />
                    </div>
                    <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight uppercase mb-4">Neural Buffer Ready</h2>
                    <p className="text-[14px] text-black/35 max-w-[320px] font-medium leading-relaxed">
                       DocGen Pro utilizes high-density synthesis pipelines. Inject source code to analyze architectural depth.
                    </p>
                 </div>
              ) : (
                <div className="h-full">
                  {activeTab === 'QUALITY' ? (
                     <div className="flex flex-col items-center justify-center h-full gap-24 py-10 font-sans">
                        <div className="relative group">
                           <svg width="240" height="240" viewBox="0 0 150 150" className="transform -rotate-90">
                              <circle cx="75" cy="75" r="68" stroke="rgba(0,0,0,0.03)" strokeWidth="4" fill="transparent" />
                              <circle 
                                cx="75" cy="75" r="68" 
                                stroke="#0071e3" 
                                strokeWidth="4" 
                                fill="transparent" 
                                strokeDasharray={427} 
                                strokeDashoffset={427 - (427 * score * 10) / 100} 
                                strokeLinecap="round" 
                                className="transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]" 
                              />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex flex-col items-center">
                                 <span className="text-[72px] font-bold text-[#1d1d1f] tracking-[-0.05em] leading-none">{score}</span>
                                 <span className="text-[12px] font-bold text-[#0071e3] uppercase tracking-[0.18em] mt-6">Pro Score</span>
                              </div>
                           </div>
                        </div>
                        <div className="w-full max-w-[420px] grid grid-cols-2 gap-12">
                           {[
                              { label: 'Latency', val: 9.8, suffix: 'ms', icon: <Zap size={14} className="text-[#0071e3]" /> },
                              { label: 'Integrity', val: 99.1, suffix: '%', icon: <Shield size={14} className="text-[#34c759]" /> },
                              { label: 'Stability', val: 0.4, suffix: 'pts', icon: <Activity size={14} className="text-[#f5a623]" /> },
                              { label: 'Coverage', val: score * 10, suffix: '%', icon: <Layers size={14} className="text-[#a78bfa]" /> }
                           ].map((stat) => (
                             <div key={stat.label} className="flex flex-col gap-3 border-l border-black/[0.06] pl-6 group">
                                <div className="flex items-center gap-2">
                                   {stat.icon}
                                   <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/25">{stat.label}</span>
                                </div>
                                <span className="text-[24px] font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">{stat.val}{stat.suffix}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="prose prose-stone max-w-none 
                         text-[18px] text-[#1d1d1f]/75 leading-[1.8] font-medium
                         prose-headings:text-[#1d1d1f] prose-headings:font-bold prose-headings:tracking-tighter
                         prose-h2:text-[26px] prose-h2:mt-14 prose-h2:mb-8 border-b border-black/[0.06] pb-4
                         prose-a:text-[#0071e3] prose-a:underline hover:text-black
                         prose-strong:text-black
                         prose-pre:bg-[#f5f5f7] prose-pre:border-none prose-pre:rounded-3xl prose-pre:p-10 shadow-sm
                         prose-code:text-black prose-code:font-mono
                     ">
                        <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Recalibrating neural manifest...' : '# Waiting for logical source...')} />
                     </div>
                  )}
                </div>
              )}
           </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onload = x => setCode(x.target?.result as string); r.readAsText(f); } }} className="hidden" />
    </div>
  );
};

export default CodeGenerator;

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
        // PARSE SSE DATA: data: {"text": "..."}\n\n
        const lines = chunkText.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
             const dataStr = line.slice(6).trim();
             if (dataStr === '[DONE]') break;
             try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  fullText += data.text;
                  // REAL-TIME EXTRACTION OF MARKERS
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
    <div className="flex-1 flex flex-col p-8 lg:p-12 gap-10 animate-apple-in relative z-10 h-[calc(100vh-40px)] bg-[#ffffff] selection:bg-blue-500/10 no-scrollbar overflow-y-auto">
      
      {/* 🍏 PRO TOP BAR */}
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
               <Zap size={14} fill="white" />
            </span>
            <div className="flex flex-col">
               <h1 className="text-[17px] font-bold text-[#1d1d1f] tracking-tight">Neural Studio <span className="text-black/20 ml-1">Pro</span></h1>
               <span className="text-[10px] font-bold text-black/30 uppercase tracking-[0.1em]">Code Analysis & Documentation Synthesis</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f7] border border-black/5 rounded-full text-[11px] font-bold text-black/50">
               <Command size={12} />
               <span>CMD + S to Sync</span>
            </div>
            <div className="h-6 w-[1px] bg-black/5" />
            <button className="flex items-center gap-2 text-[12px] font-bold text-black/30 hover:text-black transition-colors">
               <Share2 size={14} />
               <span>Share Result</span>
            </button>
         </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-stretch h-full overflow-hidden">
        
        {/* 🍏 INPUT PANEL — PRO REFINEMENT */}
        <div className="xl:w-[40%] flex flex-col min-h-0 bg-[#f5f5f7]/50 border border-black/[0.04] p-8 rounded-[2rem]">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                 <FileText size={16} className="text-black/30" />
                 <span className="text-[13px] font-bold text-black/40 uppercase tracking-[0.05em]">Source Injection Buffer</span>
              </div>
              <select 
                  value={language} onChange={e => setLanguage(e.target.value)}
                  className="bg-white border border-black/[0.06] shadow-sm rounded-lg px-3 py-1.5 text-[12px] text-[#1d1d1f] hover:border-black/20 transition-all font-bold outline-none"
              >
                  {[ 'javascript', 'typescript', 'python', 'rust', 'cpp', 'java', 'go', 'swift', 'php' ].map(l => (
                      <option key={l} value={l}>{l.toUpperCase()}</option>
                  ))}
              </select>
           </div>

           <div className="flex-1 bg-white border border-black/[0.03] rounded-[1.5rem] relative shadow-sm p-1">
              <textarea 
                value={code} onChange={e => setCode(e.target.value)}
                placeholder="Synchronize logical source..."
                className="w-full h-full bg-transparent p-6 font-['JetBrains_Mono'] text-[13.5px] text-black/70 resize-none outline-none placeholder:text-black/5 custom-scrollbar leading-[1.6]"
              />
           </div>
           
           <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-3">
                 <button onClick={() => fileInputRef.current?.click()} className="apple-btn-outline px-5 py-2 text-[12px] border-black/5 text-black/40 hover:text-black hover:border-black/20">
                    Load Local
                 </button>
                 <button onClick={() => setCode('')} className="p-2 text-black/15 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                 </button>
              </div>
              <button 
                onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                className={`apple-btn-black px-8 h-[48px] text-[14px] flex items-center justify-center gap-2 ${
                    isGenerating || !code.trim() ? 'opacity-10 cursor-not-allowed' : 'opacity-100 hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/10'
                }`}
              >
                 {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} fill="white" />}
                 {isGenerating ? 'Synthesizing...' : 'Start Pro Sync'}
              </button>
           </div>
        </div>

        {/* 🍎 OUTPUT PANEL — PRO VISIBILITY */}
        <div className="xl:w-[60%] flex flex-col min-h-0 bg-[#ffffff] border border-black/[0.06] p-8 rounded-[2rem] shadow-2xl shadow-black/[0.03] overflow-hidden">
           <div className="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
              {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-[10.5px] uppercase font-bold tracking-[0.08em] transition-all ${
                      activeTab === tab 
                      ? 'bg-black text-white' 
                      : 'text-black/30 hover:text-black hover:bg-black/[0.03]'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
           </div>

           <div className="flex-1 bg-white p-2 overflow-y-auto custom-scrollbar">
              {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                 <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="p-5 rounded-full bg-[#f5f5f7] mb-6">
                       <Cpu size={32} className="text-black/10" />
                    </div>
                    <h2 className="text-[17px] font-bold text-[#1d1d1f] tracking-tight uppercase mb-3">Neural Forge Ready</h2>
                    <p className="text-[12px] text-black/30 max-w-[280px] font-medium leading-relaxed">
                       DocGen Pro utilizes Groq-powered synthesis for sub-second analysis. Inject source code to begin generation.
                    </p>
                 </div>
              ) : (
                <div className="h-full">
                  {activeTab === 'QUALITY' ? (
                     <div className="flex flex-col items-center justify-center h-full gap-16 py-8 font-sans">
                        <div className="relative">
                           <svg width="200" height="200" viewBox="0 0 150 150" className="transform -rotate-90">
                              <circle cx="75" cy="75" r="68" stroke="rgba(0,0,0,0.02)" strokeWidth="3" fill="transparent" />
                              <circle 
                                cx="75" cy="75" r="68" 
                                stroke="#1d1d1f" 
                                strokeWidth="3" 
                                fill="transparent" 
                                strokeDasharray={427} 
                                strokeDashoffset={427 - (427 * score * 10) / 100} 
                                strokeLinecap="round" 
                                className="transition-all duration-[2000ms] ease-out" 
                              />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex flex-col items-center">
                                 <span className="text-[64px] font-bold text-[#1d1d1f] tracking-[-0.05em] leading-none">{score}</span>
                                 <span className="text-[11px] font-bold text-black/15 uppercase tracking-[0.15em] mt-5">Pro Tier Score</span>
                              </div>
                           </div>
                        </div>
                        <div className="w-full max-w-[400px] grid grid-cols-2 gap-10">
                           {[
                              { label: 'Latency', val: 9.8, suffix: 'ms' },
                              { label: 'Stability', val: 99.1, suffix: '%' },
                              { label: 'Refactor', val: 0.4, suffix: 'pts' },
                              { label: 'Coverage', val: score * 10, suffix: '%' }
                           ].map((stat) => (
                             <div key={stat.label} className="flex flex-col gap-1.5 border-l border-black/5 pl-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/20">{stat.label}</span>
                                <span className="text-[18px] font-bold text-black">{stat.val}{stat.suffix}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="prose prose-stone max-w-none 
                         text-[16px] text-[#1d1d1f]/70 leading-[1.8] font-medium
                         prose-headings:text-[#1d1d1f] prose-headings:font-bold prose-headings:tracking-tighter
                         prose-h2:text-[22px] prose-h2:mt-10 prose-h2:mb-4
                         prose-a:text-blue-600 prose-a:underline hover:text-black
                         prose-code:text-black prose-code:font-['JetBrains_Mono']
                         prose-pre:bg-[#f5f5f7] prose-pre:border-none prose-pre:rounded-2xl prose-pre:p-8
                     ">
                        <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Initializing neural analysis engine...' : '# Build logic manifest...')} />
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

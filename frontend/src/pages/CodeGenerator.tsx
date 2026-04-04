import React, { useState, useRef } from 'react';
import { 
  Zap,
  Loader2,
  Cpu,
  Share2,
  Trash2,
  Download,
  Info
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

  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      toast.success(`DATA INJECTED: ${file.name}`);
    };
    reader.readAsText(file);
  };

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
      let accumulated = '';

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        
        try {
          const parsed = JSON.parse(accumulated);
          setResults(prev => ({ ...prev, ...parsed }));
          accumulated = '';
        } catch (e) {}
      }
      toast.success('DECODING COMPLETE');
    } catch (err: any) {
      toast.error('SYNC INTERRUPT');
    } finally {
      setIsGenerating(false);
    }
  };

  const score = results.QUALITY ? parseInt(results.QUALITY) : 0;

  return (
    <div className="flex-1 flex flex-col p-10 lg:p-14 gap-12 animate-apple-in relative z-10 h-[calc(100vh-40px)] bg-[#ffffff] selection:bg-blue-500/10 no-scrollbar overflow-y-auto">
      
      <div className="flex flex-col xl:flex-row gap-12 items-stretch h-full overflow-hidden">
        
        {/* 🍏 INPUT PANEL — APPLE LIGHT MODE SOBRIETY */}
        <div className="xl:w-[42%] flex flex-col min-h-0 bg-[#f5f5f7] border border-black/[0.04] p-8 rounded-[2.5rem]">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <Cpu size={18} className="text-black/30" />
                 <span className="text-[12px] font-bold text-black/40 tracking-[0.1em] uppercase">Neural Source Terminal</span>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setCode('')} className="p-2 text-black/20 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                 </button>
                 <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="bg-white border border-black/[0.06] shadow-sm rounded-xl px-4 py-2 text-[12.5px] text-[#1d1d1f] hover:border-black/20 transition-all cursor-pointer font-bold outline-none"
                 >
                    {[ 'javascript', 'typescript', 'python', 'rust', 'cpp', 'java', 'go', 'swift', 'php' ].map(l => (
                       <option key={l} value={l}>{l.toUpperCase()}</option>
                    ))}
                 </select>
              </div>
           </div>

           <div className="flex-1 bg-white border border-black/[0.04] rounded-[1.5rem] relative shadow-sm">
              <textarea 
                value={code} onChange={e => setCode(e.target.value)}
                placeholder="Synchronize source logic..."
                className="w-full h-full bg-transparent p-7 font-['JetBrains_Mono'] text-[14px] text-black/70 resize-none outline-none placeholder:text-black/5 custom-scrollbar leading-[1.6]"
              />
           </div>
           
           <div className="flex justify-between items-center mt-8">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] text-black/30 font-bold uppercase tracking-[0.08em]">Logic Buffer Ready</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="apple-btn-outline px-6 text-[13px] border-black/10"
                >
                   Data Sync
                </button>
                <button 
                  onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                  className={`apple-btn-black px-10 text-[14px] flex items-center justify-center gap-2.5 h-[52px] ${
                     isGenerating || !code.trim() ? 'opacity-10 cursor-not-allowed' : 'opacity-100 hover:scale-105 active:scale-95'
                  }`}
                >
                   {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Zap size={16} fill="white" />}
                   {isGenerating ? 'Decoding...' : 'Engage Meta-Analysis'}
                </button>
              </div>
           </div>
        </div>

        {/* 🍎 OUTPUT PANEL — APPLE LIGHT MODE PROVISO (FORCED BLACK TEXT) */}
        <div className="xl:w-[58%] flex flex-col min-h-0 bg-[#ffffff] border border-black/[0.06] p-8 rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden">
           <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar gap-8">
              <div className="flex items-center gap-3 no-scrollbar overflow-x-auto pr-4">
                {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                    <button 
                    key={tab} onClick={() => setActiveTab(tab)}
                    className={`shrink-0 px-4 py-2.5 rounded-xl text-[11px] uppercase font-bold tracking-[0.08em] transition-all ${
                        activeTab === tab 
                        ? 'bg-black text-white shadow-lg shadow-black/20' 
                        : 'text-black/35 hover:text-black hover:bg-black/[0.04]'
                    }`}
                    >
                    {tab.replace('_', ' ')}
                    </button>
                ))}
              </div>
              <div className="flex gap-2">
                 {[Share2, Download, Info].map((Icon, i) => (
                    <button key={i} className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/[0.03] text-black/20 hover:text-black">
                       <Icon size={14} />
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex-1 bg-white p-2 overflow-y-auto custom-scrollbar">
              {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                 <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="p-4 rounded-full bg-black/5 mb-6">
                       <Sparkles size={32} className="text-black/10" />
                    </div>
                    <h2 className="text-[17px] font-bold text-[#1d1d1f] tracking-tight uppercase">Cognitive Forge</h2>
                    <p className="text-[12px] text-black/30 max-w-[240px] mt-4 font-medium leading-relaxed">The DocGen neural bridge is connected. Awaiting code injection for world-class technical analysis.</p>
                 </div>
              ) : (
                <div className="h-full">
                  {activeTab === 'QUALITY' ? (
                     <div className="flex flex-col items-center justify-center h-full gap-20 py-10 font-sans">
                        {/* 🍎 APPLE QUALITY SYNC (BLACK ON WHITE) */}
                        <div className="relative group">
                           <svg width="200" height="200" viewBox="0 0 150 150" className="transform -rotate-90">
                              <circle cx="75" cy="75" r="68" stroke="rgba(0,0,0,0.03)" strokeWidth="4" fill="transparent" />
                              <circle 
                                cx="75" cy="75" r="68" 
                                stroke="#1d1d1f" 
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
                                 <span className="text-[64px] font-bold text-[#1d1d1f] tracking-[-0.05em] leading-none">{score}</span>
                                 <span className="text-[11px] font-bold text-black/20 uppercase tracking-[0.15em] mt-5">Architecture Tier</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="w-full max-w-[360px] space-y-10">
                           {[
                              { label: 'Density', val: score + 0.4 },
                              { label: 'Coherence', val: score - 0.2 },
                              { label: 'Complexity', val: score + 0.6 }
                           ].map((dim, i) => (
                             <div key={dim.label} className="space-y-4">
                                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.1em] text-black/25">
                                   <span>{dim.label}</span>
                                   <span className="text-black/60">{Math.min(10, Math.max(0, dim.val)).toFixed(1)}</span>
                                </div>
                                <div className="h-[2px] w-full bg-black/[0.04] rounded-full overflow-hidden">
                                   <div 
                                     className="h-full bg-black transition-all duration-[1200ms] ease-out opacity-60"
                                     style={{ 
                                       width: `${Math.min(10, Math.max(0, dim.val)) * 10}%`,
                                       transitionDelay: `${i * 150}ms`
                                     }}
                                    />
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="prose prose-stone max-w-none 
                         text-[16.5px] text-[#1d1d1f]/70 leading-[1.9] font-medium
                         prose-headings:text-[#1d1d1f] prose-headings:font-bold prose-headings:tracking-tighter
                         prose-h2:text-[24px] prose-h2:mt-12 prose-h2:mb-6
                         prose-a:text-blue-600 prose-a:underline hover:text-black
                         prose-strong:text-black
                         prose-pre:bg-[#f5f5f7] prose-pre:border prose-pre:border-black/[0.04] prose-pre:rounded-3xl prose-pre:p-10
                         prose-code:text-black prose-code:font-['JetBrains_Mono']
                     ">
                        <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Initializing neural analysis engine...' : '# Ready for meta-documentation logic...')} />
                     </div>
                  )}
                </div>
              )}
           </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if(f) processFile(f); }} className="hidden" />
    </div>
  );
};

export default CodeGenerator;

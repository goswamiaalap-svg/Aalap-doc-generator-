import React, { useState, useRef } from 'react';
import { 
  Zap,
  Loader2,
  Settings,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Activity
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
      toast.success(`LOADED: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!code.trim()) return toast.error('SOURCE BUFFER EMPTY');
    setIsGenerating(true);
    setResults({ DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: '' });
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) throw new Error('API SYNC FAILED');

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
      toast.success('NEURAL SCAN COMPLETE');
    } catch (err: any) {
      toast.error('CONNECTION INTERRUPTED');
    } finally {
      setIsGenerating(false);
    }
  };

  const score = results.QUALITY ? parseInt(results.QUALITY) : 0;

  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12 gap-8 animate-fade-up relative z-10 h-[calc(100vh-64px)]">
      
      <div className="flex flex-col xl:flex-row gap-10 items-stretch h-full overflow-hidden">
        
        {/* INPUT PANEL — FUSIONAI GLASS */}
        <div className="xl:w-[45%] flex flex-col min-h-0">
           <div className="flex items-center justify-between mb-4">
              <span className="text-[15px] font-bold text-white tracking-tight">Source Input</span>
              <div className="flex items-center gap-2">
                 <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5 text-[13.5px] text-white/50 outline-none hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                 >
                    <option value="javascript">JavaScript / React</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="rust">Rust</option>
                 </select>
                 <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-white transition-all">
                    <Settings size={16} />
                 </button>
              </div>
           </div>

           <div className="flex-1 relative transition-all duration-300 rounded-3xl border card-glass border-white/[0.08]">
              <textarea 
                value={code} onChange={e => setCode(e.target.value)}
                placeholder="Paste raw source logic or drag a file here..."
                className="w-full h-full bg-transparent p-6 font-['JetBrains_Mono'] text-[13px] text-white/70 resize-none outline-none placeholder:text-white/15 custom-scrollbar"
              />
           </div>
           
           <div className="mt-2 text-[10px] text-white/20 text-right tracking-[0.05em] font-bold uppercase">
              {code.length.toLocaleString()} PROTOCOLS BUFFERED
           </div>

           <div className="flex gap-3 mt-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/[0.05] border border-white/[0.1] rounded-2xl px-6 h-[48px] text-[13.5px] font-bold text-white/50 hover:bg-white/[0.08] hover:text-white transition-all active:scale-95 outline-none"
              >
                 Select File
              </button>
              <button 
                onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                className={`flex-1 rounded-2xl h-[48px] text-[14.5px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 relative overflow-hidden ${
                   isGenerating || !code.trim()
                   ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                   : 'bg-white text-[#0a0a12] hover:bg-white/88'
                }`}
              >
                 {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
                 {isGenerating ? 'Synthesizing...' : 'Generate Docs'}
              </button>
           </div>
        </div>

        {/* OUTPUT PANEL — FUSIONAI GLASS */}
        <div className="xl:w-[55%] flex flex-col min-h-0">
           <div className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar py-1">
              {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-4.5 py-2.5 rounded-xl text-[12px] uppercase font-bold tracking-[0.06em] transition-all border ${
                     activeTab === tab 
                       ? 'bg-[#7c3aed]/15 border-[#7c3aed]/35 text-[#a78bfa] shadow-inner' 
                       : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:bg-white/[0.06] hover:text-white/60'
                  }`}
                >
                   {tab.replace('_', ' ')}
                </button>
              ))}
           </div>

           <div className="flex-1 bg-transparent border border-white/[0.07] rounded-3xl p-8 overflow-y-auto custom-scrollbar backdrop-blur-[4px]">
              {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                       <FileCode size={32} />
                    </div>
                    <h2 className="text-[17px] font-bold text-white uppercase tracking-widest mb-2">Neural Output Idle</h2>
                    <p className="text-[13px] text-white/60 max-w-[200px]">Waiting for a code segment to start cognitive synthesis.</p>
                 </div>
              ) : (
                <div className="animate-fade-up h-full">
                  {activeTab === 'QUALITY' ? (
                     <div className="flex flex-col items-center justify-center h-full gap-12 py-6">
                        {/* FUSIONAI SCORE RING */}
                        <div className="relative">
                           <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                              <defs>
                                 <linearGradient id="qualGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#7c3aed" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                 </linearGradient>
                              </defs>
                              <circle cx="70" cy="70" r="62" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="transparent" />
                              <circle 
                                cx="70" cy="70" r="62" 
                                stroke="url(#qualGradient)" 
                                strokeWidth="8" 
                                fill="transparent" 
                                strokeDasharray={389.5} 
                                strokeDashoffset={389.5 - (389.5 * score * 10) / 100} 
                                strokeLinecap="round" 
                                className="transition-all duration-[1200ms] ease-out drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]" 
                              />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex flex-col items-center">
                                 <div className="flex items-baseline">
                                    <span className="text-[40px] font-bold text-white tracking-tighter leading-none">{score}</span>
                                    <span className="text-[15px] font-bold text-white/35 ml-0.5">/10</span>
                                 </div>
                                 <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mt-1">QUALITY</span>
                              </div>
                           </div>
                        </div>
                        
                        {/* DIMENSION BARS */}
                        <div className="w-full max-w-[400px] space-y-7">
                           {[
                              { label: 'Clarity', val: score + 0.5, icon: <CheckCircle2 size={13} /> },
                              { label: 'Completeness', val: score - 0.5, icon: <Activity size={13} /> },
                              { label: 'Architecture', val: score + 0.2, icon: <FileCode size={13} /> },
                              { label: 'Maintainability', val: score - 0.2, icon: <AlertCircle size={13} /> }
                           ].map((dim, i) => (
                             <div key={dim.label} className="space-y-2.5">
                                <div className="flex justify-between items-center text-[12px] font-medium uppercase tracking-[0.05em]">
                                   <div className="flex items-center gap-2 text-white/50">
                                      {dim.icon}
                                      {dim.label}
                                   </div>
                                   <span className="text-white">{Math.min(10, Math.max(0, dim.val)).toFixed(1)}</span>
                                </div>
                                <div className="h-[5px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                                   <div 
                                     className={`h-full rounded-full transition-all duration-[1000ms] ease-out ${
                                       dim.val >= 8 ? 'bg-[#22c55e]' : dim.val >= 6 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
                                     }`}
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
                     <div className="prose prose-invert max-w-none 
                         text-[15px] text-white/65 leading-[1.8]
                         prose-headings:text-white prose-headings:font-bold
                         prose-h2:text-[18px] prose-h2:mt-8 prose-h2:mb-3
                         prose-a:text-indigo-400
                         prose-code:text-white/90 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-code:font-['JetBrains_Mono']
                         prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-5
                     ">
                        <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Neural scan initiated...\nSearching for semantic patterns...' : '# Waiting for buffer...')} />
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

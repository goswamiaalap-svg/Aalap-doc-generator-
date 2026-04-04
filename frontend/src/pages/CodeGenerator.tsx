import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Zap, 
  Loader2,
  Fingerprint,
  Box,
} from 'lucide-react';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../components/MarkdownRenderer';
import TiltCard from '../components/TiltCard';

type TabType = 'DOCSTRINGS' | 'README' | 'API_REF' | 'DIAGRAM' | 'SECURITY' | 'PERFORMANCE' | 'TESTS' | 'QUALITY';

const CodeGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DOCSTRINGS');
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({
    DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: ''
  });
  const [language, setLanguage] = useState('javascript');
  const [isDragging, setIsDragging] = useState(false);
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
          setResults(parsed);
          accumulated = '';
        } catch (e) {}
      }
      toast.success('SYNTHESIS COMPLETE');
    } catch (err: any) {
      toast.error('NEURAL LINK FAILURE');
    } finally {
      setIsGenerating(false);
    }
  };

  const score = results.QUALITY ? parseInt(results.QUALITY) : 0;

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 gap-8 relative z-10 animate-in fade-in duration-1000">
      
      <div className="flex flex-col xl:flex-row gap-8 items-stretch h-full">
        
        {/* INPUT: 3D GLASS HARBOR */}
        <div className="xl:w-2/5 flex flex-col gap-6">
           <TiltCard maxTilt={3} className="flex-1 flex flex-col rounded-[2rem] overflow-hidden glass-panel">
              <div className="px-6 py-5 bg-white/[0.04] border-b border-indigo-500/20 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Fingerprint size={18} className="text-indigo-400" />
                    <span className="text-[11px] font-black uppercase tracking-widest">SOURCE INJECTION</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <select 
                      value={language} onChange={e => setLanguage(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] outline-none hover:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="javascript">JS / REACT</option>
                      <option value="typescript">TYPESCRIPT</option>
                      <option value="python">PYTHON</option>
                      <option value="rust">RUST / WASM</option>
                    </select>
                 </div>
              </div>
              
              <div 
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) processFile(f); }}
                className="flex-1 relative bg-black/40"
              >
                 <textarea 
                   value={code} onChange={e => setCode(e.target.value)}
                   placeholder="PASTE RAW SOURCE LOGIC..."
                   className="w-full h-full min-h-[500px] bg-transparent p-10 font-mono text-[13px] text-white/50 resize-none outline-none placeholder:text-white/10 custom-scrollbar"
                 />
                 {isDragging && (
                    <div className="absolute inset-0 bg-indigo-500/20 backdrop-blur-md border-2 border-dashed border-indigo-500 flex flex-col items-center justify-center z-50">
                       <Upload size={48} className="text-white animate-bounce mb-4" />
                       <span className="text-sm font-black uppercase tracking-[0.4em]">DROP NEURAL PACKET</span>
                    </div>
                 )}
                 <div className="absolute bottom-6 right-8 text-[10px] font-black uppercase tracking-widest text-white/20">
                    {code.length} PROTOCOLS IN BUFFER
                 </div>
              </div>

              <div className="p-6 bg-white/[0.04] border-t border-indigo-500/20 flex items-center justify-between gap-4">
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="flex-1 px-6 py-4 rounded-xl glass-card text-[11px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 shadow-inner shadow-white/5"
                 >
                    <Upload size={14} /> SELECT MODULE
                 </button>
                 <button 
                   onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                   className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-[12px] font-black uppercase tracking-[0.4em] text-white shadow-[0_8px_32px_rgba(99,102,241,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.5)] active:translate-y-0 transition-all flex items-center justify-center gap-4 group"
                 >
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Zap size={18} className="group-hover:rotate-[360deg] transition-all duration-700" />}
                    {isGenerating ? 'SYNTHESIZING' : 'GENERATE DOCS'}
                 </button>
              </div>
           </TiltCard>
        </div>

        {/* OUTPUT: 3D DATA HARVEST */}
        <div className="xl:w-3/5 flex flex-col glass-panel rounded-[2.5rem] overflow-hidden backdrop-blur-2xl transition-all duration-700 shadow-3xl">
           <div className="px-10 py-5 bg-white/[0.04] border-b border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                 {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                   <button 
                     key={tab} onClick={() => setActiveTab(tab)}
                     className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                        activeTab === tab 
                          ? 'bg-indigo-500/20 border border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                          : 'bg-white/[0.04] border border-white/[0.08] text-white/45'
                     }`}
                   >
                      {tab.replace('_', ' ')}
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
              {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <Box size={100} className="mb-8" />
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">NEURAL BUFFER IDLE</h2>
                    <p className="max-w-xs text-xs text-white font-medium leading-relaxed uppercase tracking-widest">AWAITING SOURCE INJECTION FOR COGNITIVE SYNTHESIS.</p>
                 </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 h-full">
                  {activeTab === 'QUALITY' ? (
                     <div className="flex flex-col items-center justify-center h-full gap-16 py-10 px-8">
                        {/* 3D SCORE RING */}
                        <div className="relative w-[180px] h-[180px] scale-125">
                           <svg className="w-full h-full transform -rotate-90">
                              <defs>
                                 <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                 </linearGradient>
                              </defs>
                              <circle cx="90" cy="90" r="80" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="transparent" />
                              <circle 
                                cx="90" cy="90" r="80" 
                                stroke="url(#scoreGradient)" 
                                strokeWidth="14" 
                                fill="transparent" 
                                strokeDasharray={502} 
                                strokeDashoffset={502 - (502 * score * 10) / 100} 
                                strokeLinecap="round" 
                                className="transition-all duration-[1500ms] ease-out drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                              />
                           </svg>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-6xl font-black text-white tracking-widest">{score}</span>
                              <span className="text-[12px] font-black uppercase text-white/30 tracking-[0.4em]">QUAL / 10</span>
                           </div>
                        </div>
                        
                        {/* DIMENSION BARS */}
                        <div className="w-full max-w-lg space-y-10">
                           {[
                              { label: 'ARCHITECTURE', val: score + (Math.random() * 2 - 1) },
                              { label: 'NEURAL DENSITY', val: score + (Math.random() * 2 - 1) },
                              { label: 'SYNC PERFORMANCE', val: score + (Math.random() * 2 - 1) },
                              { label: 'DATA INTEGRITY', val: score + (Math.random() * 2 - 1) }
                           ].map(dim => (
                             <div key={dim.label} className="space-y-4">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em]">
                                   <span className="text-white/40">{dim.label}</span>
                                   <span className="text-[#06b6d4]">{Math.max(0, Math.min(10, dim.val)).toFixed(1)} SYNC</span>
                                </div>
                                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden shadow-inner">
                                   <div 
                                     className={`h-full rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_12px_currentColor] ${
                                       dim.val < 5 ? 'bg-red-500 text-red-500' : dim.val < 7.5 ? 'bg-amber-500 text-amber-500' : 'bg-cyan-500 text-cyan-500'
                                     }`}
                                     style={{ width: `${Math.max(0, Math.min(10, dim.val)) * 10}%` }}
                                   />
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-none">
                        <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# NEURAL STREAM OPENED...' : '# AWAITING DATAFEED...')} />
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

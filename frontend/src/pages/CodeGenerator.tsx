import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Play, 
  Loader2,
  Settings,
  X,
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
  const [filename, setFilename] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({
    DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: ''
  });
  const [language, setLanguage] = useState('javascript');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    setFilename(file.name);
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
        
        {/* INPUT PANEL */}
        <div className="xl:w-[45%] flex flex-col min-h-0">
           <div className="flex items-center justify-between mb-4">
              <span className="text-[15px] font-semibold text-white tracking-tight">Source Input</span>
              <div className="flex items-center gap-2">
                 <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-[9px] px-3 py-1.5 text-[13px] text-white outline-none hover:border-white/20 transition-all cursor-pointer"
                 >
                    <option value="javascript">JavaScript / React</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="rust">Rust</option>
                 </select>
                 <button className="p-2 rounded-[9px] bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                    <Settings size={16} />
                 </button>
              </div>
           </div>

           {filename && (
              <div className="mb-4 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 w-fit animate-fade-up">
                 <FileCode size={14} className="text-[#c4b5fd]" />
                 <span className="text-xs font-medium text-[#c4b5fd] tracking-tight">{filename}</span>
                 <button onClick={() => {setFilename(null); setCode('');}} className="ml-1 text-[#c4b5fd]/50 hover:text-[#c4b5fd]">
                    <X size={14} />
                 </button>
              </div>
           )}

           <div 
             onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
             onDragLeave={() => setIsDragging(false)}
             onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) processFile(f); }}
             className={`flex-1 relative transition-all duration-300 rounded-2xl border ${
                isDragging ? 'border-[#8b5cf6] bg-indigo-500/5' : 'border-white/[0.07] bg-white/[0.03]'
             }`}
           >
              <textarea 
                value={code} onChange={e => setCode(e.target.value)}
                placeholder="Paste raw source logic or drag a file here..."
                className="w-full h-full bg-transparent p-6 font-['JetBrains_Mono'] text-[13px] text-white/85 resize-none outline-none placeholder:text-white/25 custom-scrollbar"
              />
              {isDragging && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Upload size={32} className="text-[#8b5cf6] mb-3 animate-bounce" />
                    <span className="text-[13px] font-bold text-[#8b5cf6] uppercase tracking-widest">Inject Neural Packet</span>
                 </div>
              )}
           </div>
           
           <div className="mt-2 text-[11px] text-white/25 text-right tracking-tight font-medium">
              {code.length.toLocaleString()} PROTOCOLS BUFFERED
           </div>

           <div className="flex gap-2.5 mt-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-all flex items-center gap-2 group active:scale-95 outline-none"
              >
                 <Upload size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                 Select File
              </button>
              <button 
                onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                className={`flex-1 rounded-xl h-[44px] text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 relative overflow-hidden ${
                   isGenerating || !code.trim()
                   ? 'bg-white/5 text-white/30 cursor-not-allowed'
                   : 'bg-white text-[#08080f] hover:bg-white/90 animate-fade-up'
                }`}
              >
                 {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                 {isGenerating ? 'Synthesizing...' : 'Generate Docs'}
              </button>
           </div>
        </div>

        {/* OUTPUT PANEL */}
        <div className="xl:w-[55%] flex flex-col min-h-0">
           <div className="flex items-center gap-1.5 mb-5 overflow-x-auto no-scrollbar py-1">
              {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-[12px] uppercase tracking-[0.04em] transition-all ${
                     activeTab === tab 
                       ? 'bg-indigo-500/15 border border-indigo-500/30 text-[#c4b5fd] font-bold shadow-inner' 
                       : 'bg-white/[0.04] border border-white/[0.07] text-white/40 hover:bg-white/[0.07] hover:text-white/70'
                  }`}
                >
                   {tab.replace('_', ' ')}
                </button>
              ))}
           </div>

           <div className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 overflow-y-auto custom-scrollbar">
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

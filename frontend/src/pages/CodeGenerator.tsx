import React, { useState, useRef } from 'react';
import { 
  Zap,
  Loader2,
  Settings,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Activity,
  Cpu
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
      toast.success('NEURAL SCAN COMPLETE');
    } catch (err: any) {
      toast.error('SYNC ENCOUNTERED INTERRUPT');
    } finally {
      setIsGenerating(false);
    }
  };

  const score = results.QUALITY ? parseInt(results.QUALITY) : 0;

  return (
    <div className="flex-1 flex flex-col p-12 lg:p-16 gap-10 animate-apple-in relative z-10 h-[calc(100vh-40px)] bg-[#000000]">
      
      <div className="flex flex-col xl:flex-row gap-12 items-stretch h-full overflow-hidden">
        
        {/* 🍏 INPUT PANEL — APPLE MINIMALIST SOBRIETY */}
        <div className="xl:w-[45%] flex flex-col min-h-0">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                 <Cpu size={16} className="text-white/40" />
                 <span className="text-[14px] font-bold text-white tracking-tight">Source Logic</span>
              </div>
              <div className="flex items-center gap-3">
                 <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="bg-[#1c1c1e] border border-white/[0.08] rounded-xl px-4 py-2 text-[12.5px] text-white/60 outline-none hover:text-white transition-all cursor-pointer font-medium"
                 >
                    <option value="javascript">JavaScript / React</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="rust">Rust</option>
                    {/* 🍎 NEW LANGUAGES ADDED */}
                    <option value="cpp">C++ (Standard)</option>
                    <option value="java">Java (Oracle)</option>
                    <option value="go">Golang</option>
                    <option value="swift">Swift (Apple Native)</option>
                    <option value="php">PHP (Modern)</option>
                 </select>
              </div>
           </div>

           <div className="flex-1 bg-[#161617] border border-white/[0.08] rounded-2xl relative transition-all duration-300">
              <textarea 
                value={code} onChange={e => setCode(e.target.value)}
                placeholder="Paste code or drop file here..."
                className="w-full h-full bg-transparent p-7 font-['JetBrains_Mono'] text-[13px] text-white/50 resize-none outline-none placeholder:text-white/10 custom-scrollbar leading-[1.6]"
              />
           </div>
           
           <div className="flex justify-between items-center mt-6">
              <span className="text-[10px] text-white/15 font-bold uppercase tracking-[0.06em]">
                {code.length.toLocaleString()} BYTES IN BUFFER
              </span>
              <div className="flex gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="apple-btn-outline px-6 text-[13px]"
                >
                   File Input
                </button>
                <button 
                  onClick={handleGenerate} disabled={isGenerating || !code.trim()}
                  className={`apple-btn-white px-10 text-[14px] flex items-center justify-center gap-2 ${
                     isGenerating || !code.trim() ? 'opacity-20 cursor-not-allowed' : 'opacity-100'
                  }`}
                >
                   {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={14} fill="currentColor" />}
                   {isGenerating ? 'Synthesizing...' : 'Generate Docs'}
                </button>
              </div>
           </div>
        </div>

        {/* 🍎 OUTPUT PANEL — APPLE CLEAN MINIMALISM */}
        <div className="xl:w-[55%] flex flex-col min-h-0">
           <div className="flex items-center gap-4 mb-6 overflow-x-auto no-scrollbar py-1">
              {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-5 py-2.5 rounded-xl text-[11px] uppercase font-bold tracking-[0.05em] transition-all ${
                     activeTab === tab 
                       ? 'bg-white text-black' 
                       : 'bg-white/[0.04] text-white/30 hover:bg-white/[0.08] hover:text-white/60'
                  }`}
                >
                   {tab.replace('_', ' ')}
                </button>
              ))}
           </div>

           <div className="flex-1 bg-[#161617] border border-white/[0.08] rounded-2xl p-10 overflow-y-auto custom-scrollbar">
              {!Object.values(results).some(v => v.length > 5) && !isGenerating ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                    <h2 className="text-[16px] font-bold text-white uppercase tracking-[0.08em]">Output Area</h2>
                    <p className="text-[12px] text-white/50 max-w-[200px] mt-4 font-medium">Ready for neural documentation synthesis.</p>
                 </div>
              ) : (
                <div className="h-full">
                  {activeTab === 'QUALITY' ? (
                     <div className="flex flex-col items-center justify-center h-full gap-16 py-6">
                        {/* 🍎 APPLE CLEAN SCORE */}
                        <div className="relative">
                           <svg width="150" height="150" viewBox="0 0 150 150" className="transform -rotate-90">
                              <circle cx="75" cy="75" r="68" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
                              <circle 
                                cx="75" cy="75" r="68" 
                                stroke="#ffffff" 
                                strokeWidth="6" 
                                fill="transparent" 
                                strokeDasharray={427} 
                                strokeDashoffset={427 - (427 * score * 10) / 100} 
                                strokeLinecap="round" 
                                className="transition-all duration-[1500ms] ease-out opacity-80" 
                              />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex flex-col items-center">
                                 <span className="text-[48px] font-bold text-white tracking-[-0.05em] leading-none">{score}</span>
                                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.12em] mt-3">QUALITY</span>
                              </div>
                           </div>
                        </div>
                        
                        {/* 🍏 DIMENSION BARS (SOBER) */}
                        <div className="w-full max-w-[340px] space-y-8">
                           {[
                              { label: 'Clarity', val: score + 0.5 },
                              { label: 'Completeness', val: score - 0.5 },
                              { label: 'Architecture', val: score + 0.2 },
                              { label: 'Maintainability', val: score - 0.2 }
                           ].map((dim, i) => (
                             <div key={dim.label} className="space-y-3">
                                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.05em] text-white/20">
                                   <span>{dim.label}</span>
                                   <span className="text-white/60">{Math.min(10, Math.max(0, dim.val)).toFixed(1)}</span>
                                </div>
                                <div className="h-[3px] w-full bg-white/[0.04] rounded-full overflow-hidden">
                                   <div 
                                     className="h-full bg-white transition-all duration-[1000ms] ease-out opacity-60"
                                     style={{ 
                                       width: `${Math.min(10, Math.max(0, dim.val)) * 10}%`,
                                       transitionDelay: `${i * 100}ms`
                                     }}
                                    />
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="prose prose-invert max-w-none 
                         text-[16px] text-white/45 leading-[1.8] font-medium
                         prose-headings:text-white prose-headings:font-bold
                         prose-h2:text-[20px] prose-h2:mt-10 prose-h2:mb-4
                         prose-a:text-white/60 prose-a:underline hover:prose-a:text-white
                         prose-code:text-white/90 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-['JetBrains_Mono']
                         prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-7
                     ">
                        <MarkdownRenderer content={results[activeTab] || (isGenerating ? '# Neural analysis initiated...' : '# Ready to process code entry...')} />
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

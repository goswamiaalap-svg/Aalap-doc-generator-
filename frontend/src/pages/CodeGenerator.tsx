import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Zap, 
  Download, 
  Cpu, 
  Sparkles,
  Trash2,
  X,
  Loader2,
  Gauge,
  History as HistoryIcon,
  Layers,
  Fingerprint,
  Activity,
  Box
} from 'lucide-react';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../components/MarkdownRenderer';

type TabType = 'DOCSTRINGS' | 'README' | 'API_REF' | 'DIAGRAM' | 'SECURITY' | 'PERFORMANCE' | 'TESTS' | 'QUALITY';

interface DocHistory {
  id: string;
  name: string;
  timestamp: string;
  results: Record<string, string>;
  code: string;
}

const CodeGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DOCSTRINGS');
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({
    DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: ''
  });
  const [language, setLanguage] = useState('javascript');
  const [verbosity, setVerbosity] = useState('normal');
  const [audience, setAudience] = useState('dev');
  const [advancedMode, setAdvancedMode] = useState(true);
  const [options, setOptions] = useState({
    security_audit: true,
    performance_analysis: true,
    test_generation: true
  });
  
  const [history, setHistory] = useState<DocHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('hgm06_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      e.target.value = '';
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    const fName = file.name;
    const isBinary = fName.endsWith('.zip') || fName.endsWith('.pdf') || fName.endsWith('.png') || fName.endsWith('.jpg') || fName.endsWith('.docx');
    
    if (isBinary) {
      toast.error('Source Incompatible: Pulse code files only (.js, .py, .java)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (re) => {
      const content = re.target?.result as string;
      if (content.trim()) {
        setCode(content);
        setFileName(fName);
        toast.success(`Loaded: ${fName}`);
      } else {
        toast.error('File Data Empty');
      }
    };
    reader.onerror = () => toast.error('Neural Stream Broken during read');
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!code.trim()) return toast.error('Source Buffer Empty');
    
    setIsGenerating(true);
    setResults({ DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: '' });
    
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, verbosity, audience, options }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error('API Sync Failed');

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
        } catch (e) {
          // Continue accumulating if JSON incomplete
        }
      }

      toast.success('Synthesis Complete');
    } catch (err: any) {
      if (err.name === 'AbortError') toast('Synthesis Aborted', { icon: '🛡️' });
      else toast.error('Neural Link Failure');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const score = results.QUALITY ? parseInt(results.QUALITY) : 0;

  return (
    <div className="min-h-full pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl glass-card text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-6 group cursor-default">
              <Activity size={14} className="group-hover:animate-ping" />
              <span>Neural Laboratories v4.2 (Production)</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter sm:leading-[1.1] mb-6 uppercase">
              Achieve <br/> 
              <span className="logo-gradient drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">NEURAL FLOW</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setShowHistory(!showHistory)}
               className={`flex items-center gap-3 px-6 py-3 rounded-2xl glass-card transition-all text-xs font-black uppercase tracking-widest ${showHistory ? 'ring-2 ring-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
             >
                <HistoryIcon size={16} /> History
             </button>
             <button className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all shadow-xl hover:bg-orange-500 hover:text-white">
                <Layers size={16} /> Export Sync
             </button>
          </div>
        </header>

        {/* MAIN ENGINE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INPUT HUB */}
          <div className="lg:col-span-4 space-y-8">
            <div 
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-[2.5rem] glass-card overflow-hidden transition-all duration-500 relative group flex flex-col ${isDragging ? 'ring-2 ring-amber-500 bg-amber-500/10' : ''}`}
            >
               <div className="flex items-center justify-between px-6 py-5 bg-white/[0.02] border-b border-white/5">
                  <div className="flex items-center gap-3">
                     <Fingerprint size={20} className="text-amber-500" />
                     <span className="text-[11px] font-black uppercase tracking-widest text-white">Source Injection</span>
                  </div>
                  <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] outline-none hover:border-amber-500 transition-all cursor-pointer"
                  >
                    <option value="javascript">JS / React</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="rust">Rust / WASM</option>
                  </select>
               </div>
               
               <div className="flex-1 relative">
                  <textarea 
                    value={code} onChange={e => setCode(e.target.value)}
                    placeholder="Enter raw source logic..."
                    className="w-full h-full min-h-[400px] bg-transparent p-8 font-mono text-[13px] text-gray-400 resize-none outline-none placeholder:text-gray-700 custom-scrollbar"
                  />
                  {!code && <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none uppercase font-black tracking-[1em] text-4xl -rotate-12">Neural Pure</div>}
                  {isDragging && (
                      <div className="absolute inset-x-4 inset-y-4 rounded-2xl bg-amber-500/20 backdrop-blur-md border-2 border-dashed border-amber-400 flex flex-col items-center justify-center z-50 animate-in fade-in zoom-in duration-300 pointer-events-none">
                        <Upload size={48} className="text-amber-400 animate-bounce mb-4" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-white">Drop Neural Packet</span>
                      </div>
                  )}
               </div>

               <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-white transition-colors">
                     <Upload size={14} /> Local Module
                  </button>
                  <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-gray-600">
                     <span>{code.split('\n').length} Flows</span>
                     <span>{code.length} Bytes</span>
                  </div>
               </div>
            </div>

            {/* CONFIGURATION HUB */}
            <div className="rounded-[2.5rem] glass-card p-8 space-y-8 shadow-xl">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Logic Switches</h3>
                  <div className={`p-1 w-10 h-6 rounded-full transition-all cursor-pointer flex items-center ${advancedMode ? 'bg-orange-500 justify-end' : 'bg-white/10 justify-start'}`} onClick={() => setAdvancedMode(!advancedMode)}>
                     <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'security_audit', label: 'Shield', icon: <ShieldAlert size={18} /> },
                    { id: 'performance_analysis', label: 'Peak', icon: <Gauge size={18} /> },
                    { id: 'test_generation', label: 'Proof', icon: <Box size={18} /> }
                  ].map(opt => (
                    <div 
                      key={opt.id} 
                      onClick={() => setOptions({...options, [opt.id as keyof typeof options]})}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl glass-card transition-all cursor-pointer ${options[opt.id as keyof typeof options] ? 'border-amber-500/50 text-amber-500' : 'text-gray-500'}`}
                    >
                       {opt.icon}
                       <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2">Verbosity</label>
                     <select value={verbosity} onChange={e => setVerbosity(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] font-bold outline-none uppercase focus:border-amber-500">
                        <option value="brief">Brief</option>
                        <option value="normal">Standard</option>
                        <option value="comprehensive">Deep</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2">Persona</label>
                     <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] font-bold outline-none uppercase focus:border-orange-500">
                        <option value="dev">Engineer</option>
                        <option value="senior">Architect</option>
                        <option value="non-technical">PM</option>
                     </select>
                  </div>
               </div>

               <button 
                 onClick={handleGenerate} disabled={isGenerating}
                 className="w-full h-20 group relative rounded-[2rem] bg-gradient-to-br from-orange-600 to-indigo-600 overflow-hidden shadow-2xl transform transition-active active:scale-95 duration-500"
               >
                  <div className="absolute inset-x-0 h-full w-20 bg-white/10 blur-3xl -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <div className="relative flex items-center justify-center gap-4 text-white text-md font-black uppercase tracking-[0.5em]">
                     {isGenerating ? <Loader2 className="animate-spin" /> : <Zap size={24} className="group-hover:rotate-[360deg] transition-transform duration-700" />}
                     {isGenerating ? 'Synthesizing...' : 'Sync Cycle'}
                  </div>
               </button>
            </div>
          </div>

          {/* RIGHT: RESULTS TERMINAL */}
          <div className="lg:col-span-8 flex flex-col min-h-[850px] glass-card rounded-[3rem] overflow-hidden shadow-3xl">
             <div className="flex items-center justify-between px-8 bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center">
                   {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                     <button 
                       key={tab} onClick={() => setActiveTab(tab)}
                       className={`px-5 py-6 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all duration-500 ${activeTab === tab ? 'text-amber-500' : 'text-gray-500 hover:text-white'}`}
                     >
                        {tab.replace('_', ' ')}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-indigo-500 shadow-[0_0_20px_rgba(245,158,11,0.8)] rounded-t-full transition-all" />}
                     </button>
                   ))}
                </div>
                <div className="flex gap-4">
                   <button className="p-2.5 glass-card rounded-xl border border-white/10 hover:border-amber-500 transition-all text-gray-500 hover:text-white">
                      <Download size={16} />
                   </button>
                   <button className="p-2.5 glass-card rounded-xl border border-white/10 hover:border-red-500/50 transition-all text-gray-500 hover:text-red-400" onClick={() => setResults({DOCSTRINGS:'',README:'',API_REF:'',DIAGRAM:'',SECURITY:'',PERFORMANCE:'',TESTS:'',QUALITY:''})}>
                      <Trash2 size={16} />
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
                {!Object.values(results).some(v => v.length > 5) ? (
                   <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-32 h-32 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                         <Sparkles size={56} className="text-white opacity-20 animate-shimmer" />
                      </div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Neural Buffer Idle</h2>
                      <p className="max-w-xs text-sm text-gray-500 font-medium leading-relaxed uppercase tracking-widest">Awaiting source injection for cognitive synthesis.</p>
                   </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    {activeTab === 'QUALITY' ? (
                       <div className="flex flex-col items-center py-20">
                          <div className="relative w-56 h-56">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5"/>
                                <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="14" fill="transparent" strokeDasharray={628} strokeDashoffset={628 - (628 * score * 10) / 100} strokeLinecap="round" className={`transition-all duration-1000 ease-out drop-shadow-[0_0_15px_currentColor] ${score >= 8 ? 'text-emerald-500' : 'text-amber-500'}`} />
                             </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-7xl font-black text-white tracking-tighter">{score}</span>
                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Quality Scale</span>
                             </div>
                          </div>
                          <div className="mt-12 flex gap-4">
                             <div className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest">Stability: High</div>
                             <div className="px-6 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-[10px] font-black uppercase tracking-widest text-amber-500">Risk: Minimal</div>
                          </div>
                       </div>
                    ) : (
                       <div className="prose prose-invert max-w-none">
                          <MarkdownRenderer content={results[activeTab] || '# Awaiting Neural Stream...'} />
                       </div>
                    )}
                  </div>
                )}
             </div>

             <div className="px-10 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between opacity-60">
                <div className="flex gap-8">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Core Engine: Live</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Cpu size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">V4.2.0 Hybrid</span>
                   </div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Cognitive Stream Active</div>
             </div>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".js,.jsx,.ts,.tsx,.py,.java,.go,.rs,.c,.cpp,.txt" />
    </div>
  );
};

export default CodeGenerator;

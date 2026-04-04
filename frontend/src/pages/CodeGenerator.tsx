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
  ShieldAlert,
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
  const [context] = useState('');
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
  const [isDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('hgm06_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (res: Record<string, string>, raw: string) => {
    const entry: DocHistory = {
      id: Math.random().toString(36).substr(2, 9),
      name: fileName || 'Unnamed Source',
      timestamp: new Date().toLocaleTimeString(),
      results: res,
      code: raw
    };
    const newHistory = [entry, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('hgm06_history', JSON.stringify(newHistory));
  };

  const loadFromHistory = (entry: DocHistory) => {
    setResults(entry.results);
    setCode(entry.code);
    setFileName(entry.name);
    setShowHistory(false);
    toast.success('Restored from Neural History');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target?.result as string);
      reader.readAsText(file);
      const ext = file.name.split('.').pop()?.toLowerCase();
      const langMap: Record<string, string> = { 'js': 'javascript', 'ts': 'typescript', 'py': 'python', 'rs': 'rust', 'go': 'go', 'cpp': 'cpp', 'java': 'java' };
      if (ext && langMap[ext]) setLanguage(langMap[ext]);
    }
  };

  const handleGenerate = async () => {
    if (!code.trim()) { toast.error('Source Pulse Missing.'); return; }
    setIsGenerating(true);
    setResults({ DOCSTRINGS: '', README: '', API_REF: '', DIAGRAM: '', SECURITY: '', PERFORMANCE: '', TESTS: '', QUALITY: '' });
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    const toastId = toast.loading('Initializing Neural Laboratories...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          raw_code: code,
          project_context: context,
          language,
          advanced_mode: advancedMode,
          audit_mode: options.security_audit,
          performance_mode: options.performance_analysis,
          audience,
          verbosity
        })
      });

      if (!response.ok) throw new Error("Neural Hub Reject: " + response.statusText);
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let streamBuffer = '';
      let currentSection: TabType = 'DOCSTRINGS';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                streamBuffer += data.text;
                const markers: { m: string, t: TabType }[] = [
                  { m: '---DOCGEN:DOCSTRINGS---', t: 'DOCSTRINGS' },
                  { m: '---DOCGEN:README---', t: 'README' },
                  { m: '---DOCGEN:API_REF---', t: 'API_REF' },
                  { m: '---DOCGEN:DIAGRAM---', t: 'DIAGRAM' },
                  { m: '---DOCGEN:SECURITY---', t: 'SECURITY' },
                  { m: '---DOCGEN:PERFORMANCE---', t: 'PERFORMANCE' },
                  { m: '---DOCGEN:TESTS---', t: 'TESTS' },
                  { m: '---DOCGEN:QUALITY---', t: 'QUALITY' }
                ];
                for (const item of markers) {
                  if (streamBuffer.includes(item.m)) {
                    currentSection = item.t;
                    streamBuffer = streamBuffer.replace(item.m, '');
                  }
                }
                setResults(prev => ({ ...prev, [currentSection]: prev[currentSection as keyof typeof prev] + data.text }));
              }
            } catch (e) {}
          }
        }
      }
      saveToHistory(results, code);
      toast.success('Cognition Sync Complete!', { id: toastId });
    } catch (error: any) {
      if (error.name !== 'AbortError') toast.error('Sync Interrupted.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const getQualityScore = () => {
    const q = results['QUALITY'];
    // Look for various patterns: "score: 8", "rank: 8", "8/10", "rating: 8"
    const patterns = [
       /score:\s*(\d{1,2})/i,
       /rank:\s*(\d{1,2})/i,
       /(\d{1,2})\/10/,
       /rating:\s*(\d{1,2})/i
    ];
    
    for (const pattern of patterns) {
       const match = q.match(pattern);
       if (match) return Math.min(10, parseInt(match[1]));
    }
    
    // Fallback based on content analysis
    if (q.length > 100) {
       if (q.toLowerCase().includes('excellent') || q.toLowerCase().includes('robust')) return 9;
       if (q.toLowerCase().includes('good') || q.toLowerCase().includes('stable')) return 8;
       if (q.toLowerCase().includes('poor') || q.toLowerCase().includes('risk')) return 4;
       return 7;
    }
    return 0;
  };

  const score = getQualityScore();

  return (
    <div className="min-h-full pb-12 px-4 sm:px-6 lg:px-8 bg-[#020617] relative overflow-hidden">
      
      {/* Visual Ambiance */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-10 right-[-5%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* HEADER HUB */}
        <header className="mb-12 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-6 group cursor-default">
              <Activity size={14} className="group-hover:animate-ping" />
              <span>Neural Laboratories v4.1 (Stable)</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter sm:leading-[1.1] mb-6">
              COGNITIVE <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.25)]">DOC ENVIRONMENT</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setShowHistory(!showHistory)}
               className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest ${showHistory ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
             >
                <HistoryIcon size={16} /> History
             </button>
             <button className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all shadow-xl hover:bg-blue-400">
                <Layers size={16} /> Enterprise Link
             </button>
          </div>
        </header>

        {/* Neural History Overlay */}
        {showHistory && (
          <div className="absolute top-40 right-8 w-80 bg-black/90 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl z-50 shadow-2xl animate-in fade-in slide-in-from-top-4">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Restore Session</h3>
                <X size={16} className="cursor-pointer" onClick={() => setShowHistory(false)} />
             </div>
             <div className="space-y-3">
                {history.length === 0 ? <p className="text-xs text-gray-600 italic">No cycles saved yet.</p> : history.map(h => (
                   <div key={h.id} onClick={() => loadFromHistory(h)} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/50 cursor-pointer transition-all group">
                      <p className="text-xs font-bold text-white group-hover:text-blue-400 truncate">{h.name}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-black">{h.timestamp}</p>
                   </div>
                ))}
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* LEFT COMMAND CENTER */}
          <div className="lg:col-span-5 space-y-8 flex flex-col">
            
            {/* INJECTION MATRIX */}
            <div className={`flex-1 rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden shadow-2xl flex flex-col transition-all duration-700 ${isDragging ? 'bg-blue-500/5 border-blue-500' : ''}`}>
               <div className="flex items-center justify-between px-6 py-5 bg-white/[0.03] border-b border-white/10">
                  <div className="flex items-center gap-3">
                     <Fingerprint size={20} className="text-blue-400" />
                     <span className="text-[11px] font-black uppercase tracking-widest text-white">Source Injection</span>
                  </div>
                  <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] outline-none hover:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="javascript">JS / React</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="rust">Rust Hub</option>
                    <option value="go">Golang</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++ / High Perf</option>
                    <option value="swift">Swift / iOS</option>
                    <option value="kotlin">Kotlin / Android</option>
                    <option value="php">PHP / Web</option>
                    <option value="ruby">Ruby on Rails</option>
                  </select>
               </div>
               
               <div className="flex-1 relative">
                  <textarea 
                    value={code} onChange={e => setCode(e.target.value)}
                    placeholder="Enter raw source logic..."
                    className="w-full h-full min-h-[400px] bg-transparent p-8 font-mono text-[13px] text-gray-400 resize-none outline-none placeholder:text-gray-700 custom-scrollbar"
                  />
                  {!code && <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none uppercase font-black tracking-[1em] text-4xl -rotate-12">Neural Pure</div>}
               </div>

               <div className="p-6 bg-white/[0.03] border-t border-white/10 flex items-center justify-between">
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
                     <Upload size={14} /> Local Module
                  </button>
                  <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-gray-600">
                     <span>{code.split('\n').length} Flows</span>
                     <span>{code.length} Bytes</span>
                  </div>
               </div>
            </div>

            {/* NEURAL SETTINGS (ADVANCED) */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-8 space-y-8 shadow-xl">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Cognitive Switches</h3>
                  <div className={`p-1 w-10 h-6 rounded-full transition-all cursor-pointer flex items-center ${advancedMode ? 'bg-indigo-600 justify-end' : 'bg-white/10 justify-start'}`} onClick={() => setAdvancedMode(!advancedMode)}>
                     <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { id: 'security_audit', icon: <ShieldAlert size={16}/>, label: 'Audit' },
                    { id: 'performance_analysis', icon: <Gauge size={16}/>, label: 'Perf' },
                    { id: 'test_generation', icon: <Box size={16}/>, label: 'Tests' }
                  ].map(opt => (
                    <div 
                      key={opt.id} 
                      onClick={() => setOptions({...options, [opt.id]: !options[opt.id as keyof typeof options]})}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${options[opt.id as keyof typeof options] ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/5 text-gray-500'}`}
                    >
                       {opt.icon}
                       <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2">Logic Model</label>
                     <select value={verbosity} onChange={e => setVerbosity(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-[11px] font-bold outline-none uppercase focus:border-blue-500">
                        <option value="brief">Lightning</option>
                        <option value="normal">Standard</option>
                        <option value="comprehensive">Deep Reason</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2">Persona</label>
                     <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-[11px] font-bold outline-none uppercase focus:border-indigo-500">
                        <option value="dev">Engineer</option>
                        <option value="senior">Architect</option>
                        <option value="non-technical">PM / Lead</option>
                     </select>
                  </div>
               </div>
            </div>

            <button 
              onClick={handleGenerate} disabled={isGenerating}
              className="w-full h-20 group relative rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.3)] transform transition-active active:scale-95 duration-500"
            >
               <div className="absolute inset-x-0 h-full w-20 bg-white/20 blur-3xl -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
               <div className="relative flex items-center justify-center gap-4 text-white text-md font-black uppercase tracking-[0.5em]">
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Zap size={24} className="group-hover:rotate-[360deg] transition-transform duration-700" />}
                  {isGenerating ? 'Synthesizing...' : 'Sync Cycle'}
               </div>
            </button>
          </div>

          {/* RIGHT VIEWING HUB */}
          <div className="lg:col-span-7 flex flex-col min-h-[800px]">
             <div className="flex-1 rounded-[2.5rem] bg-white/[0.02] border border-white/10 shadow-3xl flex flex-col overflow-hidden backdrop-blur-md">
                
                {/* ADVANCED TAB NAVIGATION */}
                <div className="flex items-center justify-between px-8 bg-white/[0.02] border-b border-white/10 overflow-x-auto no-scrollbar">
                   <div className="flex">
                      {(['DOCSTRINGS', 'README', 'API_REF', 'DIAGRAM', 'SECURITY', 'PERFORMANCE', 'TESTS', 'QUALITY'] as TabType[]).map(tab => (
                        <button 
                          key={tab} onClick={() => setActiveTab(tab)}
                          className={`px-5 py-6 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all duration-500 ${activeTab === tab ? 'text-blue-400' : 'text-gray-500 hover:text-white'}`}
                        >
                           {tab.replace('_', ' ')}
                           {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] rounded-t-full transition-all" />}
                        </button>
                      ))}
                   </div>
                   <div className="flex items-center gap-4 ml-6">
                      <button className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500 transition-all text-gray-500 hover:text-white">
                         <Download size={16} />
                      </button>
                      <button className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:border-red-500/50 transition-all text-gray-500 hover:text-red-400" onClick={() => setResults({DOCSTRINGS:'',README:'',API_REF:'',DIAGRAM:'',SECURITY:'',PERFORMANCE:'',TESTS:'',QUALITY:''})}>
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>

                {/* NEURAL READOUT AREA */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
                   {!Object.values(results).some(v => v.length > 5) ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                         <div className="w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-[3rem] border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                            <Sparkles size={56} className="text-white opacity-20 animate-shimmer" />
                         </div>
                         <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Neural Buffer Idle</h2>
                         <p className="text-gray-600 max-w-sm text-sm font-bold uppercase tracking-widest leading-loose">Awaiting source-injection to initialize the cognitive sync cycle.</p>
                      </div>
                   ) : (
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-none">
                         {activeTab === 'QUALITY' && <div className="mb-20 flex flex-col items-center justify-center p-16 bg-white/[0.04] rounded-[3rem] border border-white/10 relative">
                            <div className="relative w-56 h-56">
                               <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5"/>
                                  <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="14" fill="transparent" strokeDasharray={628} strokeDashoffset={628 - (628 * score * 10) / 100} strokeLinecap="round" className={`transition-all duration-1000 ease-out drop-shadow-[0_0_15px_currentColor] ${score >= 8 ? 'text-emerald-500' : 'text-blue-500'}`} />
                               </svg>
                               <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-7xl font-black text-white tracking-tighter">{score}</span>
                                  <span className="text-[11px] font-black text-gray-500 tracking-[0.4em] uppercase">Neural Rank</span>
                               </div>
                            </div>
                            <div className="mt-12 flex gap-4">
                               <div className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest">Stability: High</div>
                               <div className="px-6 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-[10px] font-black uppercase tracking-widest text-blue-400">Risk: Minimal</div>
                            </div>
                         </div>}
                         
                         <MarkdownRenderer content={results[activeTab] || 'Synchronizing neural data...'} />
                      </div>
                   )}
                </div>

                {/* Real-time Telemetry HUD */}
                <div className="px-8 py-5 bg-black/40 border-t border-white/5 flex items-center justify-between">
                   <div className="flex gap-8">
                      <div className="flex items-center gap-3">
                         <Activity size={14} className="text-emerald-400" />
                         <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Engine: Live</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Cpu size={14} className="text-blue-400" />
                         <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Llama 3.3.70b</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Vercel Edge Confirmed</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
    </div>
  );
};

export default CodeGenerator;

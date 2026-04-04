import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  ChevronRight, 
  BookOpen, 
  Sparkles,
  Layout,
  Globe,
  Loader2,
  X,
  History,
  Box
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import toast from 'react-hot-toast';

interface Doc {
  id: string;
  title: string;
  content: string;
  category: 'core' | 'api' | 'guide';
}

const DocumentationViewer = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [currentDoc, setCurrentDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(false);
  const [showBrain, setShowBrain] = useState(false);
  const [brainQuery, setBrainQuery] = useState('');
  const [brainResponse, setBrainResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        setDocs(data);
        if (!docId && data.length > 0) {
          navigate('/docs/' + data[0].id);
        }
      } catch (err) {
        toast.error('Neural Index Failure');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [docId, navigate]);

  useEffect(() => {
    if (docId) {
      setDocLoading(true);
      const timer = setTimeout(() => {
        const found = docs.find(d => d.id === docId);
        if (found) {
          setCurrentDoc(found);
        }
        setDocLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [docId, docs]);

  const handleBrainSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brainQuery.trim()) return;
    setIsThinking(true);
    setBrainResponse('');
    
    try {
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: brainQuery })
      });
      const data = await response.json();
      setBrainResponse(data.answer);
    } catch (err) {
      toast.error('Cognitive Fault');
    } finally {
      setIsThinking(false);
    }
  };

  if (loading) return (
     <div className="flex h-screen items-center justify-center bg-[#050a14]">
        <div className="flex flex-col items-center gap-6">
           <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
           <span className="text-[10px] font-black uppercase tracking-[1em] text-gray-500">Initializing Indices</span>
        </div>
     </div>
  );

  return (
    <div className="flex h-[calc(100vh-5rem)] text-white flex-col md:flex-row relative overflow-hidden transition-all duration-700">
      
      {/* LEFT SIDEBAR: NAV STACK */}
      <aside className="w-full md:w-80 flex flex-col border-r border-white/5 glass-card backdrop-blur-3xl z-20 overflow-hidden pt-4">
        <div className="px-6 py-4 flex items-center justify-between">
           <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase flex items-center gap-2">
             <Layout size={12} className="text-amber-500" /> Structure Index
           </h3>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
          <div className="space-y-4">
            {docs.map(d => (
              <div key={d.id} className="group/item">
                    <button 
                      onClick={() => navigate('/docs/' + d.id)}
                      className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                        docId === d.id 
                          ? 'bg-white/5 text-amber-400 border border-white/10 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                          : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {docId === d.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-orange-500 to-amber-600 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                      )}
                      <FileText size={16} className={docId === d.id ? 'text-amber-400' : 'text-gray-500 group-hover/item:text-gray-300'} />
                      <span className="text-[13px] font-bold tracking-tight uppercase">{d.title}</span>
                      {docId === d.id && <Sparkles size={12} className="ml-auto animate-pulse text-amber-500" />}
                    </button>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 bg-white/[0.01]">
           <div className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-700 leading-relaxed mb-4">Neural Data Cluster verified by Vercel Edge</div>
           <div className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-40" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-10" />
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden z-10">
        
        {/* Loading Bar Pulse */}
        <div className={`absolute top-0 inset-x-0 h-0.5 bg-amber-500/10 z-50 transition-all duration-500 ${docLoading ? 'opacity-100' : 'opacity-0'}`}>
           <div className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-500 w-1/3 animate-[shimmer_1.5s_infinite]" />
        </div>

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <div className="max-w-[1000px] mx-auto px-8 md:px-20 py-20">
            {docLoading ? (
               <div className="animate-pulse space-y-12">
                  <div className="h-16 w-2/3 bg-white/5 rounded-2xl" />
                  <div className="space-y-6">
                    <div className="h-4 w-full bg-white/5 rounded-xl" />
                    <div className="h-4 w-5/6 bg-white/5 rounded-xl" />
                    <div className="h-4 w-4/6 bg-white/5 rounded-xl" />
                  </div>
               </div>
            ) : currentDoc ? (
              <article className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-16 opacity-40">
                   <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Core</Link>
                   <ChevronRight size={10} />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] tracking-tighter">{currentDoc.category}</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-16 uppercase">{currentDoc.title}</h1>
                
                <div className="prose prose-invert prose-xl max-w-none text-gray-400 font-medium leading-relaxed
                      prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
                      prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                      prose-code:text-amber-500 prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                ">
                  <MarkdownRenderer content={currentDoc.content} />
                </div>
              </article>
            ) : (
              <div className="h-full flex items-center justify-center">
                 <div className="text-center opacity-20">
                    <BookOpen size={100} className="mx-auto mb-8" />
                    <p className="text-sm font-black uppercase tracking-[1em]">Index Incomplete</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* FLOATING BRAIN CHAT ACTION */}
        <button 
          onClick={() => setShowBrain(true)}
          className="fixed bottom-12 right-12 p-6 rounded-[2.5rem] bg-white text-black shadow-[0_30px_60px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all z-[100] group overflow-hidden"
        >
           <div className="absolute inset-x-0 h-full w-2 bg-gradient-to-b from-orange-500 to-indigo-600 left-0" />
           <div className="flex items-center gap-4">
              <Sparkles className="group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest pr-2">Ask Agent</span>
           </div>
        </button>

        {/* BRAIN MODAL OVERLAY */}
        {showBrain && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={() => setShowBrain(false)} />
              <div className="w-full max-w-3xl glass-card rounded-[3.5rem] border border-white/10 relative z-10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-700">
                  <div className="flex items-center justify-between px-10 py-8 bg-white/[0.02] border-b border-white/5">
                     <div className="flex items-center gap-4">
                        <Sparkles className="text-amber-500" />
                        <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white">Neural Brain Stream</h2>
                     </div>
                     <button onClick={() => setShowBrain(false)} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={32}/></button>
                  </div>

                  <div className="p-12 space-y-12 min-h-[500px]">
                     {brainResponse ? (
                        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
                           <div className="flex items-center gap-3 opacity-20">
                              <History size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{brainQuery}</span>
                           </div>
                           <div className="prose prose-invert max-w-none text-xl leading-relaxed font-medium">
                              {brainResponse}
                           </div>
                           <button onClick={() => { setBrainResponse(''); setBrainQuery(''); }} className="text-[10px] font-black uppercase tracking-widest text-amber-500 border-b border-amber-500/30 hover:border-amber-500 transition-all">New Synthesis Request</button>
                        </div>
                     ) : (
                        <form onSubmit={handleBrainSearch} className="h-full flex flex-col justify-center gap-12">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 ml-2">Neural Input Port</label>
                              <input 
                                autoFocus
                                value={brainQuery} onChange={e => setBrainQuery(e.target.value)}
                                placeholder="Query the cognitive documentation index..."
                                className="w-full bg-white/[0.03] border-none text-3xl md:text-5xl font-black text-white outline-none placeholder:text-gray-800 placeholder:tracking-tighter tracking-tighter leading-tight"
                              />
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 opacity-40">
                                 <Globe size={18} />
                                 <span className="text-[11px] font-black uppercase tracking-widest">Groq Intelligence Cluster v1</span>
                              </div>
                              <button 
                                type="submit" disabled={isThinking}
                                className="px-12 py-5 bg-white text-black rounded-3xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-4"
                              >
                                 {isThinking ? <Loader2 className="animate-spin" /> : <Box size={20} />}
                                 {isThinking ? 'Analyzing' : 'Execute'}
                              </button>
                           </div>
                        </form>
                     )}
                  </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationViewer;

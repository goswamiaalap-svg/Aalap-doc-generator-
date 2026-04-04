import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Loader2, 
  Sparkles, 
  Send, 
  FileText, 
  ChevronRight, 
  Clock,
  Layout,
  MessageSquare,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { DOCS } from '../data/docs';
import toast from 'react-hot-toast';

interface Heading { level: number; title: string; id: string; }
interface DocItem { id: string; title: string; headings?: Heading[] }

export default function DocumentationViewer() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const [db, setDb] = useState<DocItem[]>([]);
  const [currentDocContent, setCurrentDocContent] = useState('');
  const [docLoading, setDocLoading] = useState(false);

  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role:string, content:string}[]>([]);
  const [qaResponse, setQaResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfChatRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize sidebar DB natively
  useEffect(() => {
    const data = Object.keys(DOCS).map(key => ({ id: key, title: DOCS[key].title }));
    setDb(data);
    if (!docId && data.length > 0) {
       navigate('/docs/' + data[0].id, { replace: true });
    }
  }, [docId, navigate]);

  // Load Markdown content natively from store
  useEffect(() => {
    if (!docId) return;
    const documentData = DOCS[docId];
    if (!documentData) {
       setCurrentDocContent('> **Error**: Page could not be found.');
       return;
    }
    
    setDocLoading(true);
    // Simulate slight network delay for premium feel
    const timer = setTimeout(() => {
      setCurrentDocContent(documentData.content);
      // Generate AST Headings dynamically for sidebar subset
      const lines = documentData.content.split('\n');
      const h: Heading[] = [];
      lines.forEach(line => {
         if (line.startsWith('## ') || line.startsWith('### ')) {
            const level = line.startsWith('### ') ? 3 : 2;
            const title = line.replace(/^#{2,3}\s/, '');
            h.push({ level, title, id: title.toLowerCase().replace(/\s+/g, '-') });
         }
      });
      setDb(prev => prev.map(d => d.id === docId ? { ...d, headings: h } : d));
      setDocLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [docId]);

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaResponse, chatHistory]);

  const handleSearch = async (e?: React.FormEvent, directQuery?: string) => {
    e?.preventDefault();
    const q = directQuery || query;
    if (!q.trim()) return;
    if (loading) abortControllerRef.current?.abort();
    
    setChatHistory(prev => [...prev, { role: 'user', content: q }]);
    setQuery('');
    setLoading(true);
    setQaResponse('');

    abortControllerRef.current = new AbortController();

    try {
      const docs_context = db.map(d => ({
         filename: d.title + '.md',
         content: DOCS[d.id]?.content || ('Reference for ' + d.title),
         last_updated: new Date().toISOString().split('T')[0]
      }));

      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          input_mode: 'qa',
          question: q,
          docs_context,
          conversation_history: chatHistory.length > 0 ? chatHistory : undefined,
          qa_flags: { cite_sources: true, suggest_pages: true, follow_up_prompts: true, audience: 'dev' }
        })
      });

      if (!response.ok) throw new Error("Backend Error");
      if (!response.body) throw new Error('No stream available.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              if(data.error) throw new Error(data.error);
              buffer += data.text;
              
              let cleanRender = buffer
                .replace(/---DOCGEN:ANSWER---/g, '')
                .replace(/---DOCGEN:SOURCES---/g, '\n\n### Sources\n')
                .replace(/---DOCGEN:SUGGESTIONS---/g, '\n\n**Suggested Pages:**\n')
                .replace(/---DOCGEN:FOLLOWUP---/g, '\n\n### Ask me next:\n');
              setQaResponse(cleanRender);
            } catch(e) {}
          }
        }
      }
      setChatHistory(prev => [...prev, { role: 'assistant', content: buffer }]);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast.error("AI Search failed.");
        setChatHistory(prev => [...prev, { role: 'assistant', content: '> **System Error**: Backend offline or unavailable.' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-[#020617] text-white flex-col md:flex-row relative overflow-hidden transition-all duration-700">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* LEFT SIDEBAR: NAV STACK */}
      <aside className="w-full md:w-80 flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl z-20 overflow-hidden pt-4">
        <div className="p-6 border-b border-white/5">
           <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase flex items-center gap-2">
             <Layout size={12} className="text-blue-500" /> Structure Index
           </h3>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
           <ul className="space-y-2">
              {db.map(d => (
                <li key={d.id} className="group/item">
                   <button 
                     onClick={() => navigate('/docs/' + d.id)}
                     className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                       docId === d.id 
                         ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                         : 'text-gray-500 hover:text-white hover:bg-white/5'
                     }`}
                   >
                     {docId === d.id && (
                       <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                     )}
                     <FileText size={16} className={docId === d.id ? 'text-blue-400' : 'text-gray-500 group-hover/item:text-gray-300'} />
                     <span className="text-[13px] font-bold tracking-tight uppercase">{d.title}</span>
                     {docId === d.id && <Sparkles size={12} className="ml-auto animate-pulse text-blue-500" />}
                   </button>

                   <div className={`overflow-hidden transition-all duration-500 ${docId === d.id ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                     {d.headings && d.headings.length > 0 && (
                        <ul className="ml-6 space-y-1 py-2 border-l border-white/5">
                           {d.headings.map((h, i) => (
                             <li 
                               key={i} 
                               className="text-[11px] font-bold text-gray-400 pl-4 py-2 hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-2 group/h"
                               style={{ marginLeft: ((h.level - 2) * 4) + 'px' }}
                             >
                                <ChevronRight size={10} className="text-white/10 group-hover/h:text-blue-500" />
                                <span className="truncate">{h.title}</span>
                             </li>
                           ))}
                        </ul>
                     )}
                   </div>
                </li>
              ))}
           </ul>
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 bg-black/40">
           <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                 US
              </div>
              <div>
                 <p className="text-[11px] font-black uppercase tracking-widest text-white leading-none">Standard User</p>
                 <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Free Neural Tier</p>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden z-10">
        
        {/* Loading Bar Pulse */}
        <div className={`absolute top-0 inset-x-0 h-0.5 bg-blue-500/10 z-50 transition-all duration-500 ${docLoading ? 'opacity-100' : 'opacity-0'}`}>
           <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] w-1/3 animate-[shimmer_1.5s_infinite]" style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)' }} />
        </div>

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
           <div className="flex flex-col xl:flex-row gap-12 p-8 sm:p-12 max-w-[1600px] mx-auto w-full relative min-h-full pb-40">
              
              {/* PRIMARY DOCUMENT AREA */}
              <div className="flex-1 w-full max-w-4xl">
                 {!docLoading ? (
                    <article className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                       <div className="mb-12 flex items-center justify-between">
                          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
                            Neural Sync Active
                          </div>
                          <div className="flex gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Clock size={12}/> v2.4.0</span>
                             <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-blue-500"/> Verified</span>
                          </div>
                       </div>
                       
                       <div className="prose prose-invert prose-blue max-w-none prose-headings:tracking-tighter prose-headings:font-black prose-p:text-gray-300 prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                          <MarkdownRenderer content={currentDocContent} sectionName={docId} />
                       </div>
                    </article>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center p-32 opacity-20">
                       <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                       <p className="text-xs font-black uppercase tracking-[0.5em]">Synthesizing</p>
                    </div>
                 )}
              </div>

              {/* AI SEARCH AGENT PANEL */}
              <div className="w-full xl:w-[400px] flex-shrink-0 flex flex-col pt-12 xl:pt-0">
                 <div className="sticky top-0 bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
                    <h2 className="text-xl font-black mb-8 flex items-center justify-between text-white uppercase tracking-tighter">
                      <div className="flex items-center gap-3">
                         <Sparkles size={20} className="text-blue-400 animate-pulse" /> Neuro Search
                      </div>
                      <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[9px] rounded-full font-black uppercase tracking-widest">Groq-L3</div>
                    </h2>
                    
                    <div className="space-y-6 max-h-[500px] overflow-y-auto no-scrollbar mb-8 px-1">
                      {chatHistory.length === 0 && !loading && !qaResponse && (
                        <div className="text-gray-400 text-xs font-medium p-6 bg-white/5 rounded-2xl border border-white/10 shadow-inner group transition-all hover:bg-white/[0.08]">
                           <div className="flex items-center gap-3 mb-4">
                              <HelpCircle size={16} className="text-indigo-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Interactive Guide</span>
                           </div>
                           Ask me anything about this documentation. I index every file natively and can cite specific module locations instantly.
                           <div className="mt-4 flex flex-wrap gap-2">
                              {['API endpoints?', 'How to install?', 'Visual themes?'].map(t => (
                                <button key={t} onClick={() => setQuery(t)} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-blue-400 transition-all text-[9px] font-black uppercase">
                                   {t}
                                </button>
                              ))}
                           </div>
                        </div>
                      )}

                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                              msg.role === 'user' 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg ml-6 font-bold' 
                                : 'bg-white/5 border border-white/10 text-gray-200'
                            }`}>
                              {msg.role === 'user' ? (
                                <div className="flex items-center gap-2"><MessageSquare size={14}/> {msg.content}</div>
                              ) : (
                                <div className="prose prose-invert prose-sm"><MarkdownRenderer content={msg.content.replace(/---DOCGEN[:A-Z_]+---/g,'')} /></div>
                              )}
                            </div>
                        </div>
                      ))}

                      {(loading || qaResponse) && chatHistory.length > 0 && chatHistory[chatHistory.length-1].role === 'user' && (
                        <div className="animate-in fade-in duration-300">
                          <div className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 text-gray-200 relative shadow-2xl">
                            {loading && !qaResponse && (
                               <div className="flex items-center gap-3 mb-4">
                                  <Loader2 size={16} className="text-blue-500 animate-spin" />
                                  <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Reasoning...</span>
                               </div>
                            )}
                            <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300">
                               <MarkdownRenderer content={qaResponse || ''} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={endOfChatRef} className="h-4" />
                    </div>

                    {/* Chat Input Inside Panel */}
                    <form onSubmit={e => handleSearch(e)} className="relative group">
                       <input 
                         type="text" 
                         placeholder="Neural query..." 
                         value={query} 
                         onChange={e => setQuery(e.target.value)} 
                         disabled={loading}
                         className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-xs font-bold uppercase tracking-wider outline-none focus:border-blue-500 focus:bg-black transition-all shadow-xl placeholder:text-gray-600"
                       />
                       <button 
                         type="submit" 
                         disabled={!query.trim() || loading} 
                         className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-90 disabled:opacity-30"
                       >
                         {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                       </button>
                    </form>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* MOBILE BAR (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 z-[100] bg-black/80 backdrop-blur-2xl border-t border-white/10">
         <form onSubmit={e => handleSearch(e)} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 px-4">
            <Search size={18} className="text-gray-500" />
            <input 
               type="text" 
               placeholder="Neuro query..." 
               value={query} 
               onChange={e => setQuery(e.target.value)} 
               className="flex-1 bg-transparent py-3 text-xs font-bold uppercase outline-none" 
            />
            <button type="submit" className="p-2 bg-blue-600 rounded-xl text-white"><Send size={16}/></button>
         </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  BookOpen, 
  Share2,
  Download,
  Settings,
  Activity,
  Zap
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import TiltCard from '../components/TiltCard';

interface Doc {
  id: string;
  title: string;
  content: string;
  category: 'core' | 'api' | 'guide';
}

const DocumentationViewer = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [currentDoc, setCurrentDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(false);
  const { ref: revealRef, inView: contentInView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        setDocs(data);
        if (!docId && data.length > 0) navigate('/docs/' + data[0].id);
      } catch (err) {
        toast.error('NEURAL INDEX FAILURE');
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
        if (found) setCurrentDoc(found);
        setDocLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [docId, docs]);

  if (loading) return null;

  return (
    <div className="flex-1 flex flex-col h-full relative z-10 transition-all duration-700 animate-in fade-in duration-1000">
      
      {/* LOADING PULSE BAR */}
      <div className={`absolute top-0 inset-x-0 h-0.5 bg-indigo-500/10 z-50 transition-all duration-500 ${docLoading ? 'opacity-100' : 'opacity-0'}`}>
         <div className="h-full bg-gradient-to-r from-[#6366f1] via-white to-[#06b6d4] w-1/3 animate-[shimmer_1.5s_infinite]" />
      </div>

      <div className="flex-1 overflow-y-auto w-full custom-scrollbar" ref={revealRef}>
        <div className="max-w-[1100px] mx-auto px-8 md:px-20 py-20">
          
          <TiltCard maxTilt={2}>
             <div className={`glass-card rounded-[3.5rem] p-12 md:p-24 transition-all duration-1000 transform ${contentInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
                
                {/* STATUS BAR: NEURAL FLOW */}
                <div className="flex items-center gap-8 mb-20">
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#22c55e]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]" />
                      <span>NEURAL SYNC ACTIVE</span>
                   </div>
                   <div className="px-4 py-1.5 bg-white/[0.04] rounded-lg text-[10px] font-black uppercase tracking-widest text-white/50 border border-white/5 shadow-inner">v2.4.0</div>
                   <div className="px-4 py-1.5 border border-[#22c55e]/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#22c55e] flex items-center gap-3">
                      <Zap size={12} className="fill-[#22c55e]" /> VERIFIED
                   </div>
                </div>

                {docLoading ? (
                   <div className="animate-pulse space-y-20">
                      <div className="h-24 w-2/3 bg-white/5 rounded-3xl" />
                      <div className="space-y-8">
                        <div className="h-6 w-full bg-white/5 rounded-2xl" />
                        <div className="h-6 w-5/6 bg-white/5 rounded-2xl" />
                        <div className="h-6 w-4/6 bg-white/5 rounded-2xl" />
                        <div className="h-[200px] w-full bg-white/5 rounded-3xl" />
                      </div>
                   </div>
                ) : currentDoc ? (
                  <article className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    
                    {/* BREADCRUMB */}
                    <div className="flex items-center gap-4 mb-20 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                       <Link to="/" className="hover:text-indigo-400 transition-colors">PROTOCOL</Link>
                       <ChevronRight size={12} />
                       <span className="text-white/60">{currentDoc.category}</span>
                       <ChevronRight size={12} />
                       <span className="logo-gradient">{currentDoc.id}</span>
                    </div>
                    
                    {/* HEADER: TITLE + FLOATING ACTION */}
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-20 border-b border-indigo-500/10 pb-20">
                       <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent uppercase flex-1 max-w-4xl mr-4">
                         {currentDoc.title}
                       </h1>
                       
                       <div className="flex gap-4">
                          {[Share2, Download, Settings].map((Icon, i) => (
                            <button key={i} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl text-white/40 hover:bg-white/[0.08] hover:border-indigo-500/50 hover:text-white hover:scale-110 active:scale-95 hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all">
                               <Icon size={20} />
                            </button>
                          ))}
                       </div>
                    </div>
                    
                    {/* BODY: PREMIUM MARKDOWN RENDER */}
                    <div className="prose prose-invert prose-2xl max-w-none text-white/60 font-medium leading-[2.2]
                          prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:mt-24 prose-headings:mb-12
                          prose-h2:text-4xl prose-h2:flex prose-h2:flex-col prose-h2:gap-4
                          prose-h2:before:content-[''] prose-h2:before:w-10 prose-h2:before:h-1 prose-h2:before:bg-gradient-to-r prose-h2:before:from-[#6366f1] prose-h2:before:to-[#06b6d4] prose-h2:before:shadow-[0_0_12px_#6366f1]
                          prose-a:text-[#06b6d4] prose-a:no-underline hover:prose-a:underline hover:prose-a:text-indigo-400
                          prose-strong:text-white prose-strong:font-black
                          prose-code:text-[#06b6d4] prose-code:bg-black/80 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-black prose-code:before:content-none prose-code:after:content-none
                          prose-pre:bg-black/90 prose-pre:border prose-pre:border-indigo-500/20 prose-pre:rounded-[2rem] prose-pre:p-12 prose-pre:shadow-[0_0_40px_rgba(99,102,241,0.15)]
                          prose-table:border-separate prose-table:border-spacing-0 prose-table:rounded-[2rem] prose-table:overflow-hidden prose-table:border prose-table:border-white/5
                          prose-thead:bg-indigo-500/15 prose-thead:text-xs prose-thead:font-black prose-thead:uppercase prose-thead:tracking-widest
                          prose-tr:border-b prose-tr:border-white/5
                          prose-td:py-8 prose-td:px-10 prose-td:text-sm prose-td:font-black prose-td:uppercase prose-td:tracking-widest
                    ">
                      <MarkdownRenderer content={currentDoc.content} />
                    </div>
                  </article>
                ) : (
                  <div className="h-[400px] flex items-center justify-center opacity-10">
                     <div className="text-center">
                        <BookOpen size={120} className="mx-auto mb-10" />
                        <h2 className="text-xs font-black uppercase tracking-[1em]">INDEX INCOMPLETE</h2>
                     </div>
                  </div>
                )}
             </div>
          </TiltCard>
          
          {/* BOTTOM FOOTER NAVIGATION */}
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 opacity-40">
             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em]">
                <Activity size={16} />
                <span>NEURAL FLOW INDEXED AT EDGE V8</span>
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.4em]">DEPLOYED BY VERCEL AUTOMATION</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;

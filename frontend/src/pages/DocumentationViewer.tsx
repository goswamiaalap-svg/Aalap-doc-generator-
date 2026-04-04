import { useState, useEffect } from 'react';
import { 
  Share2, 
  Download,
  Zap,
  MoreVertical
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
  const [docs, setDocs] = useState<Doc[]>([]);
  const [currentDoc, setCurrentDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        setDocs(data);
        if (!docId && data.length > 0) navigate('/docs/' + data[0].id);
      } catch (err) {
        toast.error('NEURAL INDEX ERROR');
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
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [docId, docs]);

  if (loading) return null;

  return (
    <div className="flex-1 flex flex-col h-full relative z-10 animate-fade-up bg-transparent selection:bg-indigo-500/30">
      
      {/* LOADING BAR */}
      <div className={`absolute top-0 inset-x-0 h-[2.5px] bg-[#7c3aed]/10 z-[100] transition-opacity duration-300 ${docLoading ? 'opacity-100' : 'opacity-0'}`}>
         <div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] w-1/3 animate-[shimmer_1.5s_infinite] shadow-[0_0_12px_rgba(124,58,237,0.5)]" />
      </div>

      <div className="flex-1 overflow-y-auto w-full no-scrollbar">
        <div className="max-w-[780px] mx-auto px-8 md:px-12 py-12 md:py-20">
          
          {/* STATUS ROW — FUSIONAI BOLD PILL STYLE */}
          <div className="flex items-center gap-3.5 mb-10">
             <div className="flex items-center gap-1.5 px-3.5 py-1.2 rounded-full bg-green-500/10 border border-green-500/25 text-[10.5px] font-bold text-green-500 tracking-[0.1em] uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                NEURAL SYNC ACTIVE
             </div>
             <div className="px-3 py-1.2 rounded-full bg-white/5 border border-white/10 text-[10.5px] font-bold text-white/30 tracking-[0.05em] uppercase">
                v2.4.0 ALPHA
             </div>
          </div>

          {!currentDoc || docLoading ? (
             <div className="animate-pulse space-y-12">
                <div className="h-14 w-2/3 bg-white/5 rounded-2xl" />
                <div className="space-y-6">
                   <div className="h-4 w-full bg-white/5 rounded-lg" />
                   <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
                   <div className="h-48 w-full bg-white/5 rounded-[2rem]" />
                </div>
             </div>
          ) : (
            <article className="animate-fade-up">
              
              {/* PAGE TITLE ROW — FUSIONAI EXACT SPACING/FONT-SIZE */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                 <h1 className="text-[44px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.05] text-white">
                   {currentDoc.title}
                 </h1>
                 <div className="flex gap-2.5 shrink-0">
                    {[Share2, Download, MoreVertical].map((Icon, i) => (
                      <button key={i} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/35 hover:bg-white/[0.08] hover:text-white transition-all active:scale-90 outline-none backdrop-blur-md">
                         <Icon size={16} />
                      </button>
                    ))}
                 </div>
              </div>

              {/* BODY: FUSIONAI CONTENT RENDER (TRANSPARENT BACKGROUND) */}
              <div className="prose prose-invert max-w-none 
                    text-[15.5px] text-white/60 leading-[1.85] font-medium
                    prose-headings:text-white prose-headings:font-bold prose-headings:tracking-[-0.02em]
                    prose-h2:text-[24px] prose-h2:font-bold prose-h2:mt-14 prose-h2:mb-5
                    prose-h3:text-[18px] prose-h3:font-bold prose-h3:text-white/85 prose-h3:mt-10 prose-h3:mb-4
                    prose-a:text-[#a78bfa] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-bold
                    
                    prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/[0.07] prose-pre:rounded-[1.5rem] prose-pre:p-7 prose-pre:mt-8 prose-pre:mb-8 backdrop-blur-sm
                    prose-code:text-white/85 prose-code:bg-transparent prose-code:p-0 prose-code:font-['JetBrains_Mono'] prose-code:text-[13.5px] prose-code:before:content-none prose-code:after:content-none
                    
                    prose-table:w-full prose-table:border prose-table:border-white/[0.06] prose-table:rounded-2xl prose-table:overflow-hidden prose-table:my-8 backdrop-blur-sm
                    prose-thead:bg-white/[0.03] prose-thead:text-[11px] prose-thead:text-white/30 prose-thead:uppercase prose-thead:tracking-[0.1em]
                    prose-th:px-5 prose-th:py-4 prose-th:font-black
                    prose-td:px-5 prose-td:py-4 prose-td:border-t prose-td:border-white/[0.05] prose-td:text-[14px] prose-td:text-white/50
                    
                    prose-blockquote:border-l-[3.5px] prose-blockquote:border-[#7c3aed]/40 prose-blockquote:bg-[#7c3aed]/5 prose-blockquote:rounded-r-2xl prose-blockquote:px-7 prose-blockquote:py-5 prose-blockquote:my-8 prose-blockquote:text-white/50 prose-blockquote:italic
              ">
                <MarkdownRenderer content={currentDoc.content} />
              </div>
            </article>
          )}

          {/* BOTTOM FOOTER — FUSIONAI MINIMAL */}
          <div className="mt-28 pt-10 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-6 opacity-30">
             <div className="text-[10px] font-bold tracking-[0.12em] uppercase flex items-center gap-2.5">
                <Zap size={14} className="text-[#a78bfa]" />
                Neural Documentation Engine v2.4.0 Alpha
             </div>
             <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/50">Vercel Edge Global Priority</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;

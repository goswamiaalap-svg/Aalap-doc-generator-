import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  BookOpen, 
  Share2,
  Download,
  Settings,
  Zap,
  MoreVertical,
  Check
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    <div className="flex-1 flex flex-col h-full relative z-10 transition-all duration-700 animate-fade-up">
      
      {/* LOADING BAR */}
      <div className={`absolute top-0 inset-x-0 h-[2px] bg-indigo-500/10 z-[100] transition-opacity duration-300 ${docLoading ? 'opacity-100' : 'opacity-0'}`}>
         <div className="h-full bg-indigo-500 w-1/3 animate-[shimmer_1s_infinite] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
      </div>

      <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
        <div className="max-w-[780px] mx-auto px-8 md:px-12 py-10 md:py-16">
          
          {/* STATUS ROW */}
          <div className="flex items-center gap-3 mb-8">
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[11px] font-medium text-green-500 tracking-[0.08em] uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                NEURAL SYNC ACTIVE
             </div>
             <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/45 tracking-tight">
                v2.4.0
             </div>
          </div>

          {!currentDoc || docLoading ? (
             <div className="animate-pulse space-y-12">
                <div className="h-12 w-2/3 bg-white/5 rounded-xl" />
                <div className="space-y-6">
                  <div className="h-4 w-full bg-white/5 rounded-lg" />
                  <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
                  <div className="h-32 w-full bg-white/5 rounded-2xl" />
                </div>
             </div>
          ) : (
            <article className="animate-fade-up">
              
              {/* PAGE TITLE ROW */}
              <div className="flex items-start justify-between gap-8 mb-6">
                 <h1 className="text-[42px] font-bold tracking-[-0.02em] leading-[1.15] text-white">
                   {currentDoc.title}
                 </h1>
                 <div className="flex gap-2.5 shrink-0 pt-2">
                    {[Share2, Download, MoreVertical].map((Icon, i) => (
                      <button key={i} className="w-9 h-9 flex items-center justify-center rounded-[9px] bg-white/5 border border-white/10 text-white/50 hover:bg-white/[0.09] hover:text-white hover:border-white/15 transition-all outline-none active:scale-95">
                         <Icon size={16} />
                      </button>
                    ))}
                 </div>
              </div>

              {/* BODY: FUSIONAI CONTENT RENDER */}
              <div className="prose prose-invert max-w-none 
                    text-[15px] text-white/65 leading-[1.8]
                    prose-headings:text-white prose-headings:font-bold prose-headings:tracking-[-0.01em]
                    prose-h2:text-[22px] prose-h2:font-[650] prose-h2:mt-10 prose-h2:mb-3.5
                    prose-h3:text-[17px] prose-h3:font-semibold prose-h3:text-white/85 prose-h3:mt-8 prose-h3:mb-2.5
                    prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white/90 prose-strong:font-bold
                    
                    prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/[0.08] prose-pre:rounded-xl prose-pre:p-6 prose-pre:mt-5 prose-pre:mb-5 
                    prose-code:text-white/85 prose-code:bg-transparent prose-code:p-0 prose-code:font-['JetBrains_Mono'] prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none
                    
                    prose-table:w-full prose-table:border prose-table:border-white/[0.07] prose-table:rounded-xl prose-table:overflow-hidden prose-table:my-6
                    prose-thead:bg-white/5 prose-thead:text-[12px] prose-thead:text-white/45 prose-thead:uppercase prose-thead:tracking-[0.07em]
                    prose-th:px-4 prose-th:py-3 prose-th:font-medium
                    prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-white/[0.05] prose-td:text-[14px] prose-td:text-white/65
                    
                    prose-blockquote:border-l-[3px] prose-blockquote:border-indigo-500/50 prose-blockquote:bg-indigo-500/5 prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-3.5 prose-blockquote:my-5 prose-blockquote:text-white/60 prose-blockquote:italic
              ">
                <MarkdownRenderer content={currentDoc.content} />
              </div>
            </article>
          )}

          {/* BOTTOM FOOTER */}
          <div className="mt-20 pt-8 border-t border-white/[0.05] flex items-center justify-between opacity-30">
             <div className="text-[11px] font-medium tracking-[0.08em] uppercase flex items-center gap-2">
                <Zap size={13} />
                Neural Documentation Engine v2.4.0
             </div>
             <div className="text-[11px] tracking-[0.08em] uppercase">Vercel Edge Priority</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;

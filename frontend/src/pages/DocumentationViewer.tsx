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
        toast.error('INDEX FAILURE');
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
    <div className="flex-1 flex flex-col h-full relative z-10 animate-apple-in bg-[#ffffff] selection:bg-blue-500/10">
      
      {/* 🍏 APPLE LIGHT LOADING BAR */}
      <div className={`absolute top-0 inset-x-0 h-[2px] bg-black/[0.03] z-[100] transition-opacity duration-300 ${docLoading ? 'opacity-100' : 'opacity-0'}`}>
         <div className="h-full bg-black w-1/3 animate-[shimmer_1.5s_infinite]" />
      </div>

      <div className="flex-1 overflow-y-auto w-full no-scrollbar">
        <div className="max-w-[800px] mx-auto px-8 md:px-16 py-16 md:py-24">
          
          {/* STATUS ROW — 🍏 APPLE SOBRIETY PILLS */}
          <div className="flex items-center gap-3 mb-12">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-[10px] font-bold text-emerald-600 tracking-[0.06em] uppercase">
                Active
             </div>
             <div className="px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.04] text-[10px] font-bold text-black/30 tracking-[0.05em] uppercase">
                Architecture v2.4
             </div>
          </div>

          {!currentDoc || docLoading ? (
             <div className="animate-pulse space-y-12">
                <div className="h-16 w-3/4 bg-black/[0.03] rounded-2xl" />
                <div className="space-y-6">
                   <div className="h-4 w-full bg-black/[0.03] rounded-lg" />
                   <div className="h-4 w-5/6 bg-black/[0.03] rounded-lg" />
                   <div className="h-64 w-full bg-black/[0.03] rounded-3xl" />
                </div>
             </div>
          ) : (
            <article className="animate-apple-in">
              
              {/* PAGE TITLE ROW — 🍏 APPLE TYPOGRAPHY SOBRIETY */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-12">
                 <h1 className="text-[48px] md:text-[56px] font-bold tracking-[-0.04em] leading-[1.05] text-[#1d1d1f]">
                   {currentDoc.title}
                 </h1>
                 <div className="flex gap-2 shrink-0">
                    {[Share2, Download, MoreVertical].map((Icon, i) => (
                      <button key={i} className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/[0.03] border border-black/[0.05] text-black/20 hover:bg-black/[0.06] hover:text-black/60 transition-all active:scale-95">
                         <Icon size={15} />
                      </button>
                    ))}
                 </div>
              </div>

              {/* BODY: 🍏 APPLE LIGHT CONTENT RENDER (BLACK TEXT) */}
              <div className="prose prose-stone max-w-none 
                    text-[16px] text-black/60 leading-[1.85] font-medium
                    prose-headings:text-[#1d1d1f] prose-headings:font-bold prose-headings:tracking-tight
                    prose-h2:text-[24px] prose-h2:mt-16 prose-h2:mb-6
                    prose-h3:text-[19px] prose-h3:mt-10 prose-h3:mb-4
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-black
                    
                    prose-pre:bg-[#f5f5f7] prose-pre:border prose-pre:border-black/[0.04] prose-pre:rounded-2xl prose-pre:p-8 prose-pre:mt-10 prose-pre:mb-10
                    prose-code:text-black prose-code:bg-transparent prose-code:font-['JetBrains_Mono'] prose-code:text-[14px]
                    
                    prose-blockquote:border-l-4 prose-blockquote:border-black/10 prose-blockquote:bg-black/[0.02] prose-blockquote:rounded-r-2xl prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:my-10 prose-blockquote:text-black/50
              ">
                <MarkdownRenderer content={currentDoc.content} />
              </div>
            </article>
          )}

          {/* BOTTOM FOOTER SYNC */}
          <div className="mt-40 pt-10 border-t border-black/[0.04] flex flex-col sm:flex-row items-center justify-between gap-6 opacity-30">
             <div className="text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-2.5">
                <Zap size={14} className="text-black" />
                HGM-06 LABS — NEURAL ARCHIVE PROTOCOL
             </div>
             <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/50">EDGE SYNC: GLOBAL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;

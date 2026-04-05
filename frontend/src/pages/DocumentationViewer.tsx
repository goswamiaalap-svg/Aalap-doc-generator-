import { useState, useEffect } from 'react';
import { 
  Share2, 
  Download,
  MoreVertical,
  Zap
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
        toast.error('MANIFEST FAILURE');
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
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [docId, docs]);

  if (loading) return null;

  return (
    <div className="flex-1 flex flex-col h-full relative z-10 animate-apple-fade bg-[#ffffff] selection:bg-[#0071e3]/10">
      
      {/* 🍏 APPLE LOADING BAR (ULTRA SLIM) */}
      <div className={`absolute top-0 inset-x-0 h-[3px] bg-black/[0.03] z-[100] transition-opacity duration-300 ${docLoading ? 'opacity-100' : 'opacity-0'}`}>
         <div className="h-full bg-[#0071e3] w-1/4 animate-[shimmer_1.5s_infinite]" />
      </div>

      <div className="flex-1 overflow-y-auto w-full no-scrollbar">
        <div className="max-w-[850px] mx-auto px-10 md:px-20 py-20 md:py-32">
          
          {/* CATEGORY ALPHA BADGE — 🍏 APPLE PRO BADGE */}
          <div className="flex items-center gap-4 mb-16 animate-apple-slide">
             <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0071e3]/5 border border-[#0071e3]/10 text-[11px] font-bold text-[#0071e3] tracking-[0.14em] uppercase">
                Active Protocol
             </div>
             <div className="px-4 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.03] text-[11px] font-bold text-black/35 tracking-[0.1em] uppercase">
                v2.4 Pro Arch
             </div>
          </div>

          {!currentDoc || docLoading ? (
             <div className="animate-pulse space-y-16">
                <div className="h-20 w-3/4 bg-black/[0.03] rounded-3xl" />
                <div className="space-y-8">
                   <div className="h-5 w-full bg-black/[0.02] rounded-full" />
                   <div className="h-5 w-5/6 bg-black/[0.02] rounded-full" />
                   <div className="h-[400px] w-full bg-black/[0.03] rounded-[32px]" />
                </div>
             </div>
          ) : (
            <article className="animate-apple-slide">
              
              {/* PAGE TITLE — APPLE CRYSTAL TYPOGRAPHY */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 border-b border-black/[0.06] pb-16">
                 <h1 className="text-[52px] md:text-[84px] font-bold tracking-[-0.055em] leading-[0.96] text-[#1d1d1f] max-w-[600px]">
                   {currentDoc.title}.
                 </h1>
                 <div className="flex gap-4 shrink-0 mb-4">
                    {[Share2, Download, MoreVertical].map((Icon, i) => (
                      <button key={i} className="w-11 h-11 flex items-center justify-center rounded-full bg-black/[0.03] border border-black/[0.04] text-black/25 hover:bg-[#0071e3]/5 hover:text-[#0071e3] transition-all hover:scale-105 active:scale-95">
                         <Icon size={17} strokeWidth={1.5} />
                      </button>
                    ))}
                 </div>
              </div>

              {/* BODY: APPLE PROSE CONTENT (PURE BLACK & CHARCOAL) */}
              <div className="prose prose-stone max-w-none 
                    text-[19px] text-[#1d1d1f]/75 leading-[1.8] font-medium
                    prose-headings:text-[#1d1d1f] prose-headings:font-bold prose-headings:tracking-tighter
                    prose-h2:text-[32px] prose-h2:mt-24 prose-h2:mb-10 prose-h2:border-b prose-h2:border-black/[0.06] prose-h2:pb-4
                    prose-h3:text-[24px] prose-h3:mt-16 prose-h3:mb-6
                    prose-a:text-[#0071e3] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-black prose-strong:font-bold
                    
                    prose-pre:bg-[#f5f5f7] prose-pre:border-none prose-pre:rounded-[24px] prose-pre:p-12 prose-pre:mt-14 prose-pre:mb-14 shadow-sm
                    prose-code:text-black prose-code:bg-transparent prose-code:font-mono prose-code:text-[16px] prose-code:tracking-tighter
                    
                    prose-blockquote:border-l-[5px] prose-blockquote:border-[#0071e3]/30 prose-blockquote:bg-[#f5f5f7]/50 prose-blockquote:rounded-r-[20px] prose-blockquote:px-10 prose-blockquote:py-8 prose-blockquote:my-14 prose-blockquote:text-[#1d1d1f]/50 prose-blockquote:italic prose-blockquote:font-medium
              ">
                <MarkdownRenderer content={currentDoc.content} />
              </div>
            </article>
          )}

          {/* BOTTOM FOOTER SYNC (APPLE MINIMALIST) */}
          <div className="mt-60 pt-20 border-t border-black/[0.1] flex flex-col sm:flex-row items-center justify-between gap-10 opacity-35 hover:opacity-100 transition-opacity">
             <div className="text-[12px] font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                <Zap size={20} className="text-[#0071e3]" fill="#0071e3" strokeWidth={0} />
                HGM-06 LABS — NEURAL ARCHIVE STAGE
             </div>
             <div className="text-[12px] font-bold tracking-[0.15em] text-black/50 uppercase">GLOBAL EDGE DISTRIBUTION ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;

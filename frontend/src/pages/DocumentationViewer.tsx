import { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Download,
  MoreVertical,
  Zap,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Printer,
  FileCode,
  Sparkles,
  Command,
  Layout as LayoutIcon,
  Search
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
  const [readingProgress, setReadingProgress] = useState(0);
  const [toc, setToc] = useState<{id: string, text: string, level: number}[]>([]);
  
  const contentRef = useRef<HTMLDivElement>(null);

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
        if (found) {
          setCurrentDoc(found);
          // 🍏 GENERATE TABLE OF CONTENTS (PRO FEATURE)
          const headers = found.content.match(/^#{2,3} (.*$)/gim) || [];
          setToc(headers.map(h => ({
            id: h.replace(/^#{2,3} /, '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
            text: h.replace(/^#{2,3} /, ''),
            level: h.startsWith('###') ? 3 : 2
          })));
        }
        setDocLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [docId, docs]);

  // 🍏 TRACK READING PROGRESS (PRO FEATURE)
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const element = contentRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const progress = (element.scrollTop / totalHeight) * 100;
      setReadingProgress(progress);
    };

    const container = contentRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => { if (container) container.removeEventListener('scroll', handleScroll); };
  }, [currentDoc]);

  if (loading) return null;

  const currentIdx = docs.findIndex(d => d.id === docId);
  const prevDoc = currentIdx > 0 ? docs[currentIdx - 1] : null;
  const nextDoc = currentIdx < docs.length - 1 ? docs[currentIdx + 1] : null;

  return (
    <div className="flex-1 flex h-full relative z-10 animate-apple-fade bg-[#ffffff] selection:bg-[#0071e3]/10 overflow-hidden">
      
      {/* 🍏 PRO TOP PROGRESS BAR (APPLE BLUE) */}
      <div className="fixed top-12 left-0 lg:left-[260px] right-0 h-[2.5px] bg-black/[0.03] z-[100]">
         <div className="h-full bg-[#0071e3] transition-all duration-300 ease-out" style={{ width: `${readingProgress}%` }} />
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto w-full no-scrollbar scroll-smooth">
        <div className="max-w-[1200px] mx-auto px-8 md:px-16 py-16 md:pt-24 md:pb-48 flex flex-col lg:flex-row gap-16 relative">
          
          {/* MAIN ARTICLE AREA */}
          <div className="flex-1 min-w-0 max-w-[800px]">
            {/* CATEGORY NAV — 🍏 APPLE PRO BREADCRUMBS */}
            <div className="flex items-center gap-2 mb-12 opacity-35 hover:opacity-100 transition-opacity">
               <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.12em] hover:text-[#0071e3]">Platform</Link>
               <ChevronRight size={12} strokeWidth={3} />
               <Link to="/docs" className="text-[11px] font-bold uppercase tracking-[0.12em] hover:text-[#0071e3]">Guide</Link>
               <ChevronRight size={12} strokeWidth={3} />
               <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/60 truncate max-w-[120px]">{currentDoc?.title}</span>
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
                
                {/* 🍏 PAGE TITLE & ACTIONS */}
                <div className="flex flex-col gap-10 mb-20">
                   <h1 className="text-[54px] md:text-[84px] font-bold tracking-[-0.055em] leading-[0.96] text-[#1d1d1f]">
                     {currentDoc.title}.
                   </h1>
                   
                   <div className="flex items-center gap-6 border-b border-black/[0.06] pb-10">
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#f5f5f7] flex items-center justify-center text-[10px] font-bold text-black/30">
                               {String.fromCharCode(64+i)}
                            </div>
                         ))}
                      </div>
                      <span className="text-[13px] font-medium text-black/35">HGM Neural Labs Sync Active</span>
                      <div className="flex-1" />
                      <div className="flex gap-2">
                        {[Share2, Download, Printer, MoreVertical].map((Icon, i) => (
                           <button key={i} className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/[0.03] border border-black/[0.04] text-black/25 hover:bg-[#0071e3]/5 hover:text-[#0071e3] transition-all active:scale-95">
                              <Icon size={16} strokeWidth={1.5} />
                           </button>
                        ))}
                      </div>
                   </div>
                </div>

                {/* 🍏 PRO BODY CONTENT (CRISP & LEGIBLE) */}
                <div className="prose prose-stone max-w-none 
                      text-[19px] text-[#1d1d1f]/75 leading-[1.8] font-medium
                      prose-headings:text-[#1d1d1f] prose-headings:font-bold prose-headings:tracking-tighter prose-headings:scroll-mt-32
                      prose-h2:text-[34px] prose-h2:mt-24 prose-h2:mb-10 prose-h2:border-b prose-h2:border-black/[0.06] prose-h2:pb-4
                      prose-h3:text-[24px] prose-h3:mt-16 prose-h3:mb-6
                      prose-a:text-[#0071e3] prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-black prose-strong:font-bold
                      prose-pre:bg-[#f5f5f7] prose-pre:border-none prose-pre:rounded-[28px] prose-pre:p-12 prose-pre:mt-16 prose-pre:mb-16 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]
                      prose-code:text-black prose-code:bg-transparent prose-code:font-mono prose-code:text-[16px] prose-code:tracking-tighter
                      prose-blockquote:border-l-[5px] prose-blockquote:border-[#0071e3]/40 prose-blockquote:bg-[#f5f5f7]/50 prose-blockquote:rounded-r-[24px] prose-blockquote:px-10 prose-blockquote:py-8 prose-blockquote:my-16 prose-blockquote:text-[#1d1d1f]/50 prose-blockquote:italic
                ">
                  <MarkdownRenderer content={currentDoc.content} />
                </div>

                {/* 🍏 PRO NEXT/PREV NAVIGATION (RELATED SYNAPSES) */}
                <div className="mt-48 pt-16 border-t border-black/[0.08] grid grid-cols-1 md:grid-cols-2 gap-8">
                   {prevDoc && (
                     <Link to={`/docs/${prevDoc.id}`} className="group p-8 bg-[#f5f5f7] rounded-[32px] border border-black/[0.02] flex items-center gap-6 hover:bg-white hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black/20 group-hover:text-black transition-colors">
                           <ArrowLeft size={20} strokeWidth={1} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[11px] font-bold text-black/20 uppercase tracking-[0.14em] mb-1">Previous Node</span>
                           <span className="text-[17px] font-bold text-[#1d1d1f] tracking-tight">{prevDoc.title}</span>
                        </div>
                     </Link>
                   )}
                   {nextDoc && (
                     <Link to={`/docs/${nextDoc.id}`} className="group p-8 bg-[#f5f5f7] rounded-[32px] border border-black/[0.02] flex items-center justify-between hover:bg-white hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300">
                        <div className="flex flex-col items-start">
                           <span className="text-[11px] font-bold text-black/20 uppercase tracking-[0.14em] mb-1 text-left">Up Next</span>
                           <span className="text-[17px] font-bold text-[#1d1d1f] tracking-tight text-left">{nextDoc.title}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black/20 group-hover:text-[#0071e3] transition-colors">
                           <ArrowRight size={20} strokeWidth={1} />
                        </div>
                     </Link>
                   )}
                </div>
              </article>
            )}
          </div>

          {/* 🍏 PRO ON-THIS-PAGE NAVIGATION (RIGHT SIDEBAR) */}
          <aside className="hidden xl:block w-[240px] sticky top-24 self-start animate-apple-fade">
             <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                   <h3 className="text-[11px] font-bold tracking-[0.18em] text-black/25 uppercase">On This Page</h3>
                   <nav className="flex flex-col gap-[2px]">
                      {toc.length > 0 ? toc.map(item => (
                        <button 
                          key={item.id} 
                          onClick={() => {
                            const el = document.getElementById(item.id);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`text-left py-2 text-[13.5px] font-medium transition-all border-l-[2px] border-transparent pl-4 hover:text-[#0071e3] hover:border-[#0071e3]/20 ${
                            item.level === 3 ? 'ml-4 opacity-50 text-[12.5px]' : 'opacity-70'
                          }`}
                        >
                           {item.text}
                        </button>
                      )) : (
                        <span className="text-[12px] font-medium text-black/15 italic">Neural scan active...</span>
                      )}
                   </nav>
                </div>
                
                {/* 🍏 ADDITIONAL PRO UTILITIES (APPLE STYLE) */}
                <div className="pt-10 border-t border-black/[0.04] space-y-8">
                   <div className="flex flex-col gap-5">
                      <span className="text-[11px] font-bold tracking-[0.18em] text-black/25 uppercase">Pro Utilities</span>
                      {[
                        { icon: <FileCode size={16} />, label: 'View Source Logic' },
                        { icon: <Sparkles size={16} />, label: 'AI Documentation Audit' },
                        { icon: <Search size={16} />, label: 'Deep Manifest Scan' }
                      ].map(util => (
                        <button key={util.label} className="flex items-center gap-4 text-[13px] font-bold text-black/35 hover:text-[#0071e3] transition-colors group">
                           <span className="opacity-40 group-hover:opacity-100">{util.icon}</span>
                           <span>{util.label}</span>
                        </button>
                      ))}
                   </div>
                   
                   <div className="p-6 bg-[#f5f5f7] rounded-[24px] border border-black/[0.02]">
                      <h4 className="text-[14px] font-bold text-black tracking-tight mb-2">Neural Status</h4>
                      <p className="text-[11px] font-medium text-black/30 leading-relaxed">Stage 4 Decryption active. Global Edge Sync is 100% stable.</p>
                      <div className="mt-4 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
                         <span className="text-[10px] font-bold text-[#34c759] uppercase tracking-widest">Connected</span>
                      </div>
                   </div>
                </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;

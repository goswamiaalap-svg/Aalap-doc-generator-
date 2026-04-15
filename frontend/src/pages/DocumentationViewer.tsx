import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Clock, Share2, Download, Printer, Volume2, Activity, Zap, Sparkles, MessageSquare, Copy 
} from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { docs } from '../api/docs';
import toast from 'react-hot-toast';

const DocumentationViewer: React.FC = () => {
  const { id, docId } = useParams<{ id?: string; docId?: string }>();
  const activeId = docId || id;
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [selectionRange, setSelectionRange] = useState<{ x: number, y: number, text: string } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const docIndex = docs.findIndex((d: any) => d.id === activeId);
  const doc = docIndex !== -1 ? docs[docIndex] : docs[0];
  const prevDoc = docIndex > 0 ? docs[docIndex - 1] : null;
  const nextDoc = docIndex !== -1 && docIndex < docs.length - 1 ? docs[docIndex + 1] : null;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress((currentScrollY / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 5) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionRange({
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + window.scrollY,
          text: selection.toString()
        });
      } else {
        setSelectionRange(null);
      }
    };
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadAloud = () => {
     const speech = new SpeechSynthesisUtterance(doc.content.replace(/[#*`]/g, ''));
     speech.rate = 1.0;
     window.speechSynthesis.speak(speech);
  };

  const handleAIRewrite = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Neural engine rewriting...',
        success: 'Synthesis optimized! (Mock action)',
        error: 'Engine error'
      }
    );
    setSelectionRange(null);
  };

  return (
    <div className="flex-1 flex bg-[#ffffff] relative min-h-screen">
      
      {/* AI SELECTION POPOVER */}
      {selectionRange && (
        <div 
          className="fixed z-[200] -translate-x-1/2 -translate-y-full mb-4 px-1.5 py-1.5 bg-black rounded-2xl shadow-2xl flex items-center gap-1 animate-apple-fade border border-white/20"
          style={{ left: selectionRange.x, top: selectionRange.y }}
        >
          <button onClick={handleAIRewrite} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl text-white text-[12px] font-bold transition-colors">
            <Sparkles size={14} className="text-[#0071e3]" /> AI Rewrite
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button onClick={() => { toast.success('Summarized in memory!'); setSelectionRange(null); }} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl text-white text-[12px] font-bold transition-colors">
            <MessageSquare size={14} className="text-[#34c759]" /> Summarize
          </button>
          <button onClick={() => { navigator.clipboard.writeText(selectionRange.text); toast.success('Text copied'); setSelectionRange(null); }} className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors">
            <Copy size={14} />
          </button>
        </div>
      )}

      {/* 🍏 MAIN CONTENT CORE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* PROGRESS BAR HUD */}
        <div className="fixed top-0 left-0 right-0 h-[3px] bg-black/[0.03] z-[110]">
           <div className="h-full bg-[#0071e3] transition-all duration-300" style={{ width: `${readingProgress}%` }} />
        </div>

        <div className="max-w-[1000px] w-full mx-auto pt-32 pb-60 px-8 md:px-20 animate-apple-fade" ref={contentRef}>
          
          {/* HEADER METADATA OVERLAY */}
          <div className="flex flex-wrap items-center gap-6 mb-16 opacity-40">
            <span className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]"><Zap size={14} fill="currentColor" /> Deep Sync v1.2</span>
            <div className="h-1 w-1 bg-black rounded-full" />
            <span className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]"><Clock size={14} /> 5 Min Read</span>
            <div className="h-1 w-1 bg-black rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{doc.section}</span>
          </div>

          <h1 className="text-5xl md:text-[84px] font-bold tracking-tight leading-[1] text-[#1d1d1f] mb-32 selection:bg-[#0071e3]/10 break-words">
            {doc.title}
          </h1>

          <div className="flex flex-col gap-32">
             <MarkdownRenderer content={doc.content} />
          </div>

          {/* RELATED SYNAPSES — ADVANCED NAVIGATION */}
          <div className="mt-60 pt-20 border-t border-black/[0.06] grid grid-cols-1 md:grid-cols-2 gap-10">
             {prevDoc ? (
                 <Link to={`/docs/${prevDoc.id}`} className="group p-10 bg-[#fbfbfd] border border-black/[0.04] rounded-[56px] hover:bg-white hover:shadow-2xl transition-all duration-500">
                    <span className="text-[10px] font-black text-[#0071e3] uppercase tracking-widest mb-4 block">PREVIOUS MODULE</span>
                    <h4 className="text-[28px] font-bold text-black tracking-tight leading-tight">{prevDoc.title}</h4>
                    <div className="mt-8 flex items-center text-[10px] font-black text-black/30 uppercase tracking-[0.2em] group-hover:text-[#0071e3] transition-colors">
                       <ChevronLeft size={16} className="mr-2" /> Back to {prevDoc.section}
                    </div>
                 </Link>
             ) : <div />}
             {nextDoc ? (
                 <Link to={`/docs/${nextDoc.id}`} className="group p-10 bg-[#fbfbfd] border border-black/[0.04] rounded-[56px] hover:bg-white hover:shadow-2xl transition-all duration-500 text-right items-end flex flex-col">
                    <span className="text-[10px] font-black text-[#ff375f] uppercase tracking-widest mb-4 block">NEXT CHAPTER</span>
                    <h4 className="text-[28px] font-bold text-black tracking-tight leading-tight text-right">{nextDoc.title}</h4>
                    <div className="mt-8 flex items-center text-[10px] font-black text-black/30 uppercase tracking-[0.2em] group-hover:text-[#ff375f] transition-colors">
                       Continue Reading <ChevronRight size={16} className="ml-2" />
                    </div>
                 </Link>
             ) : (
                <div className="group p-10 bg-black rounded-[56px] text-white flex flex-col justify-between h-full">
                   <div>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4 block">CONCLUDED</span>
                      <h4 className="text-[28px] font-bold tracking-tight">Ready to Manifest?</h4>
                   </div>
                   <Link to="/codegen" className="mt-12 flex items-center justify-between px-8 py-5 bg-white text-black rounded-[24px] font-bold text-[14px] hover:scale-105 transition-all">
                      Open Studio <Zap size={16} fill="black" />
                   </Link>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* 🍏 SYSTEMATIC RIGHT TOC — FILLING THE WHITE SPACE */}
      <aside className="hidden xl:flex w-[340px] flex-col border-l border-black/[0.03] sticky top-[10.5rem] h-[calc(100vh-10.5rem)] pt-20 pb-20 px-10 bg-[#fbfbfd]">
         <div className="flex flex-col gap-14">
            <div>
               <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em] mb-8 block">Manifest Index</span>
               <div className="flex flex-col gap-5 border-l-2 border-black/[0.03] pl-8">
                  {doc.content.match(/^## .+/gm)?.map((header: string, i: number) => (
                     <a key={header} href={`#${header.replace('## ', '').toLowerCase().replace(/\s+/g, '-')}`} className="text-[14px] font-medium text-black/35 hover:text-[#0071e3] transition-all leading-tight hover:translate-x-1 inline-block">
                        {header.replace('## ', '')}
                     </a>
                  ))}
               </div>
            </div>
            
            <div className="flex flex-col gap-8">
               <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.25em] block">Synthesis Tools</span>
               <div className="flex flex-col gap-3">
                  {[ 
                    {icon: Volume2, action: handleReadAloud, label: 'Neural Voice'},
                    {icon: Download, action: () => window.print(), label: 'Export PDF'},
                    {icon: Share2, action: handleCopy, label: copied ? 'URL COPIED' : 'Share Link'}
                  ].map((util, i) => (
                    <button key={util.label} onClick={util.action} className="flex items-center gap-4 px-6 py-4 bg-white border border-black/[0.02] rounded-[24px] text-[13px] font-bold text-black group hover:bg-black hover:text-white transition-all shadow-sm">
                       <util.icon size={16} className="text-[#0071e3] group-hover:text-white" strokeWidth={2} />
                       {util.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="p-10 rounded-[48px] bg-black text-white flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-20 transition-opacity">
                  <Activity size={100} strokeWidth={1} />
               </div>
               <div>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest relative z-10 mb-2 block">Neural Integrity</span>
                  <p className="text-[52px] font-bold tracking-tighter relative z-10">9.8</p>
               </div>
               <div className="h-[1px] w-full bg-white/10 relative z-10" />
               <button className="text-[10px] font-black uppercase tracking-widest text-[#0071e3] hover:text-white transition-colors relative z-10 flex items-center gap-3">Run Audit <ChevronRight size={14} /></button>
            </div>
         </div>
      </aside>

      {/* FLOATING ACTION TRAY */}
      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-white/80 backdrop-blur-3xl border border-black/5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] animate-apple-slide`}>
         <button onClick={handleReadAloud} className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-full hover:scale-110 active:scale-95 transition-all outline-none"><Volume2 size={20} /></button>
         <button onClick={handleCopy} className="px-10 h-14 bg-white border border-black/10 rounded-full text-[15px] font-bold hover:bg-black hover:text-white transition-all outline-none">{copied ? 'LINK COPIED' : 'Share Synthesis'}</button>
         <button onClick={() => window.print()} className="w-14 h-14 flex items-center justify-center bg-white border border-black/10 rounded-full hover:bg-black hover:text-white transition-all outline-none"><Printer size={20} /></button>
      </div>

    </div>
  );
};

export default DocumentationViewer;

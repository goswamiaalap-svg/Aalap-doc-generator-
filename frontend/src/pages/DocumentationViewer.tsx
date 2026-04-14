import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Share2, 
  Download, 
  Printer, 
  Volume2, 
  Activity,
  Zap
} from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { docs } from '../api/docs';

const DocumentationViewer: React.FC = () => {
  const { id, docId } = useParams<{ id?: string; docId?: string }>();
  const activeId = docId || id;
  const [copied, setCopied] = useState(false);
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  const docIndex = docs.findIndex((d: any) => d.id === activeId);
  const doc = docIndex !== -1 ? docs[docIndex] : docs[0];
  const prevDoc = docIndex > 0 ? docs[docIndex - 1] : null;
  const nextDoc = docIndex !== -1 && docIndex < docs.length - 1 ? docs[docIndex + 1] : null;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDir(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress((currentScrollY / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadAloud = () => {
     const speech = new SpeechSynthesisUtterance(doc.content.replace(/[#*`]/g, ''));
     speech.rate = 0.95;
     window.speechSynthesis.speak(speech);
  };

  return (
    <div className="flex-1 flex bg-[#ffffff] relative min-h-screen">
      
      {/* 🍏 MAIN CONTENT CORE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* PROGRESS BAR HUD */}
        <div className="fixed top-[48px] left-0 right-0 h-[1.5px] bg-black/[0.03] z-[60]">
           <div className="h-full bg-[#0071e3] transition-all duration-300" style={{ width: `${readingProgress}%` }} />
        </div>

        <div className="max-w-[1000px] w-full mx-auto pt-32 pb-60 px-8 md:px-20 animate-apple-fade">
          
          {/* HEADER METADATA OVERLAY */}
          <div className="flex flex-wrap items-center gap-6 mb-16 opacity-40">
            <span className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]"><Zap size={14} fill="currentColor" /> Verified</span>
            <div className="h-1 w-1 bg-black rounded-full" />
            <span className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]"><Clock size={14} /> 4 Min Read</span>
            <div className="h-1 w-1 bg-black rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">DocGen AI</span>
          </div>

          <h1 className="text-5xl md:text-[80px] font-bold tracking-tight leading-[1] text-[#1d1d1f] mb-32 selection:bg-[#0071e3]/10 break-words">
            {doc.title}
          </h1>

          <div className="flex flex-col gap-32">
             <MarkdownRenderer content={doc.content} />
          </div>

          {/* RELATED SYNAPSES — ADVANCED NAVIGATION */}
          <div className="mt-60 pt-20 border-t border-black/[0.06] grid grid-cols-1 md:grid-cols-2 gap-10">
             {prevDoc ? (
                 <Link to={`/docs/${prevDoc.id}`} className="group p-10 bg-[#f5f5f7] border border-black/[0.02] rounded-[48px] hover:bg-white hover:shadow-2xl transition-all">
                    <span className="text-[10px] font-black text-[#0071e3] uppercase tracking-widest mb-4 block">PREVIOUS</span>
                    <h4 className="text-[24px] font-bold text-black tracking-tight">{prevDoc.title}</h4>
                    <div className="mt-8 flex items-center text-[10px] font-black text-black/30 uppercase tracking-widest group-hover:text-black">
                       <ChevronLeft size={16} /> Back to {prevDoc.section}
                    </div>
                 </Link>
             ) : <div />}
             {nextDoc ? (
                 <Link to={`/docs/${nextDoc.id}`} className="group p-10 bg-[#f5f5f7] border border-black/[0.02] rounded-[48px] hover:bg-white hover:shadow-2xl transition-all text-right items-end flex flex-col">
                    <span className="text-[10px] font-black text-[#ff375f] uppercase tracking-widest mb-4 block">NEXT</span>
                    <h4 className="text-[24px] font-bold text-black tracking-tight text-right">{nextDoc.title}</h4>
                    <div className="mt-8 flex items-center text-[10px] font-black text-black/30 uppercase tracking-widest group-hover:text-black">
                       Continue Reading <ChevronRight size={16} />
                    </div>
                 </Link>
             ) : <div />}
          </div>
        </div>
      </div>

      {/* 🍏 SYSTEMATIC RIGHT TOC — FILLING THE WHITE SPACE */}
      <aside className="hidden xl:flex w-[320px] flex-col border-l border-black/[0.04] sticky top-[48px] h-[calc(100vh-48px)] pt-32 pb-20 px-8">
         <div className="flex flex-col gap-12">
            <div>
               <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em] mb-6 block">In this Synthesis</span>
               <div className="flex flex-col gap-5 border-l border-black/[0.03] pl-6">
                  {doc.content.match(/^## .+/gm)?.map((header: string, i: number) => (
                     <a key={header} href={`#${header.replace('## ', '').toLowerCase().replace(/\s+/g, '-')}`} className="text-[13px] font-bold text-black/30 hover:text-[#0071e3] transition-colors leading-tight">
                        {header.replace('## ', '')}
                     </a>
                  ))}
               </div>
            </div>
            
            <div className="flex flex-col gap-8">
               <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em] block">Sovereign Utilities</span>
               <div className="flex flex-wrap gap-3">
                  {[ 
                    {icon: Volume2, action: handleReadAloud, label: 'Voice Brief'},
                    {icon: Download, action: () => {}, label: 'PDF'},
                    {icon: Share2, action: handleCopy, label: copied ? 'URL COPIED' : 'Share'}
                  ].map((util, i) => (
                    <button key={util.label} onClick={util.action} className="flex items-center gap-4 px-5 py-3.5 bg-[#f5f5f7] rounded-2xl text-[12px] font-bold text-black group hover:bg-black hover:text-white transition-all shadow-sm">
                       <util.icon size={16} strokeWidth={1.5} />
                       {util.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="p-8 rounded-[40px] bg-black text-white flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Activity size={80} strokeWidth={1} />
               </div>
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Neural Rank</span>
               <p className="text-[42px] font-bold tracking-tight relative z-10">9.8</p>
               <div className="h-[1px] w-full bg-white/10 relative z-10" />
               <button className="text-[10px] font-black uppercase tracking-widest text-[#0071e3] hover:text-white transition-colors relative z-10 flex items-center gap-3">Run Full Audit <ChevronRight size={14} /></button>
            </div>
         </div>
      </aside>

      {/* FLOATING ACTION TRAY */}
      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-white/80 backdrop-blur-2xl border border-black/5 rounded-[32px] shadow-2xl z-[100] transition-all duration-700`}>
         <button onClick={handleReadAloud} className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-full hover:scale-110 active:scale-95 transition-all"><Volume2 size={20} /></button>
         <button onClick={handleCopy} className="px-8 h-14 bg-[#f5f5f7] rounded-full text-[14px] font-bold hover:bg-black hover:text-white transition-all">{copied ? 'LINK COPIED' : 'Share Synthesis'}</button>
         <button onClick={() => window.print()} className="w-14 h-14 flex items-center justify-center bg-[#f5f5f7] rounded-full hover:bg-black hover:text-white transition-all"><Printer size={20} /></button>
      </div>

    </div>
  );
};

export default DocumentationViewer;

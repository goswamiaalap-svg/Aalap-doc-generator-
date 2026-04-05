import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import mermaid from 'mermaid';
import { Copy, CheckCircle2, Maximize2, Share2, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

mermaid.initialize({ 
  startOnLoad: false, 
  theme: 'neutral', 
  securityLevel: 'loose',
  fontFamily: 'Inter'
});

export default function MarkdownRenderer({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedMermaid, setRenderedMermaid] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const blocks = containerRef.current.querySelectorAll('pre code');
    blocks.forEach((block) => {
      if (!block.classList.contains('language-mermaid')) hljs.highlightElement(block as HTMLElement);
    });

    const renderMermaidGraphs = async () => {
      const mermaidBlocks = containerRef.current?.querySelectorAll('pre code.language-mermaid');
      if (!mermaidBlocks) return;
      for (let i = 0; i < mermaidBlocks.length; i++) {
        const block = mermaidBlocks[i];
        const graphDefinition = block.textContent || '';
        const id = `mermaid-graph-${Math.random().toString(36).substr(2, 9)}`;
        try {
          const { svg } = await mermaid.render(id, graphDefinition);
          setRenderedMermaid(prev => ({ ...prev, [graphDefinition]: svg }));
        } catch (error) {
          setRenderedMermaid(prev => ({ ...prev, [graphDefinition]: `<div class="text-red-500 p-4 border border-red-500/20 bg-red-500/5 rounded-xl font-mono text-xs">Diagram Error</div>` }));
        }
      }
    };
    renderMermaidGraphs();
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('COPIED');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(content.replace(/[#*`|]/g, ''));
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const generateAnchorId = (text: string) => {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  };

  const parseBlocks = () => {
    const blocks = content.split('```');
    return blocks.map((block, index) => {
      if (index % 2 !== 0) { 
        const lines = block.split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n').trim();

        if (language === 'mermaid' && renderedMermaid[code]) {
          return (
            <div key={index} className="my-12 group/mermaid relative">
               <div className="absolute top-6 right-6 z-10 opacity-0 group-hover/mermaid:opacity-100 transition-opacity">
                  <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-3 bg-white/90 backdrop-blur-xl border border-black/10 rounded-2xl text-black hover:bg-white shadow-xl">
                     <Maximize2 size={16} />
                  </button>
               </div>
               <div 
                 className={`flex justify-center p-12 bg-white/40 border border-black/[0.04] rounded-[40px] shadow-sm transition-all overflow-auto ${isFullscreen ? 'fixed inset-0 z-[1000] bg-white flex items-center justify-center' : ''}`}
                 dangerouslySetInnerHTML={{ __html: renderedMermaid[code] }} 
               />
               {isFullscreen && (
                 <button onClick={() => setIsFullscreen(false)} className="fixed top-10 right-10 z-[1100] apple-btn-primary p-6 rounded-full font-bold uppercase text-[12px]">Close Sync</button>
               )}
            </div>
          );
        }
        return (
          <div key={index} className="relative group/code bg-[#f5f5f7] border border-black/[0.04] rounded-[24px] overflow-hidden my-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between px-6 py-3 bg-black/[0.02] border-b border-black/[0.04]">
               <span className="text-[11px] font-black uppercase tracking-widest text-black/30">{language || 'PRO-LOGIC'}</span>
               <button onClick={() => navigator.clipboard.writeText(code)} className="text-[11px] font-bold uppercase tracking-widest text-[#0071e3] hover:text-[#0077ed]">Copy Code</button>
            </div>
            <pre className="p-8 overflow-x-auto custom-scrollbar"><code className={`language-${language} text-[15px] font-mono leading-relaxed text-[#1d1d1f]`}>{code}</code></pre>
          </div>
        );
      }
      
      const htmlText = block
        // 🍏 ADD ANCHOR IDS FOR PRO TOC NAVIGATION
        .replace(/^## (.*$)/gim, (_, text) => `<h2 id="${generateAnchorId(text)}" class="text-[34px] md:text-[38px] font-bold tracking-tighter text-[#1d1d1f] mt-24 mb-10 border-b border-black/[0.06] pb-6 scroll-mt-32">${text}</h2>`)
        .replace(/^### (.*$)/gim, (_, text) => `<h3 id="${generateAnchorId(text)}" class="text-[24px] font-bold tracking-tight text-[#1d1d1f] mt-16 mb-6 scroll-mt-32">${text}</h3>`)
        .replace(/^# (.*$)/gim, '<h1 class="text-4xl md:text-[64px] font-bold tracking-tighter text-[#1d1d1f] mt-16 mb-24 leading-none animate-apple-slide">$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-black">$1</strong>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/`([^`]+)`/g, '<code class="bg-[#f5f5f7] px-2 py-1 rounded-lg text-[14px] font-bold text-[#1d1d1f] font-mono border border-black/[0.02]">$1</code>')
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-[5px] border-[#0071e3]/40 bg-[#f5f5f7]/50 px-10 py-8 text-[#1d1d1f]/45 font-medium italic my-12 rounded-r-[24px] shadow-sm">$1</blockquote>')
        .replace(/\|(.+)\|/g, (match) => {
           if(match.includes('---')) return ''; 
           const cells = match.split('|').filter(c => c.trim()).map((c, i) => `<td class="border-b border-black/[0.06] px-6 py-4 ${i === 0 ? 'font-bold text-black border-r border-black/[0.04]' : 'text-black/50'} font-sans">${c.trim()}</td>`).join('');
           return `<div class="overflow-x-auto w-full my-12 font-sans border border-black/[0.06] rounded-[24px] shadow-sm overflow-hidden"><table class="w-full border-collapse text-[14px]"><tr class="bg-black/[0.02]">${cells}</tr></table></div>`;
        });

      return <div key={index} className="font-sans leading-[1.8] text-[#1d1d1f]/75 text-[18px] md:text-[20px] selection:bg-[#0071e3]/10" dangerouslySetInnerHTML={{ __html: htmlText }} />;
    });
  };

  return (
    <div className="relative group/wrapper">
      <div className="absolute top-0 right-0 opacity-0 group-hover/wrapper:opacity-100 transition-all flex gap-3 z-10 translate-y-[-20px] group-hover:translate-y-0 duration-300">
         <button onClick={handleSpeech} className="p-3 bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl hover:bg-white transition text-black/30 hover:text-black shadow-xl" title="Read Hub Briefing">
            <Volume2 size={18} />
         </button>
         <button onClick={handleCopy} className="p-3 bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl hover:bg-white transition text-black/30 hover:text-black shadow-xl" title="Copy Core Contents">
            {copied ? <CheckCircle2 className="w-5 h-5 text-[#34c759]" /> : <Copy className="w-5 h-5" />}
         </button>
         <button className="p-3 bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl hover:bg-white transition text-black/30 hover:text-black shadow-xl" title="Share Insight Link">
            <Share2 size={18} />
         </button>
      </div>
      <div ref={containerRef} className="pb-12 w-full">
        {parseBlocks()}
      </div>
    </div>
  );
}

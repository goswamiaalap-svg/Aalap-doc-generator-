import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; 
import mermaid from 'mermaid';
import { Copy, CheckCircle2, Maximize2, Share2, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

mermaid.initialize({ 
  startOnLoad: false, 
  theme: 'dark', 
  securityLevel: 'loose',
  fontFamily: 'Inter'
});

export default function MarkdownRenderer({ content }: { content: string, sectionName?: string }) {
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
          setRenderedMermaid(prev => ({ ...prev, [graphDefinition]: `<div class="text-red-500 p-4 border border-red-500/20 bg-red-500/5 rounded-xl font-mono text-xs">Diagram Error: Syntax Mismatch</div>` }));
        }
      }
    };
    renderMermaidGraphs();
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(content.replace(/[#*`|]/g, ''));
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
    toast.success('AI Voice activated');
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
            <div key={index} className="my-8 group/mermaid relative">
               <div className="absolute top-4 right-4 z-10 opacity-0 group-hover/mermaid:opacity-100 transition-opacity">
                  <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 bg-black/50 backdrop-blur border border-white/10 rounded-lg text-white hover:bg-black">
                     <Maximize2 size={14} />
                  </button>
               </div>
               <div 
                 className={`flex justify-center p-8 bg-white/5 border border-white/5 rounded-[2rem] transition-all overflow-auto ${isFullscreen ? 'fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center' : ''}`}
                 dangerouslySetInnerHTML={{ __html: renderedMermaid[code] }} 
               />
               {isFullscreen && (
                 <button onClick={() => setIsFullscreen(false)} className="fixed top-8 right-8 z-[1100] p-4 bg-white/10 rounded-full text-white hover:bg-white/20">
                    Close Diagram
                 </button>
               )}
            </div>
          );
        }
        return (
          <div key={index} className="relative group/code bg-black/40 border border-white/5 rounded-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language || 'text'}</span>
               <button onClick={() => navigator.clipboard.writeText(code)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400">Copy</button>
            </div>
            <pre className="p-6 overflow-x-auto custom-scrollbar"><code className={`language-${language} text-xs font-mono text-gray-300`}>{code}</code></pre>
          </div>
        );
      }
      
      const htmlText = block
        .replace(/^### (.*$)/gim, '<h3 class="text-lg md:text-xl font-black tracking-tight text-white mt-8 mb-3 uppercase">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl md:text-2xl font-black tracking-tighter text-white mt-12 mb-6 border-b border-white/5 pb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl md:text-4xl font-black tracking-tighter text-white mt-12 mb-8 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-black text-white">$1</strong>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-[13px] font-bold text-blue-400 font-mono">$1</code>')
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 bg-blue-500/5 px-6 py-4 text-gray-300 italic my-6 rounded-r-2xl">$1</blockquote>')
        .replace(/\|(.+)\|/g, (match) => {
           if(match.includes('---')) return ''; 
           const cells = match.split('|').filter(c => c.trim()).map((c, i) => `<td class="border border-white/10 px-4 py-3 ${i === 0 ? 'font-bold text-white' : 'text-gray-400'}">${c.trim()}</td>`).join('');
           return `<div class="overflow-x-auto w-full my-6"><table class="w-full border-collapse rounded-xl overflow-hidden border border-white/10 text-xs"><tr class="bg-white/5">${cells}</tr></table></div>`;
        });

      return <div key={index} className="font-sans leading-relaxed text-gray-300 text-sm md:text-base selection:bg-blue-500/30" dangerouslySetInnerHTML={{ __html: htmlText }} />;
    });
  };

  return (
    <div className="relative group/wrapper">
      <div className="absolute top-0 right-0 opacity-0 group-hover/wrapper:opacity-100 transition-all flex gap-2 z-10">
         <button onClick={handleSpeech} className="p-2 bg-white/5 backdrop-blur border border-white/10 rounded-xl hover:bg-white/10 transition text-gray-400 hover:text-white" title="Read Aloud">
            <Volume2 size={16} />
         </button>
         <button onClick={handleCopy} className="p-2 bg-white/5 backdrop-blur border border-white/10 rounded-xl hover:bg-white/10 transition text-gray-400 hover:text-white" title="Copy Markdown">
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
         </button>
         <button className="p-2 bg-white/5 backdrop-blur border border-white/10 rounded-xl hover:bg-white/10 transition text-gray-400 hover:text-white" title="Share Insights">
            <Share2 size={16} />
         </button>
      </div>
      <div ref={containerRef} className="pb-8 w-full animate-in fade-in duration-1000">
        {parseBlocks()}
      </div>
    </div>
  );
}

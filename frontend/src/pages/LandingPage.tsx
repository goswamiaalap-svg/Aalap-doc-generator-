import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap,
  ChevronRight,
  Terminal,
  Activity,
  Layers,
  Shield,
  Code,
  Globe,
  Database,
  Cpu,
  Workflow,
  Network,
  Command,
  Braces
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-start bg-[#ffffff] relative overflow-hidden font-sans pb-40">
      
      {/* 🍏 DYNAMIC GRID AND GLOW BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
         <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-[#0071e3]/15 via-[#af52de]/10 to-transparent rounded-full blur-[140px] opacity-80" />
         <div className="absolute bottom-[-200px] right-[-200px] w-[800px] h-[800px] bg-gradient-to-tl from-[#32d74b]/10 via-[#0071e3]/5 to-transparent rounded-full blur-[120px] opacity-60" />
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] opacity-[0.4]" />
      </div>

      {/* 🍏 HIGH-DENSITY NAVIGATION BAR */}
      <nav className={`fixed top-0 inset-x-0 h-[72px] z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-sm' : 'bg-transparent'}`}>
         <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
                  <Zap size={16} className="text-white" />
               </div>
               <span className="font-bold text-[18px] tracking-tight text-black">HGM-06</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
               <span className="text-[14px] font-medium text-black/50 hover:text-black cursor-pointer transition-colors">Manifest</span>
               <span className="text-[14px] font-medium text-black/50 hover:text-black cursor-pointer transition-colors">Architecture</span>
               <span className="text-[14px] font-medium text-black/50 hover:text-black cursor-pointer transition-colors">Neural Net</span>
            </div>
            <Link to="/codegen" className="hidden md:flex items-center gap-2 h-10 px-5 bg-[#f5f5f7] rounded-full text-[14px] font-bold hover:bg-black hover:text-white transition-all shadow-inner border border-black/5 cursor-pointer">
               Studio <ChevronRight size={14} />
            </Link>
         </div>
      </nav>

      {/* 🍏 ADVANCED HERO ENCLOSURE */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-[220px] relative z-10 flex flex-col items-center text-center">
         
         <div className="flex items-center gap-3 mb-12 animate-apple-fade bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-black/[0.08] shadow-sm hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-1.5 bg-[#0071e3]/10 text-[#0071e3] px-2 py-0.5 rounded-full">
               <SparkleIcon />
               <span className="text-[10px] font-bold uppercase tracking-wider">v4.2</span>
            </div>
            <span className="text-[13px] font-bold text-[#1d1d1f] tracking-wide">Synthetic Logic Engine Live</span>
            <ChevronRight size={14} strokeWidth={3} className="text-black/40" />
         </div>

         <h1 className="text-[72px] md:text-[130px] lg:text-[150px] font-bold tracking-[-0.05em] leading-[0.9] text-[#1d1d1f] mb-8 animate-apple-slide select-none relative">
            Logic.<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0071e3] via-[#af52de] to-[#ff2d55]">
               Synthesized.
            </span>
            <div className="hidden lg:block absolute bottom-10 -right-20 animate-bounce transition-all opacity-50">
               <div className="bg-white border border-black/10 rounded-2xl p-4 shadow-xl flex items-center gap-3">
                  <Terminal size={24} className="text-[#0071e3]" />
                  <div className="flex flex-col text-left">
                     <span className="text-[10px] font-black uppercase tracking-wider text-black/40">AST Parser</span>
                     <span className="text-[14px] font-bold">0.4ms Latency</span>
                  </div>
               </div>
            </div>
         </h1>

         <p className="text-[20px] md:text-[26px] text-[#1d1d1f]/40 font-medium tracking-tight mb-16 leading-[1.4] max-w-[700px] mx-auto animate-apple-fade" style={{ animationDelay: '200ms' }}>
            The deepest technical archive ever built. Sub-millisecond logical decomposition, perfectly structured architecture.
         </p>

         <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-apple-fade" style={{ animationDelay: '300ms' }}>
            <Link to="/codegen" className="apple-btn-primary h-[64px] px-12 flex items-center justify-center text-[18px] font-semibold tracking-wide shadow-[0_20px_40px_-15px_rgba(0,113,227,0.4)] hover:scale-105 transition-all w-full sm:w-auto overflow-hidden relative group">
               <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
               <span className="relative z-10 flex items-center">Open Neural Studio <Terminal size={20} className="ml-3" /></span>
            </Link>
            <Link to="/docs/intro" className="group flex items-center justify-center gap-3 h-[64px] px-12 rounded-full bg-white border border-black/10 text-[18px] font-semibold text-[#1d1d1f] hover:bg-black hover:text-white transition-all shadow-sm w-full sm:w-auto">
               <Database size={20} className="text-black/40 group-hover:text-white/80 transition-colors" />
               View Archive
            </Link>
         </div>
      </div>

      {/* 🍏 MEGA BENTO BOX SHOWCASE (6 CARDS TO FILL SPACE) */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 mt-[200px] relative z-10 animate-apple-fade" style={{ animationDelay: '500ms' }}>
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* CARD 1: LARGE HERO FEATURE */}
            <div className="md:col-span-2 lg:col-span-2 bg-[#f9f9fb] border border-black/[0.04] rounded-[48px] p-12 flex flex-col justify-between hover:shadow-2xl transition-all duration-700 group overflow-hidden relative h-[420px]">
               <div className="absolute right-0 top-0 bottom-0 w-[80%] bg-gradient-to-l from-[#0071e3]/10 to-transparent pointer-events-none rounded-r-[48px]" />
               <div className="w-16 h-16 bg-white rounded-[20px] shadow-sm flex items-center justify-center mb-10 group-hover:scale-110 transition-transform relative z-10 border border-black/5">
                  <Activity size={32} className="text-[#0071e3]" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-[36px] md:text-[44px] font-bold text-[#1d1d1f] tracking-tight leading-[1.05] mb-5">
                     Sub-10ms<br/>Global Latency.
                  </h3>
                  <p className="text-[18px] text-[#1d1d1f]/50 font-medium max-w-[320px]">
                     Powered by Vercel Edge compute. Neural documentation synthesizes instantaneously worldwide.
                  </p>
               </div>
               <div className="absolute -right-20 -bottom-20 opacity-20 group-hover:opacity-60 transition-opacity duration-1000">
                   <Globe size={300} strokeWidth={0.5} />
               </div>
            </div>

            {/* CARD 2: TALL VERTICAL */}
            <div className="lg:col-span-1 md:col-span-1 bg-[#1d1d1f] border border-black/[0.04] rounded-[48px] p-12 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/20 transition-all duration-700 group h-[420px] relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
               <div className="w-16 h-16 bg-white/10 rounded-[20px] border border-white/10 flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform relative z-10">
                  <Shield size={32} className="text-[#32d74b]" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-[32px] font-bold text-white tracking-tight leading-[1.1] mb-4">
                     Sovereign<br/>Security.
                  </h3>
                  <p className="text-[16px] text-white/50 font-medium">
                     AES-256 rolling-key logic protection. Your source code is instantly purged.
                  </p>
               </div>
            </div>

            {/* CARD 3: AST PARSING (NEW) */}
            <div className="lg:col-span-1 md:col-span-3 bg-[#f9f9fb] border border-black/[0.04] rounded-[48px] p-12 flex flex-col justify-between hover:shadow-2xl transition-all duration-700 group h-[420px] relative overflow-hidden">
               <div className="w-16 h-16 bg-white rounded-[20px] shadow-sm flex items-center justify-center mb-10 group-hover:-translate-y-2 transition-transform relative z-10 border border-black/5">
                  <Cpu size={32} className="text-[#ff9500]" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight leading-[1.1] mb-4">
                     Stage 4<br/>AST Parsing.
                  </h3>
                  <p className="text-[16px] text-[#1d1d1f]/50 font-medium">
                     Deep dependency resolution maps out logical structures visually.
                  </p>
               </div>
               <div className="absolute right-0 bottom-0 p-8 flex items-end justify-end w-full h-full pointer-events-none">
                  <div className="flex flex-col gap-2 opacity-10 group-hover:opacity-30 transition-opacity">
                     <div className="h-2 w-24 bg-black rounded-full" />
                     <div className="h-2 w-16 bg-black rounded-full ml-4" />
                     <div className="h-2 w-32 bg-black rounded-full ml-4" />
                  </div>
               </div>
            </div>

            {/* CARD 4: WIDE ARCHITECTURE CARD */}
            <div className="md:col-span-3 lg:col-span-4 bg-gradient-to-br from-[#ffffff] to-[#f5f5f7] border border-black/[0.06] rounded-[48px] p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between hover:shadow-3xl transition-all duration-700 group overflow-hidden relative min-h-[300px]">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0071e3]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms] ease-in-out pointer-events-none" />
               <div className="flex flex-col relative z-10 mb-10 lg:mb-0 max-w-[600px] w-full">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-16 h-16 bg-black rounded-[20px] shadow-lg flex items-center justify-center">
                        <Network size={32} className="text-white" />
                     </div>
                     <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#0071e3] bg-[#0071e3]/10 px-4 py-2 rounded-full">Automated Diagrams</span>
                  </div>
                  <h3 className="text-[40px] md:text-[52px] font-bold text-[#1d1d1f] tracking-tight leading-[1.05] mb-6">
                     Deep Architectural Maps.
                  </h3>
                  <p className="text-[20px] text-[#1d1d1f]/50 font-medium">
                     Not just comments. Full API references, automated ERD diagrams, and multi-dependency resolution completely generated in one click.
                  </p>
               </div>
               
               <div className="w-full lg:w-auto relative z-10 flex flex-col items-center shrink-0">
                  <div className="w-full max-w-[340px] bg-white border border-black/10 rounded-[32px] p-8 shadow-2xl relative">
                     <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                     </div>
                     <div className="space-y-4">
                        <div className="h-4 w-[60%] bg-black/5 rounded-full" />
                        <div className="h-4 w-[85%] bg-black/5 rounded-full" />
                        <div className="h-4 w-[40%] bg-black/5 rounded-full ml-6" />
                        <div className="h-4 w-[70%] bg-[#0071e3]/20 rounded-full" />
                     </div>
                     <div className="absolute -right-6 -top-6 bg-black text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                        <Zap size={16} className="text-yellow-400" />
                        <span className="text-[13px] font-bold">100% Coverage</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* CARD 5: MULTI-LANGUAGE */}
            <div className="md:col-span-1 lg:col-span-2 bg-[#f9f9fb] border border-black/[0.04] rounded-[48px] p-12 flex items-center gap-8 hover:shadow-2xl transition-all duration-700 group overflow-hidden relative">
               <div className="w-20 h-20 shrink-0 bg-white rounded-[24px] shadow-sm flex items-center justify-center border border-black/5 group-hover:rotate-[15deg] transition-all duration-500">
                  <Braces size={36} className="text-[#1d1d1f]" />
               </div>
               <div>
                  <h3 className="text-[24px] font-bold text-[#1d1d1f] tracking-tight mb-2">Polyglot Engine</h3>
                  <p className="text-[16px] text-[#1d1d1f]/50 font-medium">Supports Typescript, Python, Rust, Go, Java & C++ seamlessly.</p>
               </div>
            </div>

            {/* CARD 6: CONSTANT UPDATES */}
            <div className="md:col-span-2 lg:col-span-2 bg-[#f9f9fb] border border-black/[0.04] rounded-[48px] p-12 flex items-center gap-8 hover:shadow-2xl transition-all duration-700 group overflow-hidden relative">
               <div className="w-20 h-20 shrink-0 bg-white rounded-[24px] shadow-sm flex items-center justify-center border border-black/5 group-hover:-rotate-[15deg] transition-all duration-500">
                  <Workflow size={36} className="text-[#af52de]" />
               </div>
               <div>
                   <h3 className="text-[24px] font-bold text-[#1d1d1f] tracking-tight mb-2">Continuous Integration</h3>
                   <p className="text-[16px] text-[#1d1d1f]/50 font-medium">Export logic directly to GitHub or deploy architecture docs to Vercel instantly.</p>
               </div>
            </div>

         </div>
      </div>

      {/* 🍏 FOOTER & STATUS BAR */}
      <footer className="w-full border-t border-black/[0.04] mt-[160px] pt-12 pb-12 bg-[#f5f5f7] relative z-10">
         <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <Command size={18} className="text-white" />
               </div>
               <div>
                  <h4 className="text-[16px] font-bold text-[#1d1d1f]">HGM-06 Systems</h4>
                  <p className="text-[13px] text-[#1d1d1f]/40 font-medium">All systems fully operational.</p>
               </div>
            </div>
            <div className="flex gap-6">
               <Link to="#" className="text-[14px] font-medium text-black/40 hover:text-black transition-colors">Documentation</Link>
               <Link to="#" className="text-[14px] font-medium text-black/40 hover:text-black transition-colors">API Status</Link>
               <Link to="#" className="text-[14px] font-medium text-black/40 hover:text-black transition-colors">Privacy Policy</Link>
            </div>
         </div>
      </footer>

    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L14.7 9.3L23 12L14.7 14.7L12 23L9.3 14.7L1 12L9.3 9.3L12 1Z" fill="currentColor"/>
    </svg>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap,
  ChevronRight,
  Terminal,
  Activity,
  Shield,
  Globe,
  Cpu,
  Workflow,
  Network,
  Command,
  Braces,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center bg-white relative overflow-x-hidden font-sans">
      
      {/* 🍏 STATIC BACKGROUND ARCHITECTURE */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
         <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-[#0071e3]/10 via-[#af52de]/5 to-transparent rounded-full blur-[140px] opacity-60" />
      </div>

      <main className="flex-1 w-full relative z-10 flex flex-col items-center">
        
        {/* 🍏 HERO SECTION — STRUCTURAL STACK FIX */}
        <section className="w-full max-w-[1240px] mx-auto px-6 py-20 md:py-32 lg:py-40 flex flex-col items-center text-center">
           
           {/* BADGE STACK */}
           <div className="mb-10 animate-apple-fade">
              <div className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-black/[0.08] shadow-sm hover:scale-105 transition-transform cursor-pointer group">
                 <div className="flex items-center gap-1.5 bg-[#0071e3]/10 text-[#0071e3] px-2 py-0.5 rounded-full">
                    <SparkleIcon />
                    <span className="text-[10px] font-bold uppercase tracking-wider">v4.2</span>
                 </div>
                 <span className="text-[13px] font-bold text-[#1d1d1f] tracking-wide">Synthetic Logic Engine Live</span>
                 <ChevronRight size={14} strokeWidth={3} className="text-black/20 group-hover:text-black transition-colors" />
              </div>
           </div>

           {/* HEADLINE STACK — ABSOLUTE REMOVAL FIX */}
           <div className="relative mb-12">
              <h1 
                className="font-extrabold tracking-[-0.04em] leading-[1.02] text-[#1d1d1f] animate-apple-slide select-none"
                style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}
              >
                 Logic.<br/>
                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0071e3] via-[#af52de] to-[#ff2d55] inline-block">
                    Synthesized.
                 </span>
              </h1>
              
              {/* DECORATIVE ELEMENT (Static) */}
              <div className="hidden xl:block absolute -right-20 top-1/2 -translate-y-1/2 transition-all opacity-100">
                 <div className="bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-5 shadow-3xl flex items-center gap-4">
                    <Terminal size={24} className="text-[#0071e3]" />
                    <div className="flex flex-col text-left">
                       <span className="text-[10px] font-black uppercase tracking-wider text-black/40">AST Parser</span>
                       <span className="text-[14px] font-bold">0.4ms Latency</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* DESCRIPTION STACK */}
           <p className="text-[18px] md:text-[24px] text-[#1d1d1f]/50 font-medium tracking-tight mb-16 leading-[1.6] max-w-[680px] mx-auto animate-apple-fade" style={{ animationDelay: '200ms' }}>
              The deepest technical archive ever built. Sub-millisecond logical decomposition, perfectly structured architecture.
           </p>

           {/* CTA STACK — STACKED FLEX */}
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-apple-fade" style={{ animationDelay: '300ms' }}>
              <Link to="/codegen" className="apple-btn-primary h-[64px] px-12 text-[18px] font-bold shadow-[0_20px_40px_-15px_rgba(0,113,227,0.3)] hover:scale-105 active:scale-95 transition-all">
                 Try Pro Free
              </Link>
              <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="group flex items-center justify-center gap-3 h-[64px] px-12 rounded-full bg-black/[0.03] border border-black/5 text-[18px] font-bold hover:bg-black hover:text-white transition-all">
                 View Manifest <ArrowRight size={20} />
              </button>
           </div>

        </section>

        {/* 🍏 FEATURE GRID — BENTO SYSTEM */}
        <section id="pricing" className="w-full max-w-[1240px] mx-auto px-6 pb-40">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              <div className="md:col-span-8 bg-white border border-[#0071e3]/20 rounded-[48px] p-12 flex flex-col justify-between hover:shadow-2xl transition-all duration-700 group h-[480px] relative overflow-hidden">
                 <div className="w-16 h-16 bg-[#0071e3]/5 rounded-[22px] shadow-sm flex items-center justify-center mb-10 group-hover:scale-110 transition-transform relative z-10 border border-[#0071e3]/10">
                    <Activity size={32} className="text-[#0071e3]" />
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-[42px] font-bold text-[#1d1d1f] tracking-tight leading-none mb-6">Sub-10ms Latency.</h3>
                    <p className="text-[20px] text-[#1d1d1f]/70 font-medium max-w-[380px]">Powered by Vercel Edge compute. Neural documentation synthesizes instantaneously.</p>
                 </div>
                 <Globe size={400} className="absolute -right-20 -bottom-20 text-[#0071e3]/5 hover:text-[#0071e3]/10 transition-colors" strokeWidth={0.5} />
              </div>

              <div className="md:col-span-4 bg-white border border-[#32d74b]/20 rounded-[48px] p-12 flex flex-col justify-between hover:shadow-2xl transition-all duration-700 group h-[480px] relative overflow-hidden">
                 <div className="w-16 h-16 bg-[#32d74b]/5 rounded-[22px] border border-[#32d74b]/10 flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform relative z-10">
                    <Shield size={32} className="text-[#32d74b]" />
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-[36px] font-bold text-[#1d1d1f] tracking-tight leading-[1.1] mb-6">Sovereign Security.</h3>
                    <p className="text-[18px] text-[#1d1d1f]/70 font-medium">AES-256 rolling-key logic protection. Your source code is instantly purged.</p>
                 </div>
              </div>

              <div className="md:col-span-12 bg-white border border-[#af52de]/20 rounded-[56px] p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-16 group overflow-hidden">
                 <div className="flex flex-col max-w-[500px]">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-14 h-14 bg-[#af52de]/5 rounded-[18px] border border-[#af52de]/10 flex items-center justify-center">
                          <Network size={28} className="text-[#af52de]" />
                       </div>
                       <span className="text-[12px] font-black uppercase tracking-widest text-[#af52de] bg-[#af52de]/5 px-4 py-2 rounded-full">Manifest Export</span>
                    </div>
                    <h3 className="text-[48px] font-bold text-[#1d1d1f] tracking-tight leading-[1.05] mb-8">Deep Architectural Infrastructure.</h3>
                    <p className="text-[20px] text-[#1d1d1f]/70 font-medium">Not just comments. Full API references, automated diagrams, and multi-dependency resolution completely generated.</p>
                 </div>
                 <div className="w-full max-w-[400px] bg-[#fbfbfd] border border-black/5 rounded-[40px] p-10 shadow-lg relative">
                    <div className="space-y-6">
                       <div className="h-4 w-[40%] bg-black/5 rounded-full" />
                       <div className="h-4 w-[90%] bg-black/5 rounded-full" />
                       <div className="h-4 w-[70%] bg-[#0071e3]/20 rounded-full" />
                       <div className="h-4 w-[50%] bg-black/5 rounded-full" />
                    </div>
                    <div className="absolute -right-8 -top-8 bg-black text-white px-8 py-5 rounded-2xl shadow-xl flex items-center gap-3">
                       <Zap size={18} className="text-[#32d74b]" />
                       <span className="text-[15px] font-bold">100% Coverage</span>
                    </div>
                 </div>
              </div>

           </div>
        </section>

      </main>

      {/* 🍏 FOOTER */}
      <footer className="w-full border-t border-black/[0.08] pt-20 pb-20 bg-[#f9f9fb] relative z-10">
         <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 bg-black rounded-[14px] flex items-center justify-center">
                  <Command size={22} className="text-white" />
               </div>
               <div>
                  <h4 className="text-[18px] font-bold text-[#1d1d1f]">HGM-06 Systems</h4>
                  <p className="text-[14px] text-[#1d1d1f]/40 font-medium">© 2026 Neural Documentation manifest.</p>
               </div>
            </div>
            <div className="flex flex-col items-center gap-6">
               <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                 <Link to="/" className="text-[15px] font-bold text-black/50 hover:text-black transition-colors">Home</Link>
                 <Link to="/docs/intro" className="text-[15px] font-bold text-black/50 hover:text-black transition-colors">Guide</Link>
                 <Link to="/codegen" className="text-[15px] font-bold text-black/50 hover:text-black transition-colors">Studio</Link>
                 <Link to="/docs/terms" className="text-[15px] font-bold text-black/50 hover:text-black transition-colors">Terms of Service</Link>
                 <Link to="/docs/privacy" className="text-[15px] font-bold text-black/50 hover:text-black transition-colors">Privacy Policy</Link>
               </div>
               <div className="flex items-center gap-6">
                  {['Twitter', 'GitHub', 'LinkedIn'].map(social => (
                     <a key={social} href="#" className="text-[13px] font-black text-[#0071e3] uppercase tracking-widest hover:underline">{social}</a>
                  ))}
               </div>
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

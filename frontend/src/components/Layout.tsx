import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Code2,
  Menu, 
  X,
  Zap,
  Settings2,
  Layout as LayoutIcon,
  Info,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import SpaceBackground from './SpaceBackground';
import CursorGlow from './CursorGlow';
import TiltCard from './TiltCard';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [docCount, setDocCount] = useState(2847);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setDocCount(c => c + Math.floor(Math.random() * 3));
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-screen text-white flex flex-col font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      <SpaceBackground />
      <CursorGlow />

      {/* TOP NAVIGATION: 3D PREMIUM */}
      <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 border-b border-indigo-600/20 ${
        scrolled ? 'h-16 bg-[#02020a]/80 backdrop-blur-3xl shadow-2xl' : 'h-20 bg-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between relative z-10 font-bold uppercase tracking-wider text-[11px]">
          
          <Link to="/" className="flex items-center gap-4 group">
            <div className="cube-logo">
              <div className="cube-face face-front" />
              <div className="cube-face face-back" />
              <div className="cube-face face-right" />
              <div className="cube-face face-left" />
              <div className="cube-face face-top" />
              <div className="cube-face face-bottom" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase logo-gradient leading-none">HGM-06</span>
          </Link>

          {/* MAIN NAV PILLS */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { to: '/docs', icon: <BookOpen size={14}/>, label: 'DOCUMENTATION' },
              { to: '/codegen', icon: <Code2 size={14}/>, label: 'NEURO-ENGINE' }
            ].map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-500 ${
                  location.pathname.startsWith(link.to) 
                    ? 'bg-indigo-500/15 border border-indigo-500/40 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* STATUS & STATS */}
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6">
               <div className="flex items-center gap-2 text-indigo-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgb(34,197,94)]" />
                  <span>NEURAL SYNC ACTIVE</span>
               </div>
               <div className="h-4 w-[1px] bg-white/10" />
               <div className="text-white/80">
                  <span className="text-white font-black">{docCount.toLocaleString()}</span> DOCS INDEXED
               </div>
            </div>
            <button className="hidden sm:flex p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all hover:scale-110">
               <Settings2 size={18} />
            </button>
            <button 
              className="md:hidden p-2 text-white/40"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-[#02020a]/95 backdrop-blur-3xl animate-in fade-in duration-300 flex flex-col p-8">
           <div className="flex items-center justify-between mb-20 px-4">
              <Link to="/" className="flex items-center gap-4" onClick={() => setMobileMenuOpen(false)}>
                <div className="cube-logo scale-125" />
                <span className="text-3xl font-black uppercase tracking-tighter logo-gradient">HGM-06</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/40"><X size={32}/></button>
           </div>
           
           <div className="space-y-6 flex flex-col items-center">
              {[
                { to: '/docs', label: 'DOCUMENTATION' },
                { to: '/codegen', label: 'NEURO-ENGINE' }
              ].map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-black uppercase tracking-tighter hover:text-indigo-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
           </div>
        </div>
      )}

      {/* LAYOUT CONTAINER */}
      <div className="flex-1 flex pt-20 w-full relative z-10 min-h-0">
        
        {/* LEFT SIDEBAR: GLASS 3D */}
        <aside className="hidden lg:flex w-[260px] flex-col border-r border-indigo-600/15 glass-panel z-20 overflow-hidden">
           <div className="flex-1 overflow-y-auto px-2 py-8 custom-scrollbar">
              <div className="px-4 mb-4">
                 <h3 className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase flex items-center gap-2">
                   <LayoutIcon size={12} className="text-indigo-400" /> DIRECTORY
                 </h3>
              </div>
              <div className="space-y-1">
                 {[
                   { label: 'GETTING STARTED', to: '/docs/intro' },
                   { label: 'CORE ARCHITECTURE', to: '/docs/architecture' },
                   { label: 'API ECOSYSTEM', to: '/docs/api-reference' },
                   { label: 'DEPLOYMENT PIPELINE', to: '/docs/deployment' },
                   { label: 'NEURAL SECURITY', to: '/docs/security' }
                 ].map(item => (
                   <TiltCard key={item.to} maxTilt={6}>
                      <Link 
                        to={item.to}
                        className={`block rounded-xl px-4 py-3 relative overflow-hidden transition-all duration-300 ${
                           location.pathname === item.to 
                             ? 'bg-indigo-500/15 border border-indigo-500/50 text-white shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
                             : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white'
                        }`}
                      >
                         {location.pathname === item.to && (
                           <div className="absolute left-0 top-0 w-[3px] h-full bg-gradient-to-b from-[#6366f1] to-[#06b6d4] shadow-[0_0_10px_#6366f1]" />
                         )}
                         <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                      </Link>
                   </TiltCard>
                 ))}
              </div>
           </div>

           {/* USER PROFILE CARD */}
           <div className="p-4 bg-indigo-500/[0.08] border-t border-indigo-500/20 m-2 rounded-2xl flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6366f1] to-[#06b6d4] flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                 AG
              </div>
              <div className="flex flex-col">
                 <span className="text-[13px] font-black text-white tracking-widest uppercase">GOSWAMI A.</span>
                 <span className="text-[11px] font-black text-[#06b6d4] uppercase tracking-widest">ENTERPRISE TIER</span>
              </div>
           </div>
        </aside>

        {/* MAIN VIEWER */}
        <main className="flex-1 min-w-0 h-full relative z-10 transition-all duration-700">
           <Outlet />
        </main>

        {/* RIGHT PANEL: NEURO SEARCH */}
        <aside className="hidden xl:flex w-[300px] flex-col border-l border-indigo-600/15 glass-panel z-20">
           <div className="p-8 border-b border-indigo-600/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Sparkles size={18} className="text-cyan-400 animate-pulse" />
                 <h2 className="text-[11px] font-black tracking-widest text-white">NEURO SEARCH</h2>
              </div>
              <div className="px-2 py-1 bg-cyan-500/[0.1] border border-cyan-500/30 rounded text-[9px] font-black text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                 GROQ-L3
              </div>
           </div>

           <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar text-[11px] uppercase tracking-widest">
              <TiltCard>
                 <div className="p-5 glass-panel rounded-2xl bg-indigo-500/[0.06] border-indigo-500/20 shadow-[0_8px_32px_rgba(99,102,241,0.1)]">
                    <div className="flex items-center gap-2 mb-4">
                       <Info size={14} className="text-indigo-400" />
                       <span className="text-cyan-400 font-black">INTERACTIVE GUIDE</span>
                    </div>
                    <p className="text-white/55 leading-relaxed mb-6 font-medium">EXPLORE ALPHA PROTOCOLS WITH NEURAL GENERATION QUERY INDEXING.</p>
                    <div className="flex flex-wrap gap-2">
                       {['API ENDPOINTS?', 'HOW TO INSTALL?', 'VISUAL THEMES?'].map(chip => (
                         <button key={chip} className="px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-white/10 text-white/60 hover:bg-indigo-500/20 hover:border-indigo-500 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] transition-all">
                            {chip}
                         </button>
                       ))}
                    </div>
                 </div>
              </TiltCard>

              {/* CONVERSATION STREAM (PLACEHOLDER) */}
              <div className="space-y-4 px-2">
                 <div className="bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 border border-indigo-500/30 rounded-2xl rounded-br-md p-4 text-white shadow-lg ml-8 text-right">
                    ANALYZE DOC INDEX V2
                 </div>
                 <div className="bg-white/[0.04] border border-white/[0.08] border-left-[3px] border-indigo-500 rounded-2xl rounded-bl-md p-4 text-white/55">
                    <div className="flex gap-2">
                       <div className="typing-dot" />
                       <div className="typing-dot [animation-delay:0.2s]" />
                       <div className="typing-dot [animation-delay:0.4s]" />
                    </div>
                 </div>
              </div>
           </div>

           {/* INPUT ENGINE */}
           <div className="p-4 bg-white/[0.02]">
              <div className="relative">
                 <input 
                   placeholder="NEURAL QUERY..."
                   className="w-full h-14 pl-5 pr-16 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-black tracking-[0.2em] outline-none text-white focus:border-indigo-500 focus:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all placeholder:text-white/20"
                 />
                 <button className="absolute right-2 top-2 h-10 w-10 bg-gradient-to-br from-[#6366f1] to-[#06b6d4] rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all outline-none">
                    <Zap size={18} className="fill-white" />
                 </button>
              </div>
           </div>
        </aside>
      </div>
      
    </div>
  );
}

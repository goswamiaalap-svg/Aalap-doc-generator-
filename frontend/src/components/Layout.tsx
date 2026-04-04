import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Code2,
  Menu, 
  X,
  Zap,
  Info,
  FileText,
  Search,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col font-sans selection:bg-indigo-500/20 overflow-x-hidden relative">
      
      {/* ═══════════════════════════════════════════════════════════════
         STEP 3: ADD THE BACKGROUND LAYER TO THE DOM (FUSIONAI EXACT)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="fusion-bg-layer">
        <div className="fusion-blob-top"></div>
        <div className="fusion-blob-mid"></div>
        <div className="fusion-blob-bottom"></div>
      </div>

      {/* WRAP CONTENT IN RELATIVE Z-1 CONTAINER */}
      <div className="relative z-10 flex flex-col min-h-screen">
          
          {/* TOP NAVIGATION — FUSIONAI EXACT GLASS STYLE */}
          <header className={`fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-8 transition-all duration-300 ${
            scrolled 
            ? 'nav-glass' 
            : 'bg-transparent border-transparent'
          }`}>
            {/* LEFT — Logo area */}
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center transition-transform group-hover:scale-105">
                 <Sparkles size={16} className="text-white" />
              </div>
              <span className="ml-2.5 text-[17px] font-bold tracking-[-0.02em] text-white">HGM-06</span>
            </Link>

            {/* CENTER — Nav links */}
            <nav className="hidden md:flex items-center gap-2">
              {[
                { to: '/docs', label: 'Platform Docs' },
                { to: '/codegen', label: 'DocGen AI' }
              ].map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    location.pathname.startsWith(link.to)
                    ? 'text-white font-medium bg-white/5'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* RIGHT AREA */}
            <div className="flex items-center gap-4">
              <Link to="/docs" className="hidden sm:block fusion-btn-primary">
                Get Started
              </Link>
              <button 
                className="md:hidden p-2 text-white/50" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </header>

          {/* MAIN CONTAINER */}
          <div className="flex-1 flex pt-16 w-full relative min-h-0">
            
            {/* LEFT SIDEBAR — FUSIONAI SEMI-TRANSPARENT STYLE */}
            <aside className="hidden lg:flex w-[240px] flex-col sidebar-glass sticky top-16 h-[calc(100vh-64px)] overflow-hidden">
               <div className="flex-1 overflow-y-auto py-6 no-scrollbar scroll-smooth">
                  <div className="px-5 mb-3">
                     <h3 className="text-[10px] font-bold tracking-[0.14em] text-white/20 uppercase">SYSTEM INDEX</h3>
                  </div>
                  <div className="space-y-[4px]">
                     {[
                       { label: 'Overview', to: '/docs/intro', icon: <FileText size={15} /> },
                       { label: 'Architecture', to: '/docs/architecture', icon: <Code2 size={15} /> },
                       { label: 'API Reference', to: '/docs/api-reference', icon: <Search size={15} /> },
                       { label: 'Deployment', to: '/docs/deployment', icon: <Zap size={15} /> },
                       { label: 'Security', to: '/docs/security', icon: <MessageSquare size={15} /> }
                     ].map(item => (
                       <Link 
                         key={item.to}
                         to={item.to}
                         className={`flex items-center gap-3 px-5 py-2.5 mx-1.5 rounded-lg text-[13.5px] transition-all relative ${
                            location.pathname === item.to 
                              ? 'bg-white/[0.04] text-white font-medium' 
                              : 'text-white/45 hover:bg-white/[0.02] hover:text-white/85'
                         }`}
                       >
                          {location.pathname === item.to && (
                            <div className="absolute left-0 top-2 bottom-2 w-[2.5px] bg-[#7c3aed] rounded-r-full" />
                          )}
                          <span className={location.pathname === item.to ? 'text-[#7c3aed]' : 'text-inherit opacity-40'}>
                            {item.icon}
                          </span>
                          {item.label}
                       </Link>
                     ))}
                  </div>

                  <div className="h-[1px] bg-white/[0.05] mx-5 my-5" />

                  <div className="px-5 mb-2">
                     <h3 className="text-[10px] font-bold tracking-[0.14em] text-white/20 uppercase">AI ENGINE</h3>
                  </div>
                  <Link to="/codegen" className="flex items-center gap-3 px-5 py-2.5 mx-1.5 rounded-lg text-[13.5px] text-white/45 hover:bg-white/[0.02] hover:text-white/85 transition-all">
                    <Sparkles size={15} className="text-white/40" />
                    DocGen Studio
                  </Link>
               </div>

               {/* BOTTOM USER CARD */}
               <div className="mt-auto border-t border-white/[0.05] p-5">
                  <div className="flex items-center gap-3">
                     <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-[12px] font-bold text-white shadow-lg">
                        AG
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-medium text-white truncate">goswamiaalap-svg</span>
                        <span className="text-[11px] text-white/30 font-normal">Neural Tier Premium</span>
                     </div>
                  </div>
               </div>
            </aside>

            {/* MAIN VIEWER AREA — REMOVED BACKGROUND CLASSES */}
            <main className="flex-1 min-w-0 overflow-y-auto animate-fade-up bg-transparent">
               <Outlet />
            </main>

            {/* RIGHT PANEL — FUSIONAI SEMI-TRANSPARENT GLASS STYLE */}
            <aside className="hidden xl:flex w-[300px] flex-col right-panel-glass sticky top-16 h-[calc(100vh-64px)] overflow-hidden">
               {/* PANEL HEADER */}
               <div className="p-6 flex items-center justify-between border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                     <Sparkles size={15} className="text-[#a78bfa]" />
                     <h2 className="text-[11px] font-bold text-white/40 tracking-[0.15em] uppercase">NEURO CORE</h2>
                  </div>
                  <div className="px-2 py-0.5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-md text-[9px] text-[#a78bfa] tracking-[0.1em] uppercase font-bold">
                     AI ACTIVE
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                  {/* INTERACTIVE GUIDE CARD — TRANSPARENT GLASS */}
                  <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-5 mb-5 backdrop-blur-sm">
                     <div className="flex items-center gap-2.5 mb-3">
                        <Info size={14} className="text-[#3b82f6]" />
                        <span className="text-[10px] font-bold tracking-[0.1em] text-[#60a5fa] uppercase">SYSTEM ANALYTICS</span>
                     </div>
                     <p className="text-[12.5px] text-white/40 leading-[1.6] mb-5">Current engine latency: 14ms. Ready for architectural synthesis.</p>
                     <div className="flex flex-wrap gap-2">
                        {['KEYS', 'THEMES', 'DEPLOY'].map(chip => (
                          <button key={chip} className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1 text-[10px] text-white/50 tracking-[0.04em] uppercase hover:bg-[#7c3aed]/10 hover:border-[#7c3aed]/30 hover:text-white transition-all">
                            {chip}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* CONVERSATION AREA */}
                  <div className="flex flex-col gap-5 py-2">
                     <div className="self-end max-w-[85%] bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-2xl p-4 text-[13px] text-white/80 leading-[1.6]">
                        Documentation security report?
                     </div>
                     <div className="self-start max-w-[92%] bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-[13px] text-white/60 leading-[1.6]">
                        Our neural gateway utilizes AES-256 rotation for all repository analysis packets...
                     </div>
                  </div>
               </div>

               {/* SEARCH INPUT AREA */}
               <div className="p-5 border-t border-white/[0.05]">
                  <div className="relative">
                     <input 
                       placeholder="Consult the Oracle..."
                       className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3.5 pl-4 pr-12 text-[13px] text-white outline-none focus:border-[#7c3aed]/40 focus:bg-white/[0.04] transition-all placeholder:text-white/15"
                     />
                     <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-[#7337ed] to-[#3b82f6] rounded-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all">
                        <ArrowRight size={15} className="text-white" />
                     </button>
                  </div>
               </div>
            </aside>

          </div>
      </div>

    </div>
  );
}

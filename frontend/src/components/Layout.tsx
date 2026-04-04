import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Code2,
  Menu, 
  X,
  Zap,
  Info,
  ChevronRight,
  FileText,
  Search,
  MessageSquare,
  ArrowRight,
  User,
  Settings,
  ChevronDown
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
      
      {/* FUSIONAI GLOBAL BACKGROUND */}
      <div className="fusion-bg">
        <div className="fusion-blob-1"></div>
        <div className="fusion-blob-2"></div>
        <div className="fusion-blob-3"></div>
      </div>

      {/* TOP NAVIGATION — FUSIONAI EXACT STYLE */}
      <header className={`fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-8 transition-all duration-300 border-b ${
        scrolled 
        ? 'bg-black/60 backdrop-blur-2xl border-white/[0.06]' 
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

        {/* RIGHT — CTA button */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block fusion-btn-primary">
            Get Started
          </button>
          <button 
            className="md:hidden p-2 text-white/50" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex pt-16 w-full relative z-10 min-h-0">
        
        {/* LEFT SIDEBAR — FUSIONAI MINIMAL CLEAN STYLE */}
        <aside className="hidden lg:flex w-[240px] flex-col border-r border-white/[0.05] sticky top-16 h-[calc(100vh-64px)] overflow-hidden">
           <div className="flex-1 overflow-y-auto py-6 custom-scrollbar no-scrollbar scroll-smooth">
              <div className="px-4 mb-3">
                 <h3 className="text-[10px] font-bold tracking-[0.12em] text-white/25 uppercase">NAVIGATION</h3>
              </div>
              <div className="space-y-[2px]">
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
                     className={`flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-lg text-[13.5px] transition-all relative ${
                        location.pathname === item.to 
                          ? 'bg-indigo-500/10 text-white font-medium shadow-inner' 
                          : 'text-white/50 hover:bg-white/[0.05] hover:text-white/85'
                     }`}
                   >
                      {location.pathname === item.to && (
                        <div className="absolute left-0 top-1 bottom-1 w-[2.5px] bg-gradient-to-b from-[#8b5cf6] to-[#3b82f6] rounded-r-sm" />
                      )}
                      <span className={`${location.pathname === item.to ? 'text-indigo-400' : 'text-inherit'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                   </Link>
                 ))}
              </div>

              <div className="h-[1px] bg-white/[0.05] mx-4 my-4" />

              <div className="px-4 mb-2">
                 <h3 className="text-[10px] font-bold tracking-[0.12em] text-white/25 uppercase">AI ENGINE</h3>
              </div>
              <Link to="/codegen" className="flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-lg text-[13.5px] text-white/50 hover:bg-white/[0.05] hover:text-white/85 transition-all">
                <Sparkles size={15} className="text-white/30" />
                DocGen Studio
              </Link>
           </div>

           {/* BOTTOM USER CARD */}
           <div className="mt-auto border-t border-white/[0.05] p-4">
              <div className="flex items-center gap-3">
                 <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-[12px] font-bold text-white">
                    AG
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-medium text-white truncate">Standard User</span>
                    <span className="text-[11px] text-white/35 font-normal">Free Neural Tier</span>
                 </div>
              </div>
              <button className="w-full mt-4 bg-white/[0.04] border border-white/[0.07] rounded-lg py-2 text-[12px] text-white/50 hover:bg-white/[0.07] hover:text-white transition-all">
                 System Settings
              </button>
           </div>
        </aside>

        {/* MAIN VIEWER AREA */}
        <main className={`flex-1 min-w-0 overflow-y-auto animate-fade-up`}>
           <Outlet />
        </main>

        {/* RIGHT PANEL — AI SEARCH (FUSIONAI STYLE) */}
        <aside className="hidden xl:flex w-[300px] flex-col border-l border-white/[0.05] glass-panel sticky top-16 h-[calc(100vh-64px)] overflow-hidden">
           {/* HEADER */}
           <div className="p-5 flex items-center justify-between border-b border-white/[0.05]">
              <div className="flex items-center gap-2 px-1">
                 <Sparkles size={16} className="text-[#8b5cf6]" />
                 <h2 className="text-[13px] font-semibold text-white tracking-[0.04em] uppercase">NEURO SEARCH</h2>
              </div>
              <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/25 rounded-md text-[10px] text-[#a78bfa] tracking-[0.06em] uppercase font-bold">
                 GROQ-L3
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {/* INTERACTIVE GUIDE CARD */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 mb-4">
                 <div className="flex items-center gap-2 mb-2.5">
                    <Info size={14} className="text-[#60a5fa]" />
                    <span className="text-[11px] font-bold tracking-[0.07em] text-[#60a5fa] uppercase">INTERACTIVE GUIDE</span>
                 </div>
                 <p className="text-[12.5px] text-white/45 leading-[1.6] mb-4">Explore our neural protocols or seek architectural enlightenment.</p>
                 <div className="flex flex-wrap gap-1.5 font-medium">
                    {['INSTALLER', 'API KEYS', 'THEMES'].map(chip => (
                      <button key={chip} className="bg-white/[0.04] border border-white/[0.09] rounded-lg px-2.5 py-1 text-[11px] text-white/50 tracking-[0.04em] uppercase hover:bg-indigo-500/10 hover:border-indigo-500/35 hover:text-[#c4b5fd] transition-all">
                        {chip}
                      </button>
                    ))}
                 </div>
              </div>

              {/* CONVERSATION AREA */}
              <div className="flex flex-col gap-4 py-2">
                 <div className="self-end max-w-[85%] bg-indigo-500/[0.15] border border-indigo-500/25 rounded-[14px_14px_4px_14px] px-3.5 py-2.5 text-[13px] text-white/85 leading-[1.6]">
                    Explain API Security
                 </div>
                 <div className="self-start max-w-[92%] bg-white/[0.03] border border-white/[0.07] border-l-[2px] border-[#8b5cf6]/50 rounded-[4px_14px_14px_14px] px-3.5 py-2.5 text-[13px] text-white/70 leading-[1.6]">
                    Our neural gateway employs AES-256 rotation protocols...
                 </div>
                 
                 {/* TYPING INDICATOR */}
                 <div className="flex gap-1 px-3.5 py-3">
                    {[0, 0.2, 0.4].map(delay => (
                      <div key={delay} className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" style={{ animation: `typingBounce 1.2s infinite ${delay}s` }} />
                    ))}
                 </div>
              </div>
           </div>

           {/* SEARCH INPUT */}
           <div className="p-4 border-t border-white/[0.05]">
              <div className="relative">
                 <input 
                   placeholder="Ask the AI agent..."
                   className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl py-3 pl-4 pr-12 text-[13px] text-white outline-none focus:border-indigo-500/45 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-white/25"
                 />
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] rounded-lg flex items-center justify-center hover:opacity-85 hover:scale-105 active:scale-95 transition-all">
                    <ArrowRight size={14} className="text-white" />
                 </button>
              </div>
           </div>
        </aside>
      </div>

    </div>
  );
}

import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X,
  Zap,
  Info,
  FileText,
  Search,
  MessageSquare,
  Cpu,
  ArrowRight,
  Sparkles,
  Command,
  Plus
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  return (
    <div className="min-h-screen text-[#1d1d1f] flex flex-col font-sans selection:bg-blue-500/10 overflow-x-hidden relative bg-[#ffffff]">
      
      {/* 🍏 PRO NEURAL SEARCH OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-xl flex items-start justify-center pt-32 px-4 animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-white border border-black/10 rounded-[2rem] shadow-2xl p-4 overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-2 border-b border-black/5">
                 <Search size={20} className="text-black/20" />
                 <input 
                   ref={searchInputRef}
                   value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Search documentation or studio artifacts..."
                   className="flex-1 bg-transparent py-4 text-[18px] font-medium outline-none placeholder:text-black/10"
                 />
                 <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-black/5 rounded-md text-[10px] font-bold text-black/30">
                    ESC
                 </kbd>
              </div>
              <div className="p-4 space-y-2">
                 {searchQuery.length > 2 ? (
                    <div className="py-12 flex flex-col items-center opacity-40">
                       <Zap size={32} className="mb-4" />
                       <span className="text-[12px] font-bold uppercase tracking-widest">Searching Neural Nodes...</span>
                    </div>
                 ) : (
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest block px-4 mb-3">Recent Injections</span>
                       {['Neural Architecture', 'AES-256 Rotation', 'Synthesis Tier'].map(item => (
                          <button key={item} className="w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 transition-colors flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <FileText size={16} className="text-black/20" />
                                <span className="text-[14px] font-medium text-black/60 group-hover:text-black">{item}</span>
                             </div>
                             <ArrowRight size={14} className="text-black/0 group-hover:text-black/20 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </button>
                       ))}
                    </div>
                 )}
              </div>
           </div>
           <div className="fixed inset-0 -z-10" onClick={() => setSearchOpen(false)} />
        </div>
      )}

      {/* 🍏 PRO APPLE LIGHT HEADER */}
      <header className={`fixed top-0 inset-x-0 h-12 z-50 flex items-center justify-between px-8 md:px-16 transition-all duration-300 ${
        scrolled 
        ? 'apple-glass shadow-sm' 
        : 'bg-transparent border-transparent'
      }`}>
        <Link to="/" className="flex items-center group transition-opacity h-full">
          <div className="w-6 h-6 rounded-lg bg-black flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg shadow-black/10">
             <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="ml-2.5 text-[14px] font-bold tracking-tight text-black">HGM-06 <span className="text-black/20 uppercase text-[10px] ml-1 tracking-[0.1em]">Pro</span></span>
        </Link>

        {/* 🍏 PRO TOP NAV — MINIMALIST SEARCH PILL */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-10">
           <button 
             onClick={() => setSearchOpen(true)}
             className="w-full flex items-center justify-between px-4 py-1.5 bg-black/[0.03] border border-black/[0.03] rounded-full text-black/25 hover:bg-black/[0.05] hover:border-black/[0.06] transition-all group"
           >
              <div className="flex items-center gap-3">
                 <Search size={14} className="group-hover:text-black/40 transition-colors" />
                 <span className="text-[11px] font-bold tracking-tight">Search Documentation</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-white border border-black/5 rounded-md text-[9px] font-bold text-black/20 shadow-sm">
                 <Command size={10} />
                 <span>K</span>
              </div>
           </button>
        </div>

        <div className="hidden md:flex items-center gap-8 h-full">
          {[
            { to: '/docs', label: 'Knowledge Base' },
            { to: '/codegen', label: 'Pro Studio' }
          ].map(link => (
            <Link 
              key={link.to} to={link.to} 
              className={`text-[12px] font-bold transition-all duration-200 uppercase tracking-[0.1em] ${
                location.pathname.startsWith(link.to) ? 'text-black' : 'text-black/35 hover:text-black/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-4 w-[1px] bg-black/10 mx-2" />
          <button className="apple-btn-black h-8 px-4 text-[10px] uppercase font-bold tracking-widest shadow-lg shadow-black/10">
             Upgrade Tier
          </button>
          <div className="flex md:hidden">
            <button className="p-2 text-black/50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex pt-12 w-full relative min-h-0">
        
        {/* LEFT SIDEBAR — 🍏 PRO CONTENT INDEX */}
        {location.pathname !== '/' && (
          <aside className="hidden lg:flex w-[240px] flex-col apple-sidebar sticky top-12 h-[calc(100vh-48px)] overflow-hidden">
             <div className="flex-1 overflow-y-auto py-10 no-scrollbar scroll-smooth">
                {[
                   { group: 'Knowledge Map', items: [
                     { label: 'Neural Overview', to: '/docs/intro', icon: <FileText size={14} /> },
                     { label: 'Adv. Architecture', to: '/docs/architecture', icon: <Cpu size={14} /> },
                     { label: 'API Ref (Pro)', to: '/docs/api-reference', icon: <Search size={14} /> }
                   ]},
                   { group: 'Pro Protocols', items: [
                      { label: 'Neural Security', to: '/docs/security', icon: <Info size={14} /> },
                      { label: 'Deployment Ops', to: '/docs/deployment', icon: <Zap size={14} /> },
                      { label: 'Refactor Standards', to: '/docs/best-practices', icon: <MessageSquare size={14} /> }
                   ]}
                ].map(group => (
                  <div key={group.group} className="mb-8">
                     <div className="px-7 mb-4">
                        <h3 className="text-[10px] font-bold tracking-[0.2em] text-black/15 uppercase">{group.group}</h3>
                     </div>
                     <div className="space-y-[2px]">
                        {group.items.map(item => (
                          <Link 
                            key={item.to} to={item.to}
                            className={`flex items-center gap-3.5 px-7 py-3 mx-2 rounded-xl text-[13px] font-medium transition-all relative ${
                               location.pathname === item.to 
                                 ? 'bg-black text-white shadow-xl shadow-black/10' 
                                 : 'text-black/40 hover:bg-black/5 hover:text-black'
                            }`}
                          >
                             <span className={location.pathname === item.to ? 'text-white' : 'text-inherit opacity-30 group-hover:opacity-100'}>
                               {item.icon}
                             </span>
                             {item.label}
                             {location.pathname === item.to && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                             )}
                          </Link>
                        ))}
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-auto border-t border-black/[0.04] p-7">
                <div className="p-4 rounded-2xl bg-black transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group shadow-xl shadow-black/10">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black text-white uppercase">AG</div>
                      <div className="flex flex-col">
                         <span className="text-[12px] font-bold text-white">Neural Hub Pro</span>
                         <span className="text-[9px] text-white/30 uppercase tracking-widest font-black">Admin Access</span>
                      </div>
                   </div>
                </div>
             </div>
          </aside>
        )}

        <main className={`flex-1 min-w-0 overflow-y-auto bg-transparent relative no-scrollbar ${location.pathname === '/' ? '' : 'px-0'}`}>
           <Outlet />
        </main>
      </div>

      {/* 🍏 NEURAL CHAT ASSISTANT (FLOATING PRO HELPER) */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-5">
         {chatOpen && (
           <div className="w-[380px] h-[580px] bg-white border border-black/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
              <div className="p-8 bg-black text-white flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Sparkles size={20} fill="white" />
                    <div className="flex flex-col">
                       <span className="text-[14px] font-bold tracking-tight">Neural Assistant</span>
                       <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">HGM-06 Core Engine</span>
                    </div>
                 </div>
                 <button onClick={() => setChatOpen(false)} className="p-2 transition-transform active:scale-90 opacity-40 hover:opacity-100">
                    <X size={20} />
                 </button>
              </div>
              <div className="flex-1 p-8 overflow-y-auto bg-[#f5f5f7]/50 no-scrollbar flex flex-col gap-8">
                 <div className="self-start max-w-[85%] bg-white p-5 rounded-[1.5rem] rounded-tl-none text-[13.5px] text-black/70 leading-relaxed shadow-sm border border-black/5">
                    Welcome to the Pro Layer. I am the neural bridge to your technical documentation. How can I assist you in your current architectural audit?
                 </div>
              </div>
              <div className="p-6 bg-white border-t border-black/5">
                 <div className="relative">
                    <input 
                      placeholder="Query the Pro Manifest..." 
                      className="w-full bg-[#f5f5f7] border border-black/5 rounded-2xl py-4 pl-5 pr-14 text-[13.5px] outline-none focus:bg-white focus:border-black/10 transition-all font-medium placeholder:text-black/20"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">
                       <ArrowRight size={18} />
                    </button>
                 </div>
              </div>
           </div>
         )}
         <button 
           onClick={() => setChatOpen(!chatOpen)}
           className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl shadow-black/20 hover:scale-110 active:scale-90 transition-all group"
         >
            {chatOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />}
            {!chatOpen && (
               <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-white animate-pulse" />
            )}
         </button>
      </div>

    </div>
  );
}

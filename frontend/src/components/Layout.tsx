import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X,
  Search,
  MessageSquare,
  Cpu,
  ArrowRight,
  Shield,
  Layers,
  Zap,
  Activity,
  FileText,
  Command,
  Sparkles
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
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
    <div className="min-h-screen text-[#1d1d1f] flex flex-col font-sans bg-[#ffffff] selection:bg-blue-500/10">
      
      {/* 🍏 APPLE SPOTLIGHT SEARCH (ULTRA MINIMAL) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-3xl flex items-start justify-center pt-[120px] px-4 animate-apple-fade">
           <div className="w-full max-w-[680px] bg-white border border-black/[0.08] rounded-[24px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.18)] p-4 overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-3 border-b border-black/[0.06]">
                 <Search size={22} className="text-black/30" strokeWidth={1.5} />
                 <input 
                   ref={searchInputRef}
                   value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Search Project Docs, Studio or Neural Nodes..."
                   className="flex-1 bg-transparent py-4 text-[20px] font-normal outline-none placeholder:text-black/15 text-[#1d1d1f] tracking-tight"
                 />
                 <kbd className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-black/[0.04] rounded-[8px] text-[11px] font-semibold text-black/25">
                    ESC
                 </kbd>
              </div>
              <div className="p-4 space-y-2">
                 <span className="text-[11px] font-semibold text-black/30 uppercase tracking-[0.16em] block px-4 pt-2 mb-4">Quick Links</span>
                 {['Neural Overview', 'API Manifest Pro', 'Architecture Layer'].map(item => (
                    <button key={item} onClick={() => setSearchOpen(false)} className="w-full text-left px-5 py-4 rounded-[14px] hover:bg-black/[0.04] transition-all flex items-center justify-between group">
                       <div className="flex items-center gap-5">
                          <FileText size={18} className="text-black/20" strokeWidth={1.2} />
                          <span className="text-[17px] font-normal text-black/80">{item}</span>
                       </div>
                       <ArrowRight size={18} className="text-black/0 group-hover:text-black/20 transition-all -translate-x-3 group-hover:translate-x-0" strokeWidth={1.2} />
                    </button>
                 ))}
              </div>
           </div>
           <div className="fixed inset-0 -z-10" onClick={() => setSearchOpen(false)} />
        </div>
      )}

      {/* 🍏 APPLE GLOBAL NAVIGATION (Structural Fix) */}
      <header className={`fixed top-0 inset-x-0 h-16 z-[100] transition-all duration-300 ${
        scrolled ? 'apple-nav shadow-sm' : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-[1240px] mx-auto px-6 md:px-10 h-full flex items-center justify-between gap-8">
          
          {/* LEFT: LOGO AREA (Locked Structure) */}
          <Link to="/" className="flex items-center group shrink-0">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Zap size={16} fill="white" className="text-white rotate-12" />
             </div>
             <span className="ml-4 text-[15px] font-bold tracking-tight text-black">HGM-06</span>
          </Link>

          {/* CENTER: PRIMARY NAV (Strict Flex) */}
          <nav className="hidden md:flex items-center gap-10">
             {[
               { to: '/docs', label: 'Guide', sub: 'Manifest' },
               { to: '/codegen', label: 'Studio', sub: 'Architecture' }
             ].map(link => (
               <Link 
                 key={link.to} to={link.to} 
                 className={`flex flex-col group ${location.pathname.startsWith(link.to) ? 'opacity-100' : 'opacity-40 hover:opacity-100'} transition-opacity`}
               >
                  <span className="text-[12px] font-bold tracking-tight">{link.label}</span>
                  <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[#0071e3] opacity-0 group-hover:opacity-100 transition-opacity">{link.sub}</span>
               </Link>
             ))}
          </nav>

          {/* RIGHT: ACTION AREA (Standardized) */}
          <div className="flex items-center gap-6 shrink-0">
             <button onClick={() => setSearchOpen(true)} className="p-2 opacity-30 hover:opacity-100 transition-opacity">
                <Search size={18} strokeWidth={2} />
             </button>
             <Link to="/codegen" className="hidden sm:block text-[12px] font-bold text-black/40 hover:text-black transition-colors">
                Support
             </Link>
             <Link to="/codegen" className="apple-btn-primary h-9 px-6 text-[12px] font-bold shadow-xl">
                Try Pro
             </Link>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER — FIXED SPACING GAPS */}
      <div className="flex-1 flex w-full relative min-h-0 bg-white">
        
        {/* 🍏 MINIMALIST SIDEBAR (APPLE SETTINGS STYLE) */}
        {location.pathname !== '/' && (
          <aside className="hidden lg:flex w-[260px] flex-col apple-sidebar sticky top-12 h-[calc(100vh-48px)] overflow-hidden">
             <div className="flex-1 overflow-y-auto pt-14 pb-10 no-scrollbar scroll-smooth">
                {[
                   { group: 'Foundations', items: [
                     { label: 'Neural Intro', to: '/docs/intro', icon: <FileText size={16} /> },
                     { label: 'Adv. Core', to: '/docs/architecture', icon: <Cpu size={16} /> },
                     { label: 'API Reference', to: '/docs/api-reference', icon: <Search size={16} /> }
                   ]},
                   { group: 'Protocols', items: [
                      { label: 'Sec. Rotation', to: '/docs/security', icon: <Shield size={16} /> },
                      { label: 'Deployment', to: '/docs/deployment', icon: <Zap size={16} /> },
                      { label: 'Refactor Ops', to: '/docs/best-practices', icon: <Layers size={16} /> }
                   ]}
                ].map(group => (
                  <div key={group.group} className="mb-10">
                     <div className="px-8 mb-4">
                        <h3 className="text-[11px] font-bold tracking-[0.14em] text-black/20 uppercase">{group.group}</h3>
                     </div>
                     <div className="space-y-[1px]">
                        {group.items.map(item => (
                          <Link 
                            key={item.to} to={item.to}
                            className={`flex items-center gap-4 px-8 py-3.5 mx-2 rounded-[10px] text-[15px] font-medium transition-all relative ${
                               location.pathname === item.to 
                                 ? 'bg-black/[0.04] text-black font-semibold shadow-sm' 
                                 : 'text-black/45 hover:bg-black/[0.02] hover:text-black/85'
                            }`}
                          >
                             <span className={location.pathname === item.to ? 'text-[#0071e3]' : 'text-inherit opacity-40 group-hover:opacity-100'}>
                               {item.icon}
                             </span>
                             {item.label}
                             {location.pathname === item.to && (
                                <div className="absolute left-[3px] top-[14px] bottom-[14px] w-[3px] bg-[#0071e3] rounded-full" />
                             )}
                          </Link>
                        ))}
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-auto border-t border-black/[0.04] p-8">
                <div className="flex items-center gap-4 opacity-55 hover:opacity-100 transition-opacity">
                   <div className="w-9 h-9 rounded-[10px] bg-black/[0.05] border border-black/[0.06] flex items-center justify-center text-[11px] font-bold text-black/80">AG</div>
                   <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-black tracking-tight">HGM Pro Lab</span>
                      <span className="text-[11px] text-black/25 uppercase font-bold tracking-widest">Premium</span>
                   </div>
                </div>
             </div>
          </aside>
        )}

        <main className={`flex-1 min-w-0 overflow-y-auto bg-transparent relative custom-scrollbar ${location.pathname === '/' ? '' : 'px-0'}`}>
           <Outlet />
        </main>
      </div>

      {/* 🍏 APPLE NEURAL CHAT (MESSAGES STYLE) */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-6">
         {chatOpen && (
           <div className="w-[420px] h-[640px] bg-white/95 backdrop-blur-2xl border border-black/[0.1] rounded-[28px] shadow-[0_40px_80px_-16px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-apple-slide">
              <div className="px-10 py-10 bg-[#f5f5f7] border-b border-black/[0.06] flex items-center justify-between">
                 <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-lg shadow-black/10">
                       <Sparkles size={18} fill="white" className="text-white" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[17px] font-bold text-black tracking-tight leading-none">Neural Support</span>
                       <span className="text-[12px] font-medium text-black/30 mt-2">v2.4 Active Session</span>
                    </div>
                 </div>
                 <button onClick={() => setChatOpen(false)} className="p-3 bg-black/[0.03] rounded-full hover:bg-black/[0.06] transition-colors">
                    <X size={18} className="text-black/40" />
                 </button>
              </div>
              <div className="flex-1 p-10 overflow-y-auto no-scrollbar flex flex-col gap-10">
                 <div className="self-start max-w-[85%] bg-[#0071e3] text-white p-6 rounded-[22px] rounded-tl-[4px] text-[16px] leading-[1.5] shadow-sm font-medium">
                    Hello. This is the HGM-06 Neural Assistant. I can help resolve architectural debt or answer questions about your documentation manifest.
                 </div>
              </div>
              <div className="p-8 bg-white border-t border-black/[0.04]">
                 <div className="relative">
                    <input 
                      placeholder="Consult the neural bridge..." 
                      className="w-full bg-[#f5f5f7] border border-black/[0.03] rounded-[18px] py-4 pl-6 pr-14 text-[16px] outline-none placeholder:text-black/20 font-medium"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-black text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all">
                       <ArrowRight size={20} strokeWidth={1.5} />
                    </button>
                 </div>
              </div>
           </div>
         )}
         <button 
           onClick={() => setChatOpen(!chatOpen)}
           className="w-16 h-16 bg-white border border-black/[0.08] text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all relative group"
         >
            {chatOpen ? <X size={24} strokeWidth={1.5} /> : <MessageSquare size={24} strokeWidth={1.2} className="group-hover:rotate-12 transition-transform" />}
            {!chatOpen && (
               <div className="absolute top-0 right-0 w-4 h-4 bg-[#0071e3] rounded-full border-[3px] border-white shadow-sm" />
            )}
         </button>
      </div>

    </div>
  );
}

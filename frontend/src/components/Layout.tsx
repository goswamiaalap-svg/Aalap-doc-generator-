import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, MessageSquare, Cpu, ArrowRight, Shield, Layers, Zap, Activity, FileText, Command, Sparkles, Network, Download 
} from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo, cloneElement } from 'react';
import Fuse from 'fuse.js';
import { docs } from '../api/docs';

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(() => new Fuse(docs, {
    keys: ['title', 'content', 'section'],
    threshold: 0.3,
    includeMatches: true
  }), []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 5);
  }, [searchQuery, fuse]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
    else setSearchQuery('');
  }, [searchOpen]);

  const handleSelectResult = (id: string) => {
    setSearchOpen(false);
    navigate(`/docs/${id}`);
  };

  return (
    <div className="min-h-screen text-[#1d1d1f] flex flex-col font-sans bg-[#ffffff] selection:bg-blue-500/10">
      
      {/* 🍏 APPLE SPOTLIGHT SEARCH (ULTRA MINIMAL) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-xl flex items-start justify-center pt-[120px] px-4 transition-none">
           <div className="w-full max-w-[680px] bg-white border border-black/[0.08] rounded-[24px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.18)] p-4 overflow-hidden animate-none">
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
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                 <span className="text-[11px] font-semibold text-black/30 uppercase tracking-[0.16em] block px-4 pt-2 mb-4">
                   {searchQuery.trim() ? 'Search Results' : 'Quick Links'}
                 </span>
                 
                 {searchQuery.trim() ? (
                   searchResults.length > 0 ? (
                     searchResults.map(result => (
                        <button key={result.item.id} onClick={() => handleSelectResult(result.item.id)} className="w-full text-left px-5 py-4 rounded-[14px] hover:bg-black/[0.04] transition-all flex items-center justify-between group">
                           <div className="flex flex-col gap-1">
                              <span className="text-[17px] font-medium text-black/80">{result.item.title}</span>
                              <span className="text-[11px] font-bold text-black/30 uppercase tracking-wider">{result.item.section}</span>
                           </div>
                           <ArrowRight size={18} className="text-black/0 group-hover:text-black/20 transition-all -translate-x-3 group-hover:translate-x-0" strokeWidth={1.2} />
                        </button>
                     ))
                   ) : (
                     <div className="px-5 py-8 text-center text-black/40 text-[14px] font-medium">No documentation found for "{searchQuery}"</div>
                   )
                 ) : (
                   ['Introduction', 'API Reference', 'Sec. Rotation'].map(item => (
                      <button key={item} onClick={() => handleSelectResult(docs.find(d => d.title === item)?.id || 'intro')} className="w-full text-left px-5 py-4 rounded-[14px] hover:bg-black/[0.04] transition-all flex items-center justify-between group">
                         <div className="flex items-center gap-5">
                            <FileText size={18} className="text-black/20" strokeWidth={1.2} />
                            <span className="text-[17px] font-normal text-black/80">{item}</span>
                         </div>
                         <ArrowRight size={18} className="text-black/0 group-hover:text-black/20 transition-all -translate-x-3 group-hover:translate-x-0" strokeWidth={1.2} />
                      </button>
                   ))
                 )}
              </div>
           </div>
           <div className="fixed inset-0 -z-10" onClick={() => setSearchOpen(false)} />
        </div>
      )}

      {/* 🍏 LAYER 1: PRIMARY GLOBAL NAVIGATION (H-16, TOP-0, Z-50) */}
      <header className="fixed top-0 inset-x-0 h-16 z-[100] bg-white border-b border-black/[0.08]">
        <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between gap-12 whitespace-nowrap">
          <Link to="/" className="flex items-center group shrink-0">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Zap size={16} fill="white" className="text-white rotate-12" />
             </div>
             <span className="ml-3 text-[15px] font-bold tracking-tight text-black">DocGen AI</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-10">
             <Link to="/" className="text-[12px] font-bold tracking-tight text-black/40 hover:text-black transition-colors">Home</Link>
             <Link to="/docs/intro" className="text-[12px] font-bold tracking-tight text-black/40 hover:text-black transition-colors">Documentation</Link>
             <Link to="/codegen" className="text-[12px] font-bold tracking-tight text-black/40 hover:text-black transition-colors">Studio</Link>
             <Link to="/#pricing" className="text-[12px] font-bold tracking-tight text-black/40 hover:text-black transition-colors">Pricing</Link>
             <Link to="/docs/api-reference" className="text-[12px] font-bold tracking-tight text-black/40 hover:text-black transition-colors">API Reference</Link>
          </nav>
          <div className="flex items-center gap-6 shrink-0">
             <button onClick={() => setSearchOpen(true)} className="p-2 opacity-30 hover:opacity-100 transition-opacity"><Search size={18} /></button>
             <a href="mailto:support@docgen.ai" className="hidden sm:block text-[12px] font-bold text-black/40 hover:text-black transition-colors">Support</a>
             <Link to="/#pricing" className="apple-btn-primary h-9 px-6 text-[12px] font-bold">Upgrade</Link>
          </div>
        </div>
      </header>

      {/* 🍏 LAYER 2: SECONDARY HUB TOOLBAR (H-14, TOP-16, Z-40) */}
      <div className="fixed top-16 inset-x-0 h-14 z-[90] bg-white border-b border-black/[0.04]">
         <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between gap-8 whitespace-nowrap overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2.5 bg-black/[0.03] px-4 py-1.5 rounded-full border border-black/[0.05]">
                  <div className="w-2 h-2 rounded-full bg-[#32d74b] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/60">v1.0.0 · Beta</span>
               </div>
               <div className="h-4 w-[1px] bg-black/[0.1]" />
               <span className="text-[11px] font-bold text-black/40 uppercase tracking-wider">Project: Neural_Manifest_v2.4</span>
            </div>
            <div className="flex items-center gap-10">
               {[
                  { label: 'Live Logs', icon: <Activity size={14} />, status: 'ACTIVE' },
                  { label: 'Analytical Nodes', icon: <Network size={14} />, status: 'SYNCED' },
                  { label: 'Export Ops', icon: <Download size={14} />, status: 'READY' }
               ].map(util => (
                  <button key={util.label} className="flex items-center gap-3 group">
                     <div className="p-2 rounded-lg bg-black/[0.02] group-hover:bg-black/5 transition-colors">
                        {React.cloneElement(util.icon as React.ReactElement, { className: 'text-black/30 group-hover:text-black transition-colors' })}
                     </div>
                     <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20 group-hover:text-black/40 transition-colors">{util.label}</span>
                        <span className="text-[9px] font-bold text-[#32d74b] mt-1">{util.status}</span>
                     </div>
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* 🍏 LAYER 3: TERTIARY TABS BAR (H-12, TOP-[7.5rem], Z-30) */}
      {location.pathname.startsWith('/docs') && (
        <div className="fixed top-[7.5rem] inset-x-0 h-12 z-[80] bg-white border-b border-black/[0.06]">
           <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center gap-12 overflow-x-auto no-scrollbar">
              <button className="h-full text-[11px] font-black uppercase tracking-[0.2em] relative transition-colors text-black">
                 Documentation
                 <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full" />
              </button>
           </div>
        </div>
      )}

      {/* MAIN CONTAINER — SYNCED WITH TRIPLE HEADERS (H-16 + H-14 + H-12 = 168px = 10.5rem) */}
      <div className="flex-1 flex pt-[10.5rem] w-full relative min-h-0 bg-white">
        
        {/* 🍏 MINIMALIST SIDEBAR (APPLE SETTINGS STYLE) */}
        {location.pathname.startsWith('/docs') && (
          <aside className="hidden lg:flex w-[260px] flex-col apple-sidebar sticky top-[10.5rem] h-[calc(100vh-10.5rem)] overflow-y-auto no-print">
             <div className="flex-1 overflow-y-auto pt-14 pb-10 no-scrollbar scroll-smooth">
                {[
                   { group: 'Foundations', items: [
                     { label: 'Introduction', to: '/docs/intro', icon: <FileText size={16} /> },
                     { label: 'Advanced Core', to: '/docs/adv-core', icon: <Cpu size={16} /> },
                     { label: 'API Reference', to: '/docs/api-reference', icon: <Search size={16} /> }
                   ]},
                   { group: 'Protocols', items: [
                      { label: 'Sec. Rotation', to: '/docs/sec-rotation', icon: <Shield size={16} /> },
                      { label: 'Deployment', to: '/docs/deployment', icon: <Zap size={16} /> },
                      { label: 'Refactor Ops', to: '/docs/refactor-ops', icon: <Layers size={16} /> }
                   ]},
                   { group: 'Legal', items: [
                      { label: 'Privacy Policy', to: '/docs/privacy', icon: <Shield size={16} /> },
                      { label: 'Terms of Service', to: '/docs/terms', icon: <FileText size={16} /> }
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
                <Link to="/#pricing" className="flex items-center gap-4 opacity-55 hover:opacity-100 transition-opacity">
                   <div className="w-9 h-9 rounded-[10px] bg-black/[0.05] border border-black/[0.06] flex items-center justify-center text-[11px] font-bold text-black/80">PRO</div>
                   <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-black tracking-tight">Upgrade to Pro</span>
                      <span className="text-[11px] text-black/25 uppercase font-bold tracking-widest">Premium</span>
                   </div>
                </Link>
             </div>
          </aside>
        )}

        <main className={`flex-1 min-w-0 overflow-y-auto bg-transparent relative custom-scrollbar ${location.pathname === '/' ? '' : 'px-0'}`}>
           <Outlet />
        </main>
      </div>

      {/* 🍏 APPLE NEURAL CHAT (REMOVED UNTIL BUILT) */}


    </div>
  );
}

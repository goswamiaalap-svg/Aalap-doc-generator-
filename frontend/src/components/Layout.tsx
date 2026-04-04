import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X,
  Zap,
  Info,
  FileText,
  Search,
  MessageSquare,
  ArrowRight,
  Code2,
  Cpu
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
    <div className="min-h-screen text-[#f5f5f7] flex flex-col font-sans selection:bg-blue-500/20 overflow-x-hidden relative bg-[#000000]">
      
      {/* 🍏 APPLE MINIMALIST HEADER */}
      <header className={`fixed top-0 inset-x-0 h-10 z-50 flex items-center justify-between px-8 md:px-16 transition-all duration-300 ${
        scrolled 
        ? 'apple-glass' 
        : 'bg-transparent'
      }`}>
        {/* LEFT — Logo area */}
        <Link to="/" className="flex items-center group transition-opacity h-full">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105">
             <Cpu size={12} className="text-black" />
          </div>
          <span className="ml-2 text-[13px] font-bold tracking-tight text-white/90">HGM-06</span>
        </Link>

        {/* CENTER — Nav links — APPLE MINIMALIST PILLS */}
        <nav className="hidden md:flex items-center h-full gap-8">
          {[
            { to: '/docs', label: 'Docs' },
            { to: '/codegen', label: 'Studio' }
          ].map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`text-[12px] font-medium transition-all duration-200 ${
                location.pathname.startsWith(link.to)
                ? 'text-white'
                : 'text-white/45 hover:text-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT AREA */}
        <div className="flex items-center gap-6 h-full">
          <Link to="/docs" className="text-[12px] font-medium text-white/80 hover:text-white transition-opacity">
            Learn More
          </Link>
          <button 
            className="md:hidden p-2 text-white/50" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex pt-10 w-full relative min-h-0">
        
        {/* LEFT SIDEBAR — 🍏 APPLE MINIMALIST SOBRIETY */}
        {location.pathname !== '/' && (
          <aside className="hidden lg:flex w-[220px] flex-col apple-sidebar sticky top-10 h-[calc(100vh-40px)] overflow-hidden">
             <div className="flex-1 overflow-y-auto py-8 no-scrollbar scroll-smooth">
                <div className="px-6 mb-4">
                   <h3 className="text-[10px] font-bold tracking-[0.14em] text-white/20 uppercase">SYSTEM</h3>
                </div>
                <div className="space-y-[4px]">
                   {[
                     { label: 'Overview', to: '/docs/intro', icon: <FileText size={14} /> },
                     { label: 'Architecture', to: '/docs/architecture', icon: <Code2 size={14} /> },
                     { label: 'API Reference', to: '/docs/api-reference', icon: <Search size={14} /> },
                     { label: 'Deployment', to: '/docs/deployment', icon: <Zap size={14} /> },
                     { label: 'Security', to: '/docs/security', icon: <MessageSquare size={14} /> }
                   ].map(item => (
                     <Link 
                       key={item.to}
                       to={item.to}
                       className={`flex items-center gap-3 px-6 py-2 mx-1.5 rounded-lg text-[12.5px] transition-all relative ${
                          location.pathname === item.to 
                            ? 'bg-white/[0.04] text-white font-medium' 
                            : 'text-white/40 hover:bg-white/[0.02] hover:text-white/80'
                       }`}
                     >
                        <span className={location.pathname === item.to ? 'text-white' : 'text-inherit opacity-40'}>
                          {item.icon}
                        </span>
                        {item.label}
                     </Link>
                   ))}
                </div>

                <div className="h-[1px] bg-white/[0.05] mx-6 my-6" />

                <div className="px-6 mb-3">
                   <h3 className="text-[10px] font-bold tracking-[0.14em] text-white/20 uppercase">AI</h3>
                </div>
                <Link to="/codegen" className="flex items-center gap-3 px-6 py-2 mx-1.5 rounded-lg text-[12.5px] text-white/40 hover:bg-white/[0.02] hover:text-white/80 transition-all font-medium">
                  Studio
                </Link>
             </div>

             {/* BOTTOM USER CARD */}
             <div className="mt-auto border-t border-white/[0.05] p-6">
                <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100">
                   <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                      AG
                   </div>
                   <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-medium text-white truncate">DocGen AI</span>
                      <span className="text-[10px] text-white/20 font-normal">Neural Tier</span>
                   </div>
                </div>
             </div>
          </aside>
        )}

        {/* MAIN VIEWER AREA */}
        <main className={`flex-1 min-w-0 overflow-y-auto bg-transparent relative ${location.pathname === '/' ? '' : 'px-0'}`}>
           <Outlet />
        </main>

        {/* RIGHT PANEL CACHE — APPLE MINIMALIST GUIDANCE */}
        {location.pathname.startsWith('/docs/') && (
          <aside className="hidden xl:flex w-[260px] flex-col border-l border-white/[0.06] sticky top-10 h-[calc(100vh-40px)] overflow-hidden">
             <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                   <Info size={14} className="text-white/20" />
                   <h2 className="text-[10px] font-bold text-white/30 tracking-[0.1em] uppercase leading-none">ANALYTICS</h2>
                </div>
                <div className="space-y-6">
                   <div className="bg-[#1c1c1e] p-4 rounded-xl">
                      <p className="text-[11px] text-white/50 leading-relaxed font-medium">Latent-Cycle active. All documentation is being synced to the edge.</p>
                   </div>
                   <div className="flex flex-col gap-3">
                      {['CORE', 'API'].map(tag => (
                        <div key={tag} className="flex justify-between items-center text-[10px] font-bold border-b border-white/[0.05] pb-2">
                           <span className="text-white/20">{tag}</span>
                           <span className="text-white/60">OK</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </aside>
        )}

      </div>
    </div>
  );
}

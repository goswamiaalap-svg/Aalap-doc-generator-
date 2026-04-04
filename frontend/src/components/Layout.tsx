import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Code2, 
  BookOpen, 
  Menu, 
  X,
  Zap,
  Globe,
  Settings2
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* RADIANT BACKGROUND EFFECTS */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      {/* TOP NAVIGATION: ULTIMATE GLASSMORPHY */}
      <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 border-b ${
        scrolled ? 'h-16 bg-black/40 backdrop-blur-2xl border-white/10 shadow-2xl' : 'h-20 bg-transparent border-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">
               <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">HGM-06</span>
          </Link>

          {/* MAIN NAV LINKS */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { to: '/docs', icon: <BookOpen size={16}/>, label: 'Documentation' },
              { to: '/codegen', icon: <Code2 size={16}/>, label: 'Neuro-Engine' }
            ].map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                  location.pathname.startsWith(link.to) 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
                {location.pathname.startsWith(link.to) && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* SYSTEM STATUS & CTAs */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
               <span className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500"/> Edge: Verified</span>
               <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500"/> Power: Unlimited</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10 hidden lg:block" />
            <button className="hidden sm:flex p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
               <Settings2 size={18} />
            </button>
            <button 
              className="md:hidden p-2 text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 flex flex-col p-8">
           <div className="flex items-center justify-between mb-20">
              <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <Sparkles size={24} className="text-blue-500" />
                <span className="text-2xl font-black uppercase tracking-tighter">HGM-06</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400"><X size={32}/></button>
           </div>
           
           <div className="space-y-6 flex flex-col items-center">
              {[
                { to: '/docs', label: 'Documentation' },
                { to: '/codegen', label: 'Neuro-Engine' }
              ].map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-black uppercase tracking-tighter hover:text-blue-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
           </div>

           <div className="mt-auto flex flex-col items-center gap-4 opacity-40">
              <Zap size={40} className="text-blue-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Core Active</p>
           </div>
        </div>
      )}

      {/* PAGE WRAPPER */}
      <main className="flex-1 flex flex-col pt-20 w-full relative z-10 transition-all duration-700">
        <div className="flex-1 w-full flex flex-col">
           <Outlet />
        </div>
      </main>
      
    </div>
  );
}

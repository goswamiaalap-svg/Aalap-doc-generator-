import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Globe,
  Code2,
  Shield,
  Layers,
  Activity,
  Zap,
  MessageSquare,
  Cpu,
  Zap as Power,
  CloudLightning,
  Sparkles,
  Search,
  Command,
  Plus
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-40 pb-48 px-8 relative z-10 animate-apple-in max-w-[1400px] mx-auto bg-[#ffffff]">
      
      {/* 🍏 APPLE LIGHT HERO — PRO TRANSFORMATION */}
      <div className="w-full text-center mb-56 relative group">
        
        {/* PRO BADGE — 🍏 APPLE SOPRIETY */}
        <div className="flex items-center justify-center gap-2.5 mb-10 group-hover:scale-105 transition-transform">
           <div className="px-4 py-1.5 rounded-full bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase shadow-xl shadow-black/10">
             HGM-06 PRO v2.4
           </div>
        </div>

        <h1 className="text-6xl md:text-9xl font-bold tracking-[-0.055em] leading-[0.98] text-[#1d1d1f] selection:bg-blue-500 mb-14 transition-all">
          Documentation. <br/>
          <span className="text-black/15">Re-Engineered.</span>
        </h1>

        <p className="text-lg md:text-2xl text-[#1d1d1f]/45 max-w-2xl mx-auto mb-16 leading-[1.4] font-medium tracking-tight">
          The ultimate pro engine for technical artifacts. Analyze, generate, and synchronize your documentation at the speed of thought.
        </p>

        {/* PRO BUTTONS — APPLE BLACK PILLS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
           <Link to="/docs" className="apple-btn-black min-w-[240px] h-[64px] flex items-center justify-center text-[17px] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
              Initialize Platform
           </Link>
           <Link to="/codegen" className="apple-btn-outline min-w-[240px] h-[64px] flex items-center justify-center text-[17px] group border-black/10 hover:border-black/30">
              Neural Studio Pro
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-0.5 transition-transform text-black/20" />
           </Link>
        </div>
      </div>

      {/* 🍏 CONTENT EXTENSION: PRO CORE EXHIBIT */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-t border-black/[0.06] pt-32 pb-32">
        {[
          {
            icon: <MessageSquare size={26} className="text-blue-500" />,
            title: "Neural Chat Interop",
            desc: "The only documentation platform with a built-in neural assistant that understands your architectural drift in real-time."
          },
          {
            icon: <Search size={26} className="text-purple-500" />,
            title: "Latent Search Engine",
            desc: "Global fuzzy-search enabled with CMD+K. Find any code block, docstring, or API reference in sub-10ms."
          },
          {
            icon: <CloudLightning size={26} className="text-orange-500" />,
            title: "Edge Delivery Pro",
            desc: "DocGen artifacts are synchronized to 32+ global edge nodes for instant worldwide technical access."
          },
          {
            icon: <Shield size={26} className="text-emerald-500" />,
            title: "Sovereign Rotation",
            desc: "AES-256 rotating key protocols ensure that your proprietary logic buffers are segmented and cryptographically isolated."
          },
          {
            icon: <Power size={26} className="text-amber-500" />,
            title: "Universal Synthesis",
            desc: "Support for C++, Java, Rust, Swift, and Go. One-click export to MDX, PDF, and Open-API standard artifacts."
          },
          {
            icon: <Activity size={26} className="text-rose-500" />,
            title: "Neural Rank Scoring",
            desc: "Professional health metrics for your code comments and READMEs. Assesses risk, density, and maintenance cost."
          },
          {
            icon: <Layers size={26} className="text-indigo-500" />,
            title: "Mermaid Autopilot",
            desc: "Visualizing logical flow has never been faster. Automatic Mermaid diagram generation from raw code paths."
          },
          {
            icon: <Sparkles size={26} className="text-cyan-500" />,
            title: "Pro Voice Briefing",
            desc: "Natural human-sync audio summaries of your documentation. Listen to code audits on the go."
          }
        ].map((feature, i) => (
          <div key={i} className="flex flex-col group p-10 rounded-[2.5rem] bg-[#f5f5f7]/40 border border-black/[0.03] hover:bg-white hover:shadow-2xl hover:shadow-black/5 hover:border-black/5 transition-all duration-500">
            <div className="mb-10 p-4 rounded-2xl bg-white shadow-sm inline-block self-start group-hover:scale-110 transition-transform">
               {feature.icon}
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-4 tracking-tight leading-tight">{feature.title}</h3>
            <p className="text-[14px] text-[#1d1d1f]/40 leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* 🍏 SEARCH-EXPERIENCE PRO SHOWCASE */}
      <div className="w-full mt-24 p-16 md:p-32 bg-black rounded-[5rem] flex flex-col md:flex-row items-center justify-between gap-16 overflow-hidden relative shadow-2xl shadow-black/20">
         <div className="flex flex-col gap-10 max-w-2xl relative z-10 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
               <div className="w-12 h-[2px] bg-white opacity-20" />
               <span className="text-white/40 text-[13px] font-bold tracking-[0.3em] uppercase">Intelligence Discovery</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.95]">
               Search your <br/> logic. <span className="text-white/40 underline decoration-white/20 underline-offset-8">Instantly.</span>
            </h2>
            <p className="text-xl text-white/45 font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
               Experience the power of Neural Search. Find any architectural detail or documentation node across your entire project with a simple shortcut.
            </p>
            <div className="flex pt-6 justify-center md:justify-start">
               <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full border border-white/10 text-white/70 font-bold text-[14px] shadow-inner">
                  <Command size={18} fill="white" className="opacity-40" />
                  <span>Press <kbd className="text-white font-black ml-1">K</kbd> to Begin Experience</span>
               </div>
            </div>
         </div>
      </div>

      {/* 🍏 APPLE SIMPLE PRO LIGHT FOOTER */}
      <div className="mt-56 w-full flex flex-col md:flex-row items-center justify-between border-t border-black/[0.06] pt-16 gap-8 opacity-40 grayscale hover:grayscale-0 transition-opacity">
         <div className="flex items-center gap-12">
            <Layers size={18} />
            <Search size={18} />
            <Shield size={18} />
            <Globe size={18} />
         </div>
         <div className="text-[11px] font-bold tracking-[0.15em] text-[#1d1d1f]/50 uppercase">
            © 2026 HGM-06 NEURAL HUB PRO — GLOBAL ARCHITECTURAL STANDARDS
         </div>
      </div>
      
    </div>
  );
}

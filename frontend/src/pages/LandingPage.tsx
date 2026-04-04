import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Code2, 
  Search, 
  ArrowRight, 
  Zap, 
  Globe 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden selection:bg-blue-500/30">
      
      {/* GLOBAL NEON OVERLAYS: Dual-Tone Gold (Left) & Blue (Right) */}
      <div className="absolute top-[-10%] left-[-20%] w-[1200px] h-[1200px] bg-amber-600/15 blur-[180px] rounded-full animate-pulse-slow pointer-events-none" />
      <div className="radiant-arc top-[5%] left-[-15%] opacity-30 pointer-events-none rotate-6" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse delay-1000 pointer-events-none" />

      {/* FLOATING HEADER */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 backdrop-blur-md bg-black/20 border-b border-white/5 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">HGM-06</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
          <Link to="/docs" className="hover:text-amber-400 transition-colors">Documentation</Link>
          <Link to="/codegen" className="hover:text-orange-400 transition-colors">Neuro-Engine</Link>
          <a href="#" className="hover:text-white transition-colors opacity-30 cursor-not-allowed">API Ref</a>
        </div>
        <Link to="/codegen" className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
          Deploy Hub
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 sm:px-12">
        <div className="max-w-5xl text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-amber-400 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Zap size={14} className="fill-amber-400" />
            <span>Powered by Llama 3.3 Advanced Neural Stream</span>
          </div>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter sm:leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 uppercase">
            Track, Generate, & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]">Achieve Excellence</span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Auto-generating, AI-indexed, and instantly deployed. <br className="hidden sm:block"/>
            The world's first serverless-native neural documentation ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link to="/docs" className="w-full sm:w-auto group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-sm font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(245,158,11,0.25)] hover:scale-105 transition-all overflow-hidden">
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
               <div className="relative flex items-center justify-center gap-3">
                  Analyze docs <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </div>
            </Link>
            <Link to="/codegen" className="w-full sm:w-auto group px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3">
               Start CodeGen <Code2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
          {[
            {
              icon: <Search className="text-amber-400" />,
              title: "AI Search Pulse",
              desc: "Instantly query your documentation. Our Groq-powered search streams answers with zero latency and full file citations.",
              gradient: "from-amber-500/20 to-transparent"
            },
            {
              icon: <Code2 className="text-orange-400" />,
              title: "Neural CodeGen",
              desc: "Inject raw source code. Extract structured READMEs, API references, and Mermaid diagrams from a single neural pass.",
              gradient: "from-orange-500/20 to-transparent"
            },
            {
              icon: <Globe className="text-yellow-400" />,
              title: "Serverless Deployment",
              desc: "Deployed to the global Vercel edge. Instantly accessible with AST-based dynamic routing and dark-mode aesthetics.",
              gradient: "from-yellow-500/20 to-transparent"
            }
          ].map((feature, i) => (
            <div key={i} className="group relative p-8 bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500">
              <div className={`absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl ${feature.gradient} blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700`} />
              <div className="p-3 bg-white/5 rounded-2xl w-fit mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-4 tracking-tight uppercase group-hover:text-amber-400 transition-colors">{feature.title}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* STATS STRIP */}
        <div className="w-full max-w-7xl mt-40 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 text-center opacity-60">
           <div>
              <p className="text-3xl font-black text-white leading-none">0.8ms</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3">Mean Latency</p>
           </div>
           <div>
              <p className="text-3xl font-black text-white leading-none">12.4M</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3">Syntheses</p>
           </div>
           <div>
              <p className="text-3xl font-black text-white leading-none">99.9%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3">Neuro-Uptime</p>
           </div>
           <div>
              <p className="text-3xl font-black text-white leading-none">∞ Free</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3">Tier Limitless</p>
           </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-3">
              <Sparkles size={20} />
              <span className="text-xs font-black uppercase tracking-widest">HGM-06 Neural Labs</span>
           </div>
           <div className="text-[10px] font-medium tracking-widest uppercase">
              © 2026 Developed by Clubers for AI-Native Scalability
           </div>
           <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Docs</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

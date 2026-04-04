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
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden selection:bg-orange-500/30">
      
      {/* FLOATING HEADER: THEMED */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 bg-black/20 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter logo-gradient">HGM-06</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
          <Link to="/docs" className="hover:text-amber-400 transition-colors">Documentation</Link>
          <Link to="/codegen" className="hover:text-orange-400 transition-colors">Neuro-Engine</Link>
          <a href="#" className="hover:text-white transition-colors opacity-30 cursor-not-allowed uppercase">API Ref</a>
        </div>
        <Link to="/codegen" className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
          Deploy Hub
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 sm:px-12">
        <div className="max-w-5xl text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-[10px] font-black uppercase tracking-widest text-amber-500 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Zap size={14} className="fill-amber-500" />
            <span>Neural Engine Cluster Alpha</span>
          </div>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter sm:leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 uppercase">
            Track, Generate, & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-indigo-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">Achieve Excellence</span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Automating the bridge between raw source logic and elite technical documentation. <br className="hidden sm:block"/>
            The world's most advanced serverless-native neural documentation ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link to="/docs" className="w-full sm:w-auto group relative px-10 py-5 bg-gradient-to-r from-orange-600 to-indigo-600 rounded-2xl text-sm font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(245,110,11,0.2)] hover:scale-105 transition-all overflow-hidden text-center">
               <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
               <div className="relative flex items-center justify-center gap-3">
                  Analyze Docs <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </div>
            </Link>
            <Link to="/codegen" className="w-full sm:w-auto group px-10 py-5 glass-card rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-center">
               Start CodeGen <Code2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
          {[
            {
              icon: <Search className="text-amber-500" />,
              title: "AI Search Pulse",
              desc: "Instantly query your documentation. Our Groq-powered search streams answers with zero latency and full file citations."
            },
            {
              icon: <Code2 className="text-orange-500" />,
              title: "Neural CodeGen",
              desc: "Inject raw source code. Extract structured READMEs, API references, and Mermaid diagrams from a single neural pass."
            },
            {
              icon: <Globe className="text-indigo-400" />,
              title: "Serverless Deployment",
              desc: "Deployed to the global Vercel edge. Instantly accessible with AST-based dynamic routing and dark-mode aesthetics."
            }
          ].map((feature, i) => (
            <div key={i} className="group relative p-8 glass-card rounded-3xl overflow-hidden hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500">
              <div className="p-3 bg-white/5 rounded-2xl w-fit mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-4 tracking-tight uppercase group-hover:text-amber-500 transition-colors">{feature.title}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* STATS STRIP */}
        <div className="w-full max-w-7xl mt-40 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 text-center opacity-60">
           <div>
              <p className="text-3xl font-black text-white leading-none">0.8ms</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 underline decoration-amber-500/50 underline-offset-4">Mean Latency</p>
           </div>
           <div>
              <p className="text-3xl font-black text-white leading-none">12.4M</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 underline decoration-orange-500/50 underline-offset-4">Syntheses</p>
           </div>
           <div>
              <p className="text-3xl font-black text-white leading-none">99.9%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 underline decoration-indigo-500/50 underline-offset-4">Neuro-Uptime</p>
           </div>
           <div>
              <p className="text-3xl font-black text-white leading-none">∞ Free</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 underline decoration-white/20 underline-offset-4">Tier Limitless</p>
           </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-orange-500" />
              <span className="text-xs font-black uppercase tracking-widest text-white">HGM-06 Neural Labs</span>
           </div>
           <div className="text-[10px] font-medium tracking-[0.3em] uppercase">
              © 2026 Developed by Clubers for AI-Native Scalability
           </div>
           <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <a href="#" className="hover:text-amber-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

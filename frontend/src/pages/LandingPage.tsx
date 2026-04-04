import { Link } from 'react-router-dom';
import { 
  Code2, 
  Search, 
  Zap, 
  Sparkles,
  Layers,
  Cpu,
  Activity
} from 'lucide-react';
import TiltCard from '../components/TiltCard';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 sm:px-12 relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      <div className="max-w-6xl w-full">
        <TiltCard maxTilt={3}>
           <div className="glass-card rounded-[2.5rem] p-12 md:p-24 relative overflow-hidden backdrop-blur-2xl">
              
              {/* STATUS BAR: NEURAL SYNC */}
              <div className="flex items-center gap-6 mb-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#22c55e]">
                    <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]" />
                    <span>NEURAL SYNC ACTIVE</span>
                 </div>
                 <div className="px-3 py-1 bg-white/[0.06] rounded-md text-[10px] font-black uppercase tracking-widest text-white/50">v2.4.0</div>
                 <div className="px-3 py-1 border border-[#22c55e]/30 rounded-md text-[10px] font-black uppercase tracking-widest text-[#22c55e] flex items-center gap-2">
                    <Zap size={10} className="fill-[#22c55e]" /> VERIFIED
                 </div>
              </div>

              {/* MAIN TITLING */}
              <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-16">
                 <div className="flex-1">
                    <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-tight bg-gradient-to-br from-white to-white/30 bg-clip-text text-transparent uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">
                       TRACK, GENERATE, & <br/>
                       <span className="logo-gradient">ACHIEVE EXCELLENCE</span>
                    </h1>
                 </div>
                 
                 {/* FLOATING ACTIONS */}
                 <div className="flex gap-4 mb-2">
                    {[Sparkles, Layers, Cpu].map((Icon, i) => (
                      <button key={i} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-white/60 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-white hover:scale-110 hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] transition-all">
                         <Icon size={20} />
                      </button>
                    ))}
                 </div>
              </div>

              <p className="text-lg md:text-2xl text-white/55 max-w-4xl font-medium leading-relaxed mb-16 uppercase tracking-wider">
                 DEPLOYING THE WORLD'S MOST ADVANCED SERVERLESS-NATIVE NEURAL DOCUMENTATION ECOSYSTEM. ALPHA GENERATION PIPELINES ACTIVATED.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                 <Link to="/docs" className="w-full sm:w-auto group relative px-12 py-6 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:scale-105 active:scale-95 transition-all text-center">
                    ANALYZE PROTOCOLS
                 </Link>
                 <Link to="/codegen" className="w-full sm:w-auto group px-12 py-6 glass-card rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all flex items-center justify-center gap-4 text-center">
                    CODEGEN ENGINE <Code2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                 </Link>
              </div>
           </div>
        </TiltCard>

        {/* FEATURE GRID: DATA CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            {
              icon: <Search className="text-indigo-400" />,
              title: "AI SEARCH PULSE",
              desc: "INSTANTLY QUERY DOCUMENTATION. GROQ-POWERED SEARCH STREAMS ANSWERS WITH ZERO LATENCY CITATIONS."
            },
            {
              icon: <Code2 className="text-[#06b6d4]" />,
              title: "NEURAL CODEGEN",
              desc: "EXTRACT STRUCTURED README AND API REFERENCES FROM RAW SOURCE LOGIC IN A SINGLE NEURAL PASS."
            },
            {
              icon: <Activity className="text-emerald-400" />,
              title: "SERVERLESS FLOW",
              desc: "DEPLOYED TO THE GLOBAL VERCEL EDGE. ACCESSIBLE WITH AST-BASED DYNAMIC ROUTING PROTOCOLS."
            }
          ].map((feature, i) => (
            <TiltCard key={i} maxTilt={6}>
              <div className="glass-card p-10 rounded-[2rem] h-full hover:bg-white/[0.05] transition-colors border-indigo-500/10 hover:border-indigo-500/30">
                <div className="p-4 bg-white/[0.02] rounded-2xl w-fit mb-8 shadow-inner shadow-white/5">
                   {feature.icon}
                </div>
                <h3 className="text-lg font-black mb-4 tracking-[0.2em] text-white uppercase group-hover:text-indigo-400">{feature.title}</h3>
                <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose">{feature.desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
      
    </div>
  );
}

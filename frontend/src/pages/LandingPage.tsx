import { Link } from 'react-router-dom';
import { 
  Code2, 
  Search, 
  Zap, 
  Sparkles,
  ArrowRight,
  Activity,
  Shield,
  Layers
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-8 relative z-10 animate-fade-up">
      
      <div className="max-w-[1000px] w-full text-center mb-24">
        {/* STATUS BADGE */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-up [animation-delay:100ms]">
           <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-400 tracking-[0.08em] uppercase">
             Version 2.4.0 Alpha
           </div>
        </div>

        {/* HERO TITLE */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.1] text-white mb-8 animate-fade-up [animation-delay:200ms]">
          Streamline your <br/>
          <span className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">Documentation</span> Lifecycle
        </h1>

        <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up [animation-delay:300ms]">
          Deploying the world's most advanced neural engine for automated code analysis, README generation, and interactive technical guides.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up [animation-delay:400ms]">
           <Link to="/docs" className="fusion-btn-primary w-full sm:w-auto h-[48px] flex items-center justify-center px-10">
              Get Started
           </Link>
           <Link to="/codegen" className="group w-full sm:w-auto h-[48px] px-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center gap-2 text-sm font-semibold text-white hover:bg-white/10 transition-all">
              Launch Neuro-Engine
              <ArrowRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
           </Link>
        </div>
      </div>

      {/* FEATURE GRID */}
      <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up [animation-delay:500ms]">
        {[
          {
            icon: <Search className="text-[#60a5fa]" />,
            title: "Neural Search",
            desc: "Instantly query your documentation store using our Groq-powered AI conversational agent."
          },
          {
            icon: <Code2 className="text-[#a78bfa]" />,
            title: "Auto-Gen Engine",
            desc: "Convert raw source logic into professional API references, READMEs, and technical diagrams."
          },
          {
            icon: <Shield className="text-[#34d399]" />,
            title: "Alpha Security",
            desc: "AES-256 rotation protocols ensure your proprietary logic remains segmented and secure."
          }
        ].map((feature, i) => (
          <div key={i} className="glass-panel p-8 rounded-2xl hover:bg-white/[0.05] border-white/10 transition-all flex flex-col group">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               {feature.icon}
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-[14px] text-white/45 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* FOOTER STATS */}
      <div className="mt-32 w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-12 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
         <div className="flex items-center gap-6">
            <Layers size={18} />
            <Activity size={18} />
            <Shield size={18} />
            <Zap size={18} />
         </div>
         <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-white/60">
            © 2026 HGM-06 NEURAL HUB / POWERED BY VERCEL & GROQ
         </div>
      </div>
      
    </div>
  );
}

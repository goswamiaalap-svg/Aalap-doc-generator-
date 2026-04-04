import { Link } from 'react-router-dom';
import { 
  Code2, 
  Search, 
  Zap, 
  ArrowRight,
  Shield,
  Layers,
  Activity
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-8 relative z-10 animate-fade-up">
      
      <div className="max-w-[1000px] w-full text-center mb-28">
        {/* STATUS BADGE — FUSIONAI STYLE */}
        <div className="flex items-center justify-center gap-2 mb-10 animate-fade-up [animation-delay:100ms]">
           <div className="px-3.5 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/25 text-[11px] font-bold text-[#a78bfa] tracking-[0.08em] uppercase">
             VERSION 2.4.0 ALPHA
           </div>
        </div>

        {/* HERO TITLE — GRADIENT HEADLINE SOURCE: FUSIONAI */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.1] text-white mb-10 animate-fade-up [animation-delay:200ms]">
          Streamline your <br/>
          <span className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">Documentation</span> Lifecycle
        </h1>

        <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up [animation-delay:300ms]">
          Deploying the world's most advanced neural engine for automated code analysis, README generation, and interactive technical guides.
        </p>

        {/* CTA BUTTONS — FUSIONAI EXACT PILL STYLE */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-up [animation-delay:400ms]">
           <Link to="/docs" className="fusion-btn-primary min-w-[180px] h-[52px]">
              Get Started
           </Link>
           <Link to="/codegen" className="fusion-btn-secondary min-w-[180px] h-[52px] group">
              Launch Neuro-Engine
              <ArrowRight size={16} className="ml-1.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
           </Link>
        </div>
      </div>

      {/* FEATURE GRID — FUSIONAI HIGH-GLOSS FROSTED CARDS */}
      <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up [animation-delay:500ms]">
        {[
          {
            icon: <Search size={20} className="text-[#60a5fa]" />,
            title: "Neural Search",
            desc: "Instantly query your documentation store using our Groq-powered AI conversational agent."
          },
          {
            icon: <Code2 size={20} className="text-[#a78bfa]" />,
            title: "Auto-Gen Engine",
            desc: "Convert raw source logic into professional API references, READMEs, and technical diagrams."
          },
          {
            icon: <Shield size={20} className="text-[#34d399]" />,
            title: "Alpha Security",
            desc: "AES-256 rotation protocols ensure your proprietary logic remains segmented and secure."
          }
        ].map((feature, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-8 rounded-2xl hover:bg-white/[0.07] hover:border-[#7c3aed]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               {feature.icon}
            </div>
            <h3 className="text-[17px] font-bold text-white mb-3 tracking-[-0.01em]">{feature.title}</h3>
            <p className="text-[14px] text-white/45 leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* FOOTER STATS — FUSIONAI MINIMAL FOOTER */}
      <div className="mt-32 w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between border-t border-white/[0.05] pt-12 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
         <div className="flex items-center gap-7">
            <Layers size={18} />
            <Activity size={18} />
            <Shield size={18} />
            <Zap size={18} />
         </div>
         <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/50">
            © 2026 HGM-06 NEURO HUB / POWERED BY VERCEL & GROQ
         </div>
      </div>
      
    </div>
  );
}

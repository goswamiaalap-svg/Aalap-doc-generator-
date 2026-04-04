import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Search,
  Code2,
  Shield,
  Layers,
  Activity,
  Zap,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-48 pb-32 px-8 relative z-10 animate-apple-in max-w-[1400px] mx-auto bg-[#000000]">
      
      {/* 🍏 APPLE MINIMALIST HERO */}
      <div className="w-full text-center mb-36">
        
        {/* HERO TITLE — APPLE CRISP SOBRIETY */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.045em] leading-[1.0] text-white selection:bg-blue-500 mb-12">
          Documentation. <br/>
          <span className="text-white/40">Synthesized.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/45 max-w-xl mx-auto mb-14 leading-[1.5] font-medium tracking-tight">
          A minimalist engine for technical artifacts. Analyze logic, generate references, and deploy instant guides.
        </p>

        {/* PRO BUTTONS — APPLE PILLS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
           <Link to="/docs" className="apple-btn-white min-w-[200px] h-[58px] flex items-center justify-center text-[16px]">
              Explore Platform
           </Link>
           <Link to="/codegen" className="apple-btn-outline min-w-[200px] h-[58px] flex items-center justify-center text-[16px] group">
              Neural Studio
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-0.5 transition-transform text-white/40" />
           </Link>
        </div>
      </div>

      {/* 🍎 APPLE MINIMALIST FEATURES GRID */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/[0.06] pt-24 px-4 md:px-0">
        {[
          {
            icon: <Globe size={24} className="text-white/40" />,
            title: "Global Sync",
            desc: "Synchronize documentation artifacts to edge locations in milliseconds."
          },
          {
            icon: <Code2 size={24} className="text-white/40" />,
            title: "Cross-Language",
            desc: "Supports C++, Java, Rust, and TypeScript with native neural decoding."
          },
          {
            icon: <Shield size={24} className="text-white/40" />,
            title: "Private Core",
            desc: "AES-256 rotation ensures internal proprietary logic is never surfaced."
          }
        ].map((feature, i) => (
          <div key={i} className="flex flex-col group py-4 transition-opacity">
            <div className="mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
               {feature.icon}
            </div>
            <h3 className="text-[20px] font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
            <p className="text-[15px] text-white/40 leading-[1.6] font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* 🍏 APPLE SIMPLE FOOTER SYNC */}
      <div className="mt-48 w-full flex flex-col md:flex-row items-center justify-between border-t border-white/[0.05] pt-12 gap-8 opacity-40 grayscale hover:grayscale-0 transition-opacity">
         <div className="flex items-center gap-8">
            <Layers size={18} />
            <Activity size={18} />
            <Shield size={18} />
            <Zap size={18} />
         </div>
         <div className="text-[11px] font-bold tracking-[0.1em] text-white/50 uppercase">
            © 2026 HGM-06 LABS — MINIMALIST ARCHIVE ENGINE
         </div>
      </div>
      
    </div>
  );
}

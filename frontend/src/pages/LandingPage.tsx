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
  CloudLightning,
  Sparkles,
  Command
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-[140px] pb-60 px-8 relative z-10 animate-apple-fade max-w-[1500px] mx-auto bg-[#ffffff]">
      
      {/* 🍏 APPLE HOME PAGE HERO — PURE CRYSTAL DESIGN */}
      <div className="w-full text-center mb-80 relative group">
        
        {/* ALPHA BADGE — 🍏 APPLE PRO BADGING */}
        <div className="flex items-center justify-center gap-3 mb-16">
           <div className="px-5 py-2 rounded-full bg-black/[0.04] border border-black/[0.03] text-[12px] font-bold text-black/40 tracking-[0.18em] uppercase">
             HGM-06 PRO v2.4
           </div>
        </div>

        <h1 className="text-6xl md:text-[120px] font-bold tracking-[-0.05em] leading-[0.94] text-[#1d1d1f] selection:bg-[#0071e3]/10 mb-16 animate-apple-slide">
          Analyze Code. <br/>
          <span className="text-black/15">Understand Meaning.</span>
        </h1>

        <p className="text-xl md:text-[28px] text-[#1d1d1f]/45 max-w-2xl mx-auto mb-20 leading-[1.3] font-medium tracking-tight animate-apple-slide [animation-delay:100ms]">
          A world-class documentation engine. Effortlessly generate technical artifacts and architectural insights.
        </p>

        {/* PRO CALL TO ACTION — APPLE PRIMARY PILL */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-apple-slide [animation-delay:200ms]">
           <Link to="/docs" className="apple-btn-primary min-w-[260px] h-[72px] flex items-center justify-center text-[19px] shadow-[0_20px_40px_-8px_rgba(0,113,227,0.3)]">
              Initialize Suite
           </Link>
           <Link to="/codegen" className="apple-btn-secondary text-[19px] font-medium group">
              Neural Studio Pro
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1.5 transition-transform text-[#0071e3]" strokeWidth={1.5} />
           </Link>
        </div>
      </div>

      {/* 🍏 APPLE PRO CORE EXHIBIT — HIGH-CONTRAST FEATURE COLUMNS */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 border-t border-black/[0.04] pt-40 pb-60 mb-20 group">
        {[
          {
            icon: <MessageSquare size={30} className="text-[#0071e3]" />,
            title: "Neural Assistant",
            desc: "The world's first documentation bridge. Query your structural drift in real-time with zero-latency responses."
          },
          {
            icon: <Command size={30} className="text-black/30" />,
            title: "Latent Search",
            desc: "Press CMD+K to scan any architectural detail or documentation node across your entire project manifest."
          },
          {
            icon: <CloudLightning size={30} className="text-[#f5a623]" />,
            title: "Global Edge",
            desc: "Sub-10ms delivery of documentation artifacts across 32+ neural-cached edge nodes worldwide."
          },
          {
            icon: <Shield size={30} className="text-[#34c759]" />,
            title: "Sovereign Rotation",
            desc: "Proprietary code buffers are segmented using AES-256 rotating keys, ensuring logic is never stored."
          }
        ].map((feature, i) => (
          <div key={i} className="flex flex-col group p-2 hover:opacity-100 opacity-65 transition-all duration-500 cursor-default">
            <div className="mb-10 group-hover:scale-110 transition-transform">
               {feature.icon}
            </div>
            <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-6 tracking-tight leading-tight">{feature.title}</h3>
            <p className="text-[16px] text-[#1d1d1f]/45 leading-[1.6] font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* 🍏 HIGH-IMPACT "MAC-STYLE" ADVERTISEMENT SECTION */}
      <div className="w-full p-20 md:p-32 bg-[#f5f5f7] border border-black/[0.03] rounded-[48px] flex flex-col items-center text-center overflow-hidden mb-60 relative">
         <div className="max-w-[700px] mb-20 relative z-10">
            <span className="text-[11px] font-bold text-black/30 tracking-[0.3em] uppercase mb-10 block">PRO PERFORMANCE</span>
            <h2 className="text-4xl md:text-7xl font-bold text-[#1d1d1f] tracking-tight leading-[0.98] mb-12">
               Analyze. Synthesis. <br/> Done in milliseconds.
            </h2>
            <p className="text-xl text-[#1d1d1f]/35 font-medium leading-[1.5] max-w-xl mx-auto mb-16">
               Experience the sub-second speed of Groq-L3 synthesis. From raw code to professional README in the blink of an eye.
            </p>
            <div className="flex justify-center">
               <Link to="/codegen" className="apple-btn-primary h-14 p-8 text-[16px]">
                  Open Studio Pro
               </Link>
            </div>
         </div>
      </div>

      {/* 🍏 APPLE SIMPLE PIXEL FOOTER */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-black/[0.06] pt-20 gap-8 opacity-45 grayscale hover:grayscale-0 transition-opacity">
         <div className="flex items-center gap-12">
            <Layers size={20} />
            <Activity size={20} />
            <Shield size={20} />
            <Globe size={20} />
            <Cpu size={20} />
         </div>
         <div className="text-[12px] font-bold tracking-[0.15em] text-black/40 uppercase">
            © 2026 HGM-06 TECHNOLOGIES LAB — ARCHITECTURAL STANDARDS
         </div>
      </div>
      
    </div>
  );
}

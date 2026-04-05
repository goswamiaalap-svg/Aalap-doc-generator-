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
  Command,
  Plus,
  Monitor,
  Database,
  Lock,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-[140px] pb-60 px-8 relative z-10 animate-apple-fade max-w-[1500px] mx-auto bg-[#ffffff]">
      
      {/* 🍏 APPLE HOME PAGE HERO — PRO TRANSFORMATION */}
      <div className="w-full text-center mb-80 relative group">
        <div className="flex items-center justify-center gap-3 mb-16">
           <div className="px-5 py-2 rounded-full bg-black/[0.04] border border-black/[0.03] text-[12px] font-bold text-black/40 tracking-[0.18em] uppercase">
             HGM-06 PRO v2.4 ACTIVATED
           </div>
        </div>

        <h1 className="text-6xl md:text-[120px] font-bold tracking-[-0.05em] leading-[0.94] text-[#1d1d1f] selection:bg-[#0071e3]/10 mb-16 animate-apple-slide">
          Analyze Code. <br/>
          <span className="text-black/15">Understand Meaning.</span>
        </h1>

        <p className="text-xl md:text-[28px] text-[#1d1d1f]/45 max-w-2xl mx-auto mb-20 leading-[1.3] font-medium tracking-tight animate-apple-slide [animation-delay:100ms]">
          The deepest technical archive engine ever built. Effortlessly generate high-fidelity documentation, architecture maps, and security audits.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-apple-slide [animation-delay:200ms]">
           <Link to="/docs" className="apple-btn-primary min-w-[260px] h-[72px] flex items-center justify-center text-[19px] shadow-[0_20px_40px_-8px_rgba(0,113,227,0.3)] group/btn">
              Explore Pro Manifest
              <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
           </Link>
           <Link to="/codegen" className="apple-btn-secondary text-[19px] font-medium group">
              Neural Studio Pro
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1.5 transition-transform text-[#0071e3]" strokeWidth={1.5} />
           </Link>
        </div>
      </div>

      {/* 🍏 NEW: TECH STACK SHOWCASE (PRO FEATURE) */}
      <div className="w-full mb-80 relative overflow-hidden">
         <div className="flex flex-col items-center mb-24">
            <span className="text-[11px] font-bold text-black/30 tracking-[0.3em] uppercase mb-10">SYNTHESIS ENGINE COMPLIANCE</span>
            <div className="flex flex-wrap items-center justify-center gap-20 opacity-30 group">
               {['TypeScript', 'React', 'Groq L3', 'Vercel', 'AES-256', 'Mermaid'].map(stack => (
                 <span key={stack} className="text-3xl font-bold tracking-tighter hover:opacity-100 transition-opacity cursor-default">{stack}</span>
               ))}
            </div>
         </div>
      </div>

      {/* 🍏 ADVANCED FEATURE EXHIBIT — 8x DEPTH (PRO FEATURE) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-black/[0.04] pt-40 pb-60 mb-20">
        {[
          {
            icon: <MessageSquare size={30} className="text-[#0071e3]" />,
            title: "Neural Chat Pro",
            desc: "Full-duplex conversation with our documentation assistant. Understand architectural debt as if you were speaking to the project founder."
          },
          {
            icon: <Command size={30} strokeWidth={1.5} />,
            title: "Fuzzy Manifest Scan",
            desc: "CMD+K search engine that scans through thousands of logical nodes in sub-10ms. Instant discovery for any variable or function."
          },
          {
            icon: <CloudLightning size={30} className="text-[#f5a623]" strokeWidth={1.5} />,
            title: "Global Edge Clusters",
            desc: "32+ neural caches synchronized worldwide. Your documentation artifacts are delivered to the edge in milliseconds."
          },
          {
            icon: <Lock size={30} className="text-[#34c759]" strokeWidth={1.5} />,
            title: "Rotating Seed Guard",
            desc: "Zero-persistence security protocols. AES-256 rotation keys ensure your source logic is synthesized then instantly purged from RAM."
          },
          {
            icon: <Activity size={30} className="text-[#ff3b30]" strokeWidth={1.5} />,
            title: "Synthesis Rank Index",
            desc: "Professional health metrics for your technical archive. AI-driven scoring for documentation clarity, density, and maintenance cost."
          },
          {
            icon: <Layers size={30} className="text-[#a78bfa]" strokeWidth={1.5} />,
            title: "Automatic Visual Logic",
            desc: "Auto-generates Mermaid flowcharts and UML diagrams from raw code files. Visualize complex architectural relationships instantly."
          },
          {
            icon: <Globe size={30} className="text-[#00c7be]" strokeWidth={1.5} />,
            title: "Multi-Artifact Sync",
            desc: "Regenerate READMEs, API references, and security reports concurrently. All artifacts are unified under a single Neural Index."
          },
          {
            icon: <Sparkles size={30} className="text-[#af52de]" strokeWidth={1.5} />,
            title: "Voice-Briefing Sync",
            desc: "Listen to high-fidelity technical summaries of your recent source pushes. Audio-bridged audits for engineering leads."
          }
        ].map((feature, i) => (
          <div key={i} className="flex flex-col group p-4 hover:opacity-100 opacity-70 transition-all duration-300">
            <div className="mb-10 group-hover:scale-110 transition-transform duration-500">
               {feature.icon}
            </div>
            <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-6 tracking-tight leading-tight">{feature.title}</h3>
            <p className="text-[16px] text-[#1d1d1f]/40 leading-[1.6] font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* 🍏 HIGH-IMPACT "MAC-STYLE" ADVERTISEMENT SECTION (PRO FEATURE) */}
      <div className="w-full flex flex-col lg:flex-row items-stretch gap-10 mb-60">
         <div className="flex-[1.5] p-20 md:p-32 bg-[#f5f5f7] border border-black/[0.03] rounded-[48px] flex flex-col justify-center overflow-hidden animate-apple-slide">
            <span className="text-[11px] font-bold text-black/30 tracking-[0.3em] uppercase mb-10 block">PRO-TIER PERFORMANCE</span>
            <h2 className="text-4xl md:text-7xl font-bold text-[#1d1d1f] tracking-tight leading-[0.98] mb-12">
               Latency is the <br/> memory of the past.
            </h2>
            <p className="text-xl text-[#1d1d1f]/35 font-medium leading-[1.5] max-w-xl mb-16">
               Experience sub-10ms neural synthesis. From thousands of lines of raw code to professional technical artifacts in the blink of an eye.
            </p>
            <div className="flex">
               <Link to="/codegen" className="apple-btn-primary h-14 p-8 text-[16px] shadow-lg">
                  Initialize Neural Studio
               </Link>
            </div>
         </div>
         <div className="flex-1 p-20 bg-black rounded-[48px] flex flex-col items-center justify-center text-center overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            <Monitor size={80} className="text-white/20 mb-12" />
            <h3 className="text-3xl font-bold text-white mb-6">Cross-Artifact Synthesis</h3>
            <p className="text-lg text-white/40 font-medium">Generate API References, Quality Reports, and READMEs in a single unified stream.</p>
            <Link to="/codegen" className="mt-10 text-white/60 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-[12px] group">
               Start Analysis <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
         </div>
      </div>

      {/* 🍏 PIXEL PERFECTION FOOTER — APPLE STANDARDS */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-black/[0.06] pt-20 gap-8 opacity-45 grayscale hover:grayscale-0 transition-opacity">
         <div className="flex items-center gap-12">
            <Layers size={20} />
            <Activity size={20} />
            <Shield size={20} />
            <Globe size={20} />
            <Database size={20} strokeWidth={1.5} />
         </div>
         <div className="text-[12px] font-bold tracking-[0.16em] text-black/40 uppercase">
            © 2026 HGM-06 TECHNOLOGIES LAB — NEURAL ARCHIVAL STANDARDS
         </div>
      </div>
      
    </div>
  );
}

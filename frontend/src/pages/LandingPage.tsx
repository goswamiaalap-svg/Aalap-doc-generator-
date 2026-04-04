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
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-48 pb-48 px-8 relative z-10 animate-apple-in max-w-[1400px] mx-auto bg-[#ffffff]">
      
      {/* 🍏 APPLE LIGHT HERO — PURE & SOBRE */}
      <div className="w-full text-center mb-56 relative">
        <h1 className="text-6xl md:text-9xl font-bold tracking-[-0.055em] leading-[0.98] text-[#1d1d1f] selection:bg-blue-500 mb-14">
          Documentation. <br/>
          <span className="text-black/15">Re-Engineered.</span>
        </h1>

        <p className="text-lg md:text-2xl text-[#1d1d1f]/45 max-w-2xl mx-auto mb-16 leading-[1.4] font-medium tracking-tight">
          The ultimate engine for technical artifacts. Analyze, generate, and synchronize your documentation at the speed of thought.
        </p>

        {/* PRO BUTTONS — APPLE BLACK PILLS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
           <Link to="/docs" className="apple-btn-black min-w-[220px] h-[64px] flex items-center justify-center text-[17px]">
              Explore Platform
           </Link>
           <Link to="/codegen" className="apple-btn-outline min-w-[220px] h-[64px] flex items-center justify-center text-[17px] group">
              Neural Studio
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-0.5 transition-transform text-black/20" />
           </Link>
        </div>
      </div>

      {/* 🍎 ADVANCED FEATURE GRID — 🍏 APPLE PRO EXHIBIT */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-t border-black/[0.06] pt-32 pb-32">
        {[
          {
            icon: <MessageSquare size={26} className="text-blue-500" />,
            title: "Conversational Intelligence",
            desc: "Query your codebase using our neural LLM bridge. Ask 'Why does this function exist?' and get instant technical insights."
          },
          {
            icon: <Cpu size={26} className="text-purple-500" />,
            title: "Multi-Language Synthesis",
            desc: "Native decoding support for C++, Java, Rust, Swift, and PHP. We speak the language of every major architectural paradigm."
          },
          {
            icon: <CloudLightning size={26} className="text-orange-500" />,
            title: "Edge Synchronization",
            desc: "DocGen artifacts are synchronized to global edge nodes, ensuring sub-10ms delivery for your technical wiki core."
          },
          {
            icon: <Shield size={26} className="text-emerald-500" />,
            title: "Proprietary Segmentation",
            desc: "AES-256 rotation ensures your internal logic is segmented and never leaked into public training sets."
          },
          {
            icon: <Power size={26} className="text-amber-500" />,
            title: "Instant Export Engine",
            desc: "One-click export to MDX, PDF, and interactive Swagger-ready JSON for immediate pipeline integration."
          },
          {
            icon: <Activity size={26} className="text-rose-500" />,
            title: "Neural Rank Scoring",
            desc: "Automatically assess the quality of your docstrings and READMEs based on project density and lint coverage."
          },
          {
            icon: <Layers size={26} className="text-indigo-500" />,
            title: "Architecture Diagrams",
            desc: "Automatic Mermaid script generation to visualize the structural relationships hidden within your logic."
          },
          {
            icon: <Sparkles size={26} className="text-cyan-500" />,
            title: "Voice Briefings",
            desc: "Listen to technical summaries of your recent repository pushes using our high-fidelity text-to-speech engine."
          }
        ].map((feature, i) => (
          <div key={i} className="flex flex-col group p-8 rounded-3xl bg-[#f5f5f7]/40 border border-black/[0.03] hover:bg-white hover:shadow-2xl hover:shadow-black/5 hover:border-black/5 transition-all duration-500">
            <div className="mb-8 p-3 rounded-2xl bg-white shadow-sm inline-block self-start group-hover:scale-110 transition-transform">
               {feature.icon}
            </div>
            <h3 className="text-[19px] font-bold text-[#1d1d1f] mb-4 tracking-tight leading-tight">{feature.title}</h3>
            <p className="text-[14px] text-[#1d1d1f]/45 leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* 🍏 PRO EXHIBIT: NEURAL STUDIO SECTION */}
      <div className="w-full mt-36 p-16 md:p-24 bg-black rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-16 overflow-hidden relative">
         <div className="flex flex-col gap-8 max-w-xl relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-[2px] bg-white opacity-20" />
               <span className="text-white/40 text-[12px] font-bold tracking-[0.2em] uppercase">The Studio Experience</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
               Analyze raw code <br/> in milliseconds.
            </h2>
            <p className="text-lg text-white/45 font-medium leading-relaxed">
               Drop any source file into our neural forge and watch as high-density documentation artifacts manifest before your eyes. Perfect for large-scale architectural audits.
            </p>
            <div className="flex pt-4">
               <Link to="/codegen" className="apple-btn-white min-w-[180px] h-[52px] flex items-center justify-center">
                  Open Studio
               </Link>
            </div>
         </div>
         
         <div className="relative group grayscale hover:grayscale-0 transition-all duration-700">
            <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden rotate-3 group-hover:rotate-0 transition-transform">
               <div className="flex flex-col gap-4 opacity-40">
                  {[1,2,3,4].map(line => (
                     <div key={line} className="flex gap-2">
                        <div className="w-16 h-2 bg-white/20 rounded-full" />
                        <div className="w-32 h-2 bg-white/20 rounded-full" />
                        <div className="w-8 h-2 bg-white/20 rounded-full" />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* 🍏 APPLE SIMPLE LIGHT FOOTER */}
      <div className="mt-56 w-full flex flex-col md:flex-row items-center justify-between border-t border-black/[0.05] pt-12 gap-8 opacity-40 grayscale hover:grayscale-0 transition-opacity">
         <div className="flex items-center gap-10">
            <Layers size={18} />
            <Activity size={18} />
            <Shield size={18} />
            <Globe size={18} />
         </div>
         <div className="text-[11px] font-bold tracking-[0.1em] text-[#1d1d1f]/50 uppercase">
            © 2026 HGM-06 INDUSTRIES — PRECISION NEURAL ARCHITECTURE
         </div>
      </div>
      
    </div>
  );
}

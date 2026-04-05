import { Link } from 'react-router-dom';
import { 
  Zap,
  ChevronRight,
  Terminal,
  Activity,
  Layers,
  Shield,
  Code,
  Globe,
  Database
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start bg-[#ffffff] relative overflow-hidden font-sans pb-40">
      
      {/* 🍏 ULTRA-CLEAN APPLE INTELLIGENCE BACKGROUND */}
      <div className="absolute top-0 inset-x-0 h-[800px] pointer-events-none overflow-hidden z-0 flex items-center justify-center">
         {/* Subtle diffused glowing gradients instead of noisy canvas */}
         <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-b from-[#0071e3]/10 via-[#af52de]/5 to-transparent rounded-full blur-[120px] opacity-70" />
      </div>

      {/* 🍏 ZERO-NOISE HERO ENCLOSURE */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-[180px] relative z-10 flex flex-col items-center text-center">
         
         <div className="flex items-center gap-2 mb-12 animate-apple-fade bg-[#f5f5f7] px-4 py-2 rounded-full border border-black/[0.04]">
            <SparkleIcon />
            <span className="text-[12px] font-bold text-[#1d1d1f] tracking-wide">HGM-06 Neural Engine</span>
         </div>

         <h1 className="text-[72px] md:text-[140px] font-bold tracking-[-0.04em] leading-[0.95] text-[#1d1d1f] mb-8 animate-apple-slide select-none">
            Code.<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0071e3] to-[#af52de]">
               Synthesized.
            </span>
         </h1>

         <p className="text-[22px] md:text-[28px] text-[#1d1d1f]/40 font-medium tracking-tight mb-16 leading-[1.3] max-w-[700px] mx-auto animate-apple-fade animation-delay-200">
            The deepest technical archive ever built. Sub-millisecond logical decomposition, perfectly structured.
         </p>

         <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-apple-fade animation-delay-300">
            <Link to="/docs/intro" className="apple-btn-primary h-[60px] px-10 flex items-center justify-center text-[17px] shadow-[0_20px_40px_-15px_rgba(0,113,227,0.3)] hover:scale-105 transition-all">
               Initialize Sync <ChevronRight size={18} className="ml-2" />
            </Link>
            <Link to="/codegen" className="group flex items-center gap-3 h-[60px] px-10 rounded-full bg-[#f5f5f7] border border-black/5 text-[17px] font-semibold text-[#1d1d1f] hover:bg-black hover:text-white transition-all shadow-sm">
               <Terminal size={18} />
               Neural Studio
            </Link>
         </div>

      </div>

      {/* 🍏 BENTO BOX SHOWCASE (CLEAN NO-NOISE UI) */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 mt-[160px] relative z-10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LARGE FEATURE CARD */}
            <div className="md:col-span-2 bg-[#f9f9fb] border border-black/[0.04] rounded-[40px] p-10 md:p-14 flex flex-col justify-between hover:shadow-2xl transition-all duration-700 group overflow-hidden relative">
               <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#0071e3]/5 to-transparent pointer-events-none" />
               <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-20 group-hover:scale-110 transition-transform">
                  <Activity size={28} className="text-[#0071e3]" />
               </div>
               <div>
                  <h3 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-[1.1] mb-4">
                     Sub-10ms Global Latency.
                  </h3>
                  <p className="text-[18px] text-[#1d1d1f]/40 font-medium">
                     Powered by Vercel Edge compute. Documentation generation responds instantaneously worldwide.
                  </p>
               </div>
            </div>

            {/* TALL VERTICAL CARD */}
            <div className="bg-[#f9f9fb] border border-black/[0.04] rounded-[40px] p-10 flex flex-col justify-between hover:shadow-2xl transition-all duration-700 group">
               <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                  <Shield size={28} className="text-[#32d74b]" />
               </div>
               <div>
                  <h3 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight leading-[1.1] mb-4">
                     Sovereign Security.
                  </h3>
                  <p className="text-[16px] text-[#1d1d1f]/40 font-medium">
                     AES-256 rolling-key logic protection. Your logic is synthesized in volatile RAM and instantly purged.
                  </p>
               </div>
            </div>

            {/* WIDE LOGIC CARD */}
            <div className="bg-black border border-black/[0.04] rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between hover:shadow-2xl transition-all duration-700 group md:col-span-3 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
               <div className="flex flex-col relative z-10 mb-8 md:mb-0">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl shadow-sm flex items-center justify-center mb-8 border border-white/10">
                     <Layers size={28} className="text-white" />
                  </div>
                  <h3 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight leading-[1.1] mb-2">
                     Deep Architectural Maps.
                  </h3>
                  <p className="text-[18px] text-white/40 font-medium max-w-[500px]">
                     Not just comments. Full API references, automated diagrams, and Stage 4 multi-dependency resolution.
                  </p>
               </div>
               <Link to="/codegen" className="apple-btn-primary bg-white text-black hover:bg-gray-100 h-[64px] px-10 flex items-center justify-center text-[17px] shadow-lg relative z-10 w-full md:w-auto">
                  Launch Studio
               </Link>
            </div>

         </div>
      </div>

    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L14.7 9.3L23 12L14.7 14.7L12 23L9.3 14.7L1 12L9.3 9.3L12 1Z" fill="#0071e3"/>
    </svg>
  );
}

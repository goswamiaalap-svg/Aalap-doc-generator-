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
  ChevronRight,
  Box,
  Terminal
} from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 🍏 FUTURISTIC NEURAL PARTICLE NEXUS (APPLE STYLE)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
    const count = 100;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-[120px] pb-60 px-8 relative z-10 animate-apple-fade max-w-[1500px] mx-auto bg-[#ffffff]">
      
      {/* 🍏 FUTURISTIC PARTICLE BACKGROUND */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40 z-0" />

      {/* 🍏 HERO SECTION — THE NEURAL CORE */}
      <div className="w-full text-center mb-80 relative group z-10">
        
        {/* PRO BADGE — FUTURISTIC HUD STYLE */}
        <div className="flex items-center justify-center gap-4 mb-20">
           <div className="px-6 py-2 rounded-full bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
             Neural Stage 4 Ready
           </div>
           <div className="px-5 py-2 rounded-full border border-black/10 text-[10px] font-bold text-black/30 tracking-[0.2em] uppercase">
             Edge Distribution
           </div>
        </div>

        <h1 className="text-6xl md:text-[140px] font-bold tracking-[-0.07em] leading-[0.92] text-[#1d1d1f] selection:bg-[#0071e3]/10 mb-16 animate-apple-slide">
          Code. <br/>
          <span className="text-black/10">Synthesized.</span>
        </h1>

        <p className="text-xl md:text-[32px] text-[#1d1d1f]/45 max-w-3xl mx-auto mb-20 leading-[1.2] font-medium tracking-tight animate-apple-slide [animation-delay:100ms]">
          The first neural archive engine with real-time logical decomposition. From raw implementation to architectural foresight in milliseconds.
        </p>

        {/* FUTURISTIC CTA PILLS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 animate-apple-slide [animation-delay:200ms]">
           <Link to="/docs" className="apple-btn-primary min-w-[280px] h-[76px] flex items-center justify-center text-[19px] shadow-[0_30px_60px_-15px_rgba(0,113,227,0.35)] group/btn">
              Explore Neural Hub
              <div className="ml-4 w-6 h-[1px] bg-white/40 group-hover/btn:w-10 transition-all" />
              <ChevronRight size={18} className="translate-x-0 group-hover/btn:translate-x-2 transition-transform" />
           </Link>
           <Link to="/codegen" className="group flex items-center justify-center gap-3 text-[19px] font-medium text-black/50 hover:text-black transition-all">
              <Terminal size={22} className="text-black/20 group-hover:text-[#0071e3] transition-colors" strokeWidth={1} />
              Open Studio Pro
           </Link>
        </div>
      </div>

      {/* 🍏 FUTURISTIC DEPTH GRID — PARALLAX EXHIBIT */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-t border-black/[0.04] pt-40 pb-60 mb-20 relative z-10">
        {[
          {
            icon: <Box size={32} className="text-[#0071e3]" />,
            title: "Dimensional Logic Maps",
            desc: "Automatic 3D mapping of recursive logical relationships. Visualize the hidden layers of your architecture with neural precision."
          },
          {
            icon: <Sparkles size={32} className="text-[#ff375f]" />,
            title: "Sub-Second Synthesis",
            desc: "Powered by Groq-L3 Edge Clusters. Documentation manifestation that matches the processing speed of the human mind."
          },
          {
            icon: <Cpu size={32} className="text-[#32d74b]" />,
            title: "Cross-Language HUD",
            desc: "Support for C++, Rust, Zig, and Swift. Unified technical artifacts regardless of the underlying runtime or paradigm."
          }
        ].map((feature, i) => (
          <div key={i} className="flex flex-col group p-12 rounded-[40px] bg-[#f5f5f7]/60 border border-black/[0.02] hover:bg-white hover:shadow-[0_40px_80px_-10px_rgba(0,0,0,0.06)] hover:border-black/5 transition-all duration-700 hover:-translate-y-4">
            <div className="mb-12 p-5 rounded-3xl bg-white shadow-sm inline-block self-start group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
               {feature.icon}
            </div>
            <h3 className="text-[26px] font-bold text-[#1d1d1f] mb-6 tracking-tight leading-[1.1]">{feature.title}</h3>
            <p className="text-[17px] text-[#1d1d1f]/40 leading-relaxed font-medium">{feature.desc}</p>
            <div className="mt-12 flex items-center gap-3 text-[12px] font-black uppercase tracking-widest text-[#0071e3] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
               Initialize Module <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* 🍏 THE FUTURISTIC "APPLE HUD" SHOWCASE */}
      <div className="w-full relative mb-80 rounded-[60px] overflow-hidden group shadow-2xl">
         <div className="absolute inset-0 bg-black z-0 overflow-hidden">
            {/* 🍏 SIMULATED TECH GRID */}
            <div className="absolute inset-0 opacity-10 grid grid-cols-12 gap-[1px]">
               {Array.from({length: 48}).map((_, i) => (
                 <div key={i} className="border border-white/20" />
               ))}
            </div>
         </div>
         <div className="relative z-10 p-24 md:p-40 flex flex-col items-center text-center">
            <div className="px-6 py-2 rounded-full border border-white/10 text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase mb-16">Intelligence Frontier</div>
            <h2 className="text-5xl md:text-[88px] font-bold text-white tracking-tighter leading-[0.94] mb-16">
               Search any variable. <br/> <span className="text-white/20">In Every Manifest.</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/45 font-medium leading-[1.5] max-w-2xl mx-auto mb-20">
               The HGM-06 Search Engine scans millions of technical synapses in sub-10ms. A futuristic spotlight for your decentralized architectural.
            </p>
            <div className="flex gap-4 p-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl group/cmd">
               <div className="flex items-center gap-3 px-8 py-4 bg-white rounded-2xl text-black font-bold text-[15px] group-active/cmd:scale-95 transition-all cursor-pointer">
                  <Command size={18} />
                  <span>Press K to Initialize</span>
               </div>
            </div>
         </div>
      </div>

      {/* 🍏 FUTURISTIC PIXEL FOOTER — APPLE STANDARDS v2.4 */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-black/[0.08] pt-24 gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
         <div className="flex items-center gap-14">
            <Box size={22} className="text-black/40" strokeWidth={1} />
            <Activity size={22} className="text-black/40" strokeWidth={1} />
            <Shield size={22} className="text-black/40" strokeWidth={1} />
            <Globe size={22} className="text-black/40" strokeWidth={1} />
            <Terminal size={22} className="text-black/40" strokeWidth={1} />
         </div>
         <div className="flex flex-col items-end gap-2">
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#1d1d1f] uppercase">Neural Hub Pro Deployment Active</span>
            <span className="text-[10px] font-bold tracking-[0.1em] text-black/25 uppercase">© 2026 HGM-06 INDUSTRIES — GLOBAL ARCHIVE STANDARDS</span>
         </div>
      </div>
      
    </div>
  );
}

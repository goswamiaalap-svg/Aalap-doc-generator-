import { Link } from 'react-router-dom';
import { 
  Globe,
  Shield,
  Layers,
  Activity,
  Zap,
  Cpu,
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
  Terminal,
  Activity as Pulse,
  Binary,
  Maximize2,
  Eye,
  Rocket,
  Code
} from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 🍏 FUTURISTIC NEURAL NEXUS (RICH)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
    const count = 120;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < count; i++) {
      particles.push({ 
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height, 
        vx: (Math.random() - 0.5) * 0.3, 
        vy: (Math.random() - 0.5) * 0.3, 
        size: Math.random() * 2 + 1 
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 113, 227, 0.08)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 180) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-start bg-[#ffffff] relative overflow-hidden">
      
      {/* 🍏 RICH TECHNICAL CORE — FIXED BACKGROUNDS */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-50 z-0" />
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* 🍏 RICH SYSTEM ACTIVITY TICKER */}
      <div className="w-full h-10 border-b border-black/[0.04] bg-white relative z-50 flex items-center overflow-hidden">
         <div className="flex items-center gap-10 animate-[scroll_40s_linear_infinite] whitespace-nowrap">
            {Array.from({length: 10}).map((_, i) => (
               <div key={i} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                  <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Neural Sync Node #{542+i} Active</span>
                  <div className="h-3 w-[1px] bg-black/10" />
                  <span className="text-[10px] font-bold text-black/20 uppercase tracking-[0.1em]">Payload: 0.94 Gb/s</span>
               </div>
            ))}
         </div>
      </div>

      {/* 🍏 RICH HERO ENCLOSURE */}
      <div className="w-full max-w-[1400px] mx-auto px-10 pt-32 pb-40 relative z-10 flex flex-col items-center">
         
         <div className="flex items-center gap-4 mb-20 animate-apple-fade">
            <div className="px-5 py-2 rounded-full bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl">PRO v2.4</div>
            <div className="px-5 py-2 rounded-full border border-black/10 text-[10px] font-bold text-black/30 tracking-[0.2em] uppercase">Edge Distribution Core</div>
         </div>

         <div className="flex flex-col xl:flex-row items-center gap-20 w-full mb-80">
            <div className="flex-1 text-center xl:text-left">
               <h1 className="text-[64px] md:text-[140px] font-bold tracking-[-0.07em] leading-[0.92] text-[#1d1d1f] mb-12 animate-apple-slide">
                  Code. <br/>
                  <span className="text-[#0071e3]">Synthesized.</span>
               </h1>
               <p className="text-xl md:text-[32px] text-[#1d1d1f]/35 font-medium tracking-tight mb-16 leading-[1.2] max-w-xl">
                  The deepest technical archive engine ever built. Real-time logical decomposition across every manifest.
               </p>
               <div className="flex flex-col sm:flex-row items-center gap-10">
                  <Link to="/docs" className="apple-btn-primary h-[76px] px-12 flex items-center justify-center text-[19px] shadow-[0_30px_60px_-15px_rgba(0,113,227,0.3)]">
                     Initialize Core Sync <ChevronRight size={20} className="ml-4" />
                  </Link>
                  <Link to="/codegen" className="group flex items-center gap-4 text-[19px] font-bold text-black/30 hover:text-black transition-all">
                     <Terminal size={24} strokeWidth={1} />
                     Neural Studio
                  </Link>
               </div>
            </div>

            {/* 🍏 RICH TECHNICAL MINIATURE — HERO WIDGET */}
            <div className="flex-1 w-full max-w-[600px] aspect-square relative group">
               <div className="absolute inset-x-0 inset-y-10 bg-black/5 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
               <div className="h-full bg-white border border-black/[0.06] rounded-[60px] shadow-2xl p-2 relative overflow-hidden group-hover:-translate-y-4 transition-all duration-700">
                  <div className="h-full bg-[#f5f5f7] rounded-[58px] flex flex-col p-10 gap-8">
                     <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-400" />
                           <div className="w-3 h-3 rounded-full bg-yellow-400" />
                           <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <span className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] animate-pulse">Synthesis Hub v2.4</span>
                     </div>
                     <div className="space-y-4 flex-1">
                        <div className="h-4 w-full bg-black/[0.03] rounded-full" />
                        <div className="h-4 w-5/6 bg-black/[0.03] rounded-full" />
                        <div className="h-4 w-4/6 bg-black/[0.03] rounded-full" />
                        <div className="mt-12 h-32 w-full bg-white rounded-3xl border border-black/[0.03] flex items-center justify-center relative overflow-hidden">
                           <Binary size={40} className="text-[#0071e3] opacity-20" />
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0071e3]/5 to-transparent animate-[shimmer_2s_infinite]" />
                        </div>
                     </div>
                     <div className="flex items-center justify-between border-t border-black/5 pt-6">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-black/20 uppercase tracking-widest">Logic Count</span>
                           <span className="text-[20px] font-bold text-black">88,412 <small className="text-[12px] opacity-20">LOC</small></span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white shadow-sm hover:scale-110 transition-transform">
                           <Zap size={20} className="text-yellow-500" fill="currentColor" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 🍏 RICH COMPLEXITY SHOWCASE — PERFORMANCE BARS */}
         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-80 px-2">
            {[
               {label: 'Synthesis Latency', val: '0.94ms', icon: <Pulse size={20} className="text-[#0071e3]" />, desc: 'Sub-millisecond neural bridge response across global edge nodes.'},
               {label: 'Architecture Depth', val: 'Stage 4', icon: <Layers size={20} className="text-[#af52de]" />, desc: 'Multi-repo architectural decomposition for complex systems.'},
               {label: 'Key Rotation', icon: <Shield size={20} className="text-[#32d74b]" />, val: 'Enabled', desc: 'AES-256 rolling-key logic protection for sovereign codebases.'},
               {label: 'Neural Rank', icon: <Activity size={20} className="text-[#ff375f]" />, val: 'Index 9.8', desc: 'AI-driven clarity assessment of technical artifacts and logic.'}
            ].map((card, i) => (
               <div key={i} className="p-10 rounded-[48px] bg-[#f5f5f7]/60 border border-black/[0.02] hover:bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                  <div className="mb-10 p-5 bg-white rounded-[24px] inline-block shadow-sm group-hover:scale-110 transition-transform">{card.icon}</div>
                  <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-4 tracking-tight">{card.label}</h3>
                  <p className="text-[28px] font-black text-[#0071e3] mb-6 tracking-tighter">{card.val}</p>
                  <p className="text-[14px] text-black/30 leading-relaxed font-medium">{card.desc}</p>
               </div>
            ))}
         </div>

         {/* 🍏 RICH NEURAL ROADMAP (ADVANCED FEATURE) */}
         <div className="w-full mb-80">
            <div className="flex flex-col items-center mb-24">
               <span className="text-[11px] font-bold text-black/30 tracking-[0.3em] uppercase mb-10">THE FRONTIER ROADMAP</span>
               <h2 className="text-4xl md:text-6xl font-bold text-[#1d1d1f] tracking-tight text-center">Neural Horizon v2.4+</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                  { phase: 'PHASE 01', title: 'Edge Synthesis', desc: 'Deploying sub-10ms neural nodes globally.', icon: <Rocket size={24} className="text-[#0071e3]" />, status: 'COMPLETED' },
                  { phase: 'PHASE 02', title: 'Blueprint HUD', desc: 'Interactive 3D architectural node mapping.', icon: <Maximize2 size={24} className="text-[#ff375f]" />, status: 'ACTIVE' },
                  { phase: 'PHASE 03', title: 'Sovereign Lab', desc: 'Fully localized neural processing for ultra-secure environments.', icon: <Lock size={24} className="text-[#32d74b]" />, status: 'Q4 2026' }
               ].map((item, i) => (
                  <div key={i} className="relative p-10 bg-white border border-black/[0.06] rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-700 group">
                     <div className="absolute top-10 right-10 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'COMPLETED' ? 'bg-[#32d74b]' : item.status === 'ACTIVE' ? 'bg-[#0071e3]' : 'bg-black/10'}`} />
                        <span className="text-[9px] font-black text-black/40 uppercase tracking-widest">{item.status}</span>
                     </div>
                     <div className="mb-10 text-black/20 group-hover:text-black transition-colors">{item.icon}</div>
                     <span className="text-[10px] font-black text-[#0071e3] uppercase tracking-[0.2em] mb-4 block">{item.phase}</span>
                     <h3 className="text-2xl font-bold text-[#1d1d1f] mb-4 tracking-tight">{item.title}</h3>
                     <p className="text-[15px] text-black/40 font-medium leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* 🍏 RICH "LAB" FOOTER ENCLOSURE */}
         <div className="w-full p-20 md:p-32 bg-black rounded-[80px] text-center flex flex-col items-center relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <h2 className="text-5xl md:text-[88px] font-bold text-white tracking-tighter leading-[0.9] mb-12 relative z-10">
               Unified Intelligence. <br/> <span className="text-white/20">Archived Forever.</span>
            </h2>
            <Link to="/codegen" className="apple-btn-primary bg-white text-black h-[72px] px-14 text-[20px] shadow-2xl relative z-10 transition-all active:scale-95 group/lab"> 
               Initialize Lab HUB 
               <ChevronRight size={24} className="ml-4 group-hover/lab:translate-x-3 transition-transform" />
            </Link>
         </div>

      </div>

      {/* 🍏 PIXEL PERFECTION FOOTER — RICH OS STYLE */}
      <footer className="w-full border-t border-black/[0.06] bg-[#f5f5f7]/50 py-16 px-10 relative z-20">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 opacity-50 grayscale hover:grayscale-0 transition-opacity">
            <div className="flex items-center gap-12">
               <Box size={20} />
               <Cpu size={20} />
               <Sparkles size={20} />
               <Database size={20} />
               <Code size={20} />
            </div>
            <div className="flex flex-col items-end gap-1">
               <span className="text-[12px] font-bold tracking-[0.2em] text-[#1d1d1f] uppercase">Neural Hub v2.4 Pro Production Active</span>
               <span className="text-[10px] font-bold tracking-[0.1em] text-black/30 uppercase">© 2026 HGM-06 LABS — GLOBAL ARCHIVE STANDARDS</span>
            </div>
         </div>
      </footer>
      
    </div>
  );
}

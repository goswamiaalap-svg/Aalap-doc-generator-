import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    VANTA: any;
  }
}

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    const initVanta = () => {
      // ═══════════════════════════════════════════════════════════════
      // VANTA.HALO RE-CALIBRATION: LIGHTER & PERFECTLY ALIGNED
      // Source: Custom UX Adjustment
      // ═══════════════════════════════════════════════════════════════
      if (!vantaEffect && vantaRef.current && window.VANTA) {
        setVantaEffect(
          window.VANTA.HALO({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: 0x131a43,
            baseColor: 0x001a59, // DARKER BASE FOR SOFTER GLOW
            size: 0.85,          // REDUCED SIZE FOR BETTER FIT
            amplitudeFactor: 0.6, // LIGHTER/SOFT CLOUDS
            xOffset: 0,
            yOffset: -0.15,      // SHIFTED DOWN BEHIND BUTTONS
            forceAnimate: true
          })
        );
      }
    };

    const timeoutId = setTimeout(initVanta, 400);

    return () => {
      clearTimeout(timeoutId);
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div 
      ref={vantaRef} 
      className="absolute inset-0 pointer-events-none opacity-80" 
      style={{ 
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', 
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' 
      }} 
    />
  );
}

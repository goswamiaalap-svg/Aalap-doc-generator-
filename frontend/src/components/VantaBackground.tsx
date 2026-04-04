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
      // VANTA.HALO CONFIG SOURCE: CUSTOM REQUEST
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
            baseColor: 0x1a59,
            size: 1.00,
            amplitudeFactor: 1.00,
            xOffset: 0,
            yOffset: 0
          })
        );
      }
    };

    // Wait for external scripts to load if needed
    const timeoutId = setTimeout(initVanta, 300);

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
      className="fixed inset-0 z-0 pointer-events-none" 
      style={{ background: '#131a43' }} 
    />
  );
}

import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export default function TiltCard({ children, className = '', maxTilt = 8 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setShine({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -maxTilt;
    const ry = ((x - cx) / cx) * maxTilt;
    setTilt({ x: rx, y: ry });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out preserve-3d ${className}`}
      style={{
        transform: `perspective(500px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        '--mouse-x': `${shine.x}%`,
        '--mouse-y': `${shine.y}%`,
      } as any}
    >
      {/* SHINE EFFECT */}
      <div className="shine" />
      {children}
    </div>
  );
}

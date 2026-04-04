import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState(() => {
    const arr = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
       arr[i*3] = (Math.random() - 0.5) * 10;
       arr[i*3+1] = (Math.random() - 0.5) * 10;
       arr[i*3+2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  });

  useFrame((_, delta) => {
    if (ref.current) {
        ref.current.rotation.x += delta / 15;
        ref.current.rotation.y += delta / 25;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[#02020a] overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
      </Canvas>
      
      {/* GLOW ORBS: CSS GRADIENTS */}
      <div className="absolute top-0 left-0 w-full h-full">
         {/* Orb 1 — Electric blue-purple */}
         <div 
           className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[80px] animate-pulse-slow active:scale-110 transition-transform duration-[10000ms]"
           style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }}
         />
         {/* Orb 2 — Cyan-teal */}
         <div 
           className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[70px] animate-pulse-slow transition-all duration-[15000ms]"
           style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)' }}
         />
         {/* Orb 3 — Deep magenta */}
         <div 
           className="absolute bottom-[-10%] left-[5%] w-[350px] h-[350px] rounded-full blur-[90px] animate-pulse-slow transition-all duration-[20000ms]"
           style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)' }}
         />
      </div>

      <div className="perspective-grid" />
    </div>
  );
}

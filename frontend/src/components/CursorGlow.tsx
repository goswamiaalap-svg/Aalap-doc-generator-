import { useEffect, useState, useRef } from 'react';

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setTarget({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const animate = () => {
    setPos(p => ({
      x: p.x + (target.x - p.x) * 0.1,
      y: p.y + (target.y - p.y) * 0.1
    }));
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [target]);

  return (
    <div 
      className="cursor-glow"
      style={{
        left: pos.x - 7.5,
        top: pos.y - 7.5,
      }}
    />
  );
}

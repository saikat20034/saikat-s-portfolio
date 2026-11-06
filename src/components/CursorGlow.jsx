import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springX = useSpring(mouseX, { damping: 28, stiffness: 180 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 180 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: fine)').matches) {
      setEnabled(true);
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-30 rounded-full w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 opacity-25 mix-blend-screen"
      style={{
        left: springX,
        top: springY,
        background: 'radial-gradient(circle, rgba(201, 154, 74, 0.18) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 70%)',
      }}
      aria-hidden="true"
    />
  );
}

import { motion } from 'framer-motion';
import { useMemo } from 'react';

const PARTICLES = ['🎉', '✨', '💗', '🌟', '🎊', '⭐'];

export default function Confetti({ count = 18 }) {
  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: PARTICLES[i % PARTICLES.length],
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 1.5,
      size: 14 + Math.random() * 12,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ y: -30, opacity: 1, rotate: 0 }}
          animate={{
            y: '100vh',
            opacity: [1, 1, 0],
            rotate: Math.random() > 0.5 ? 360 : -360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

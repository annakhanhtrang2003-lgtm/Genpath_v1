import { motion } from 'framer-motion';
import { useMemo } from 'react';

const EMOJIS = ['✨', '💫', '🌟', '💗', '🐾', '⭐', '🎀'];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function FloatingElements({ count = 7 }) {
  const elements = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: `${rng() * 90 + 5}%`,
      top: `${rng() * 80 + 10}%`,
      opacity: 0.15 + rng() * 0.25,
      duration: 3 + rng() * 3,
      delay: rng() * 2,
      fontSize: 14 + rng() * 14,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{
            left: el.left,
            top: el.top,
            opacity: el.opacity,
            fontSize: el.fontSize,
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: el.delay,
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  );
}

import { motion } from 'framer-motion';

const BREED_EMOJI = {
  tabby: '🐱',
  siamese: '😺',
  bengal: '🐯',
  persian: '🌸',
  mainecoon: '👑',
  ragdoll: '💜',
  munchkin: '⚡',
};

const variants = {
  idle: {
    y: [0, -8, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  happy: {
    rotate: [0, -5, 5, -5, 0],
    transition: { duration: 0.5, repeat: 2 },
  },
  thinking: {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity },
  },
  loading: {
    rotate: [0, 360],
    transition: { duration: 1.2, repeat: Infinity, ease: 'linear' },
  },
};

export default function AnimatedCat({ breed, size = 200, mood = 'idle' }) {
  return (
    <motion.div
      variants={variants}
      animate={mood}
      style={{ fontSize: size, display: 'inline-block', lineHeight: 1 }}
    >
      {BREED_EMOJI[breed] || '🐱'}
    </motion.div>
  );
}

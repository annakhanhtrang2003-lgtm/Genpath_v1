import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import AnimatedCat from '../components/AnimatedCat';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-momo-soft via-white to-white font-sans antialiased">
        <motion.div
          className="flex flex-col items-center max-w-lg w-full"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Logo */}
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-momo tracking-tight"
            variants={fadeUp}
          >
            StudentPath 🎓
          </motion.h2>

          {/* Cat mascot */}
          <motion.div className="my-8 flex flex-col items-center" variants={fadeUp}>
            <span className="text-xl -mb-1" role="img" aria-label="graduation cap">🎓</span>
            <AnimatedCat breed="tabby" size={90} mood="idle" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] text-center leading-tight tracking-tight"
            variants={fadeUp}
          >
            Tìm ra chính mình,
            <br />
            <span className="text-momo">vạch rõ con đường.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-base md:text-lg font-medium text-gray-600 text-center mt-4 max-w-md leading-relaxed"
            variants={fadeUp}
          >
            Dành cho sinh viên chưa biết mình là ai, học gì, và ra trường sẽ làm gì.
          </motion.p>

          {/* Stat pills */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
            variants={fadeUp}
          >
            {[
              { emoji: '🎯', text: '12 câu hỏi' },
              { emoji: '🐱', text: '7 tính cách' },
              { emoji: '🗺️', text: 'Lộ trình 4 năm' },
            ].map((s) => (
              <span
                key={s.text}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border-2 border-momo-soft text-sm font-semibold text-[#1A1A1A] shadow-[0_2px_8px_rgba(165,0,100,0.06)]"
              >
                <span>{s.emoji}</span> {s.text}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.button
            onClick={() => navigate('/input')}
            className="mt-10 bg-momo hover:bg-momo-light text-white font-bold text-lg px-10 py-4 rounded-full shadow-[0_0_24px_rgba(216,45,139,0.3)] hover:shadow-[0_0_32px_rgba(216,45,139,0.4)] transition-all cursor-pointer"
            variants={fadeUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Bắt đầu tìm đường"
          >
            Bắt đầu tìm đường &rarr;
          </motion.button>

          {/* Footer tagline */}
          <motion.p
            className="mt-14 text-sm font-medium text-gray-500"
            variants={fadeUp}
          >
            StudentPath &mdash; Để 4 năm đại học không còn là câu hỏi.
          </motion.p>
        </motion.div>
      </div>
    </PageTransition>
  );
}

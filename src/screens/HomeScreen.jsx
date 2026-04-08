import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import AnimatedCat from '../components/AnimatedCat';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-momo-soft via-white to-white">
        {/* Logo */}
        <motion.h2
          className="text-[32px] font-bold text-momo mb-4 tracking-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          StudentPath 🎓
        </motion.h2>

        {/* Cat mascot */}
        <div className="mb-6 flex flex-col items-center">
          <span className="text-lg -mb-1">🎓</span>
          <AnimatedCat breed="tabby" size={80} mood="idle" />
        </div>

        {/* Headline */}
        <motion.h1
          className="text-[28px] md:text-4xl font-bold text-[#1A1A1A] text-center leading-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Tìm ra chính mình,
          <br />
          <span className="text-momo">vạch rõ con đường.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-base text-[#666666] text-center mb-6 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Dành cho sinh viên chưa biết mình là ai, học gì, và ra trường sẽ làm gì.
        </motion.p>

        {/* Stats row */}
        <motion.p
          className="text-sm text-[#666666] text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          🎯 12 câu hỏi &nbsp;&middot;&nbsp; 🐱 7 tính cách &nbsp;&middot;&nbsp; 🗺️ Lộ trình 4 năm
        </motion.p>

        {/* CTA */}
        <motion.button
          onClick={() => navigate('/input')}
          className="bg-momo hover:bg-momo-light text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-[0_4px_16px_rgba(165,0,100,0.12)] hover:shadow-[0_8px_32px_rgba(165,0,100,0.16)] transition-all cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Bắt đầu tìm đường &rarr;
        </motion.button>

        {/* Footer note */}
        <motion.p
          className="mt-12 text-sm text-[#999999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          StudentPath &mdash; Để 4 năm đại học không còn là câu hỏi.
        </motion.p>
      </div>
    </PageTransition>
  );
}

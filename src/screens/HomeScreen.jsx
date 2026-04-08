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
          className="text-[32px] font-bold text-momo mb-8 tracking-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          GenPath 💗
        </motion.h2>

        {/* Cat mascot */}
        <div className="mb-6">
          <AnimatedCat breed="tabby" size={80} mood="idle" />
        </div>

        {/* Headline */}
        <motion.h1
          className="text-[28px] md:text-4xl font-bold text-[#1A1A1A] text-center leading-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Khám phá bản thân
          <br />
          <span className="text-momo">qua Cõi Giữa</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-base text-[#666666] text-center mb-10 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          24 câu hỏi &middot; 7 giống mèo &middot; 1 lộ trình riêng cho bạn
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
          Bắt đầu hành trình &rarr;
        </motion.button>

        {/* Footer note */}
        <motion.p
          className="mt-12 text-sm text-[#999999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          GenPath &mdash; Tìm đường đi, theo cách của bạn
        </motion.p>
      </div>
    </PageTransition>
  );
}

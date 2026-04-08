import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const PAIN_POINTS = [
  { emoji: '😰', text: 'Lo lắng không biết mình hợp với ngành nào, dù đã học gần xong đại học?' },
  { emoji: '😔', text: 'Thấy bạn bè có offer mà mình thì chưa biết bắt đầu từ đâu?' },
  { emoji: '🤯', text: 'Muốn học thêm kỹ năng nhưng không biết học gì cho đúng?' },
  { emoji: '😶‍🌫️', text: 'Sợ ra trường rồi mới phát hiện mình chọn sai nghề?' },
];

const CARD_DELAY = 0.6;

export default function InsightScreen() {
  const navigate = useNavigate();
  const [showReassure, setShowReassure] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowReassure(true), CARD_DELAY * 1000 * (PAIN_POINTS.length + 1));
    const t2 = setTimeout(() => setShowCta(true), CARD_DELAY * 1000 * (PAIN_POINTS.length + 2));
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-momo-soft via-[#FFF0F5] to-white flex flex-col items-center px-5 py-14 font-sans antialiased">
        <div className="max-w-lg w-full space-y-6">
          {/* Logo */}
          <motion.h2
            className="text-2xl md:text-3xl font-extrabold text-momo text-center tracking-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            StudentPath 🎓
          </motion.h2>

          {/* Hero text */}
          <motion.h1
            className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] text-center leading-snug tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Bạn đã bao giờ cảm thấy...
          </motion.h1>

          {/* Pain point cards */}
          <div className="space-y-4 pt-4">
            {PAIN_POINTS.map((card, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(165,0,100,0.08)] border-2 border-momo-soft px-6 py-5 flex items-start gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: CARD_DELAY * (i + 1) }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-3xl shrink-0 mt-0.5">{card.emoji}</span>
                <p className="text-base font-medium text-[#1A1A1A] leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Reassure stat */}
          <motion.div
            className="text-center pt-6"
            initial={{ opacity: 0, y: 15 }}
            animate={showReassure ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex flex-col items-center gap-3 bg-white rounded-2xl shadow-[0_4px_20px_rgba(165,0,100,0.08)] border-2 border-momo-soft px-8 py-6">
              <span className="text-4xl md:text-5xl font-extrabold text-momo tracking-tight">73%</span>
              <p className="text-base font-medium text-gray-600 max-w-xs">
                sinh viên Việt Nam cũng cảm thấy như vậy. Bạn không cô đơn.
              </p>
            </div>
          </motion.div>

          {/* Lead-in + CTA */}
          <motion.div
            className="text-center pt-6 space-y-6"
            initial={{ opacity: 0, y: 15 }}
            animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <p className="text-base font-medium text-gray-600">
                StudentPath sẽ giúp bạn trả lời 2 câu hỏi quan trọng nhất:
              </p>
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-momo-soft text-sm font-semibold text-momo">
                  🔍 Bạn là ai?
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-momo-soft text-sm font-semibold text-momo">
                  🎯 Bạn phù hợp với nghề gì?
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500">Chỉ mất 5 phút.</p>
            </div>

            <motion.button
              onClick={() => navigate('/quiz')}
              className="bg-momo hover:bg-momo-light text-white font-bold text-lg px-10 py-4 rounded-full shadow-[0_0_24px_rgba(216,45,139,0.3)] hover:shadow-[0_0_32px_rgba(216,45,139,0.4)] transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Bắt đầu khám phá"
            >
              Bắt đầu khám phá &rarr;
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

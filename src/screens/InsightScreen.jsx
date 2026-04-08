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
      <div className="min-h-screen bg-gradient-to-b from-momo-soft via-[#FFF0F5] to-white flex flex-col items-center px-5 py-14">
        <div className="max-w-lg w-full space-y-6">
          {/* Logo */}
          <motion.h2
            className="text-[32px] font-bold text-momo text-center tracking-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            GenPath 💗
          </motion.h2>

          {/* Hero text */}
          <motion.h1
            className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] text-center leading-snug"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Bạn đã bao giờ cảm thấy...
          </motion.h1>

          {/* Pain point cards — staggered slide-in */}
          <div className="space-y-4 pt-4">
            {PAIN_POINTS.map((card, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(165,0,100,0.12)] border border-gray-100 px-6 py-5 flex items-start gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: CARD_DELAY * (i + 1) }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-2xl shrink-0 mt-0.5">{card.emoji}</span>
                <p className="text-base text-[#1A1A1A] leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Reassure text */}
          <motion.div
            className="text-center pt-4"
            initial={{ opacity: 0, y: 15 }}
            animate={showReassure ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl font-semibold text-[#1A1A1A]">
              Bạn không cô đơn.{' '}
              <span className="text-momo">73% sinh viên Việt Nam</span>{' '}
              cũng cảm thấy như vậy.
            </p>
          </motion.div>

          {/* Lead-in + CTA */}
          <motion.div
            className="text-center pt-6 space-y-6"
            initial={{ opacity: 0, y: 15 }}
            animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3">
              <p className="text-base text-[#666666]">
                GenPath sẽ giúp bạn trả lời 2 câu hỏi quan trọng nhất:
              </p>
              <div className="flex flex-col items-center gap-2">
                <span className="text-base">
                  <span className="mr-2">🔍</span>
                  <span className="font-semibold text-[#1A1A1A]">Bạn là ai?</span>
                </span>
                <span className="text-base">
                  <span className="mr-2">🎯</span>
                  <span className="font-semibold text-[#1A1A1A]">Bạn phù hợp với nghề gì?</span>
                </span>
              </div>
              <p className="text-sm text-[#999999]">Chỉ mất 5 phút.</p>
            </div>

            <motion.button
              onClick={() => navigate('/quiz')}
              className="bg-momo hover:bg-momo-light text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-[0_4px_16px_rgba(165,0,100,0.12)] hover:shadow-[0_8px_32px_rgba(165,0,100,0.16)] transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Bắt đầu khám phá &rarr;
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

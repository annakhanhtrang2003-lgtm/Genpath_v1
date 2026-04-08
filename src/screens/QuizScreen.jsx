import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import quizData from '../data/quiz_v2.json';
import AnimatedCat from '../components/AnimatedCat';
import PageTransition from '../components/PageTransition';

const sections = quizData.sections;
const allQuestions = sections.flatMap((s) =>
  s.questions.map((q) => ({ ...q, sectionId: s.id, sectionTitle: s.title, sectionIcon: s.icon }))
);
const TOTAL = allQuestions.length;
const SECTION_A_COUNT = sections[0].questions.length;

const SECTION_BG = {
  section_a: 'from-momo-soft via-momo-soft/40 to-white',
  section_b: 'from-[#E3F2FD] via-[#E3F2FD]/40 to-white',
};

export default function QuizScreen() {
  const navigate = useNavigate();
  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const submitAnswerV2 = useGameStore((s) => s.submitAnswerV2);

  const [animState, setAnimState] = useState('idle');
  const [selectedId, setSelectedId] = useState(null);
  const [showDivider, setShowDivider] = useState(false);
  const dividerShownRef = useRef(false);

  const question = allQuestions[currentQuestion];
  const isLast = currentQuestion >= TOTAL - 1;

  const sectionInfo = useMemo(() => {
    if (!question) return null;
    const sectionIdx = question.sectionId === 'section_a' ? 0 : 1;
    const section = sections[sectionIdx];
    const posInSection = currentQuestion - (sectionIdx === 0 ? 0 : SECTION_A_COUNT) + 1;
    return {
      idx: sectionIdx,
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      icon: section.icon,
      total: section.questions.length,
      pos: posInSection,
    };
  }, [question, currentQuestion]);

  useEffect(() => {
    if (currentQuestion >= TOTAL) {
      navigate('/result');
    }
  }, [currentQuestion, navigate]);

  useEffect(() => {
    if (currentQuestion === SECTION_A_COUNT && !dividerShownRef.current) {
      dividerShownRef.current = true;
      setShowDivider(true);
      const timer = setTimeout(() => {
        setShowDivider(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion]);

  if (showDivider) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] to-white flex flex-col items-center justify-center px-6 font-sans antialiased">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="text-7xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
          >
            ✅
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Hoàn thành Phần 1!
          </h2>
          <p className="text-base font-medium text-gray-600">
            Bây giờ khám phá Phần 2...
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-2xl">{sections[1].icon}</span>
            <span className="text-sm font-semibold text-momo-info">{sections[1].title}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!question || !sectionInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-sans">
        Đang tải câu hỏi...
      </div>
    );
  }

  const bgClass = SECTION_BG[sectionInfo.id] || SECTION_BG.section_a;

  const sectionAProgress = sectionInfo.idx === 0
    ? (sectionInfo.pos / sectionInfo.total) * 100
    : 100;
  const sectionBProgress = sectionInfo.idx === 1
    ? (sectionInfo.pos / sectionInfo.total) * 100
    : 0;

  function handleSelect(answer) {
    if (animState !== 'idle') return;

    setSelectedId(answer.id);
    setAnimState('selected');

    setTimeout(() => {
      submitAnswerV2(question.id, answer.id, answer.scoring);
      setAnimState('sliding');

      setTimeout(() => {
        if (isLast) {
          setTimeout(() => {
            useGameStore.getState().calculateResult();
            navigate('/result');
          }, 50);
        } else {
          setAnimState('idle');
          setSelectedId(null);
        }
      }, 300);
    }, 250);
  }

  return (
    <PageTransition>
      <div className={`min-h-screen bg-gradient-to-b ${bgClass} flex flex-col transition-colors duration-500 font-sans antialiased`}>
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-5 py-3">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{sectionInfo.icon}</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">
                  {sectionInfo.title}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Câu {currentQuestion + 1}/{TOTAL}
              </span>
            </div>

            <div className="flex gap-1.5">
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-momo to-momo-light rounded-full"
                  animate={{ width: `${sectionAProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-momo-info to-[#90CAF9] rounded-full"
                  animate={{ width: `${sectionBProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex flex-col items-center px-5 py-8 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              className="w-full"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question card */}
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(165,0,100,0.08)] border-2 border-momo-soft px-6 py-8 mb-6">
                {question.context && (
                  <p className="text-base md:text-lg font-medium text-gray-600 mb-4 leading-relaxed text-center">
                    {question.context}
                  </p>
                )}
                <p className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] leading-snug text-center tracking-tight">
                  {question.text}
                </p>
              </div>

              {/* Answer buttons */}
              <div className="space-y-3">
                {question.answers.map((answer, idx) => {
                  const isSelected = selectedId === answer.id;
                  return (
                    <motion.button
                      key={answer.id}
                      onClick={() => handleSelect(answer)}
                      disabled={animState !== 'idle'}
                      className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-momo bg-momo-soft shadow-[0_4px_20px_rgba(165,0,100,0.12)]'
                          : 'border-gray-200 bg-white hover:border-momo-light hover:bg-momo-soft/50'
                      } ${animState !== 'idle' && !isSelected ? 'opacity-50' : ''}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + idx * 0.1 }}
                      whileTap={animState === 'idle' ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-start gap-3">
                        <motion.span
                          className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                            isSelected
                              ? 'border-momo bg-momo text-white'
                              : 'border-gray-300 text-gray-500'
                          }`}
                          animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {answer.id}
                        </motion.span>
                        <span className="text-[#1A1A1A] text-base font-semibold leading-relaxed pt-0.5">
                          {answer.text}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thinking cat at bottom */}
        <div className="text-center pb-4 opacity-40">
          <AnimatedCat breed="tabby" size={28} mood="thinking" />
        </div>
      </div>
    </PageTransition>
  );
}

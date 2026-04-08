import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import useGameStore from '../store/gameStore';
import roadmapData from '../data/roadmap_template.json';
import AnimatedCat from '../components/AnimatedCat';
import Confetti from '../components/Confetti';
import PageTransition from '../components/PageTransition';

// ─── Breed display data ──────────────────────────────────────
const BREED_DISPLAY = {
  tabby: {
    emoji: '🐱',
    description:
      'Bạn là người yêu trật tự, thích hệ thống hóa mọi thứ. Bạn thấy thoải mái khi mọi việc có quy trình rõ ràng và đạt hiệu quả cao nhất khi được tổ chức công việc theo cách logic. Sự kiên nhẫn và tỉ mỉ là vũ khí bí mật của bạn.',
    compatibility: {
      bestie: { id: 'bengal', reason: 'Cùng yêu logic, bổ sung nhau về chiều sâu phân tích' },
      complement: { id: 'siamese', reason: 'Siamese mang kỹ năng giao tiếp mà Tabby cần để dẫn dắt' },
      frenemy: { id: 'munchkin', reason: 'Munchkin phá luật, Tabby giữ luật — va chạm nhưng học được nhiều' },
    },
  },
  siamese: {
    emoji: '🐈',
    description:
      'Bạn sinh ra để kết nối. Bạn đọc được cảm xúc người khác rất nhanh, biết khi nào cần lắng nghe và khi nào cần lên tiếng. Giao tiếp không chỉ là kỹ năng mà là bản năng — bạn tạo ra sự tin tưởng ở bất cứ đâu.',
    compatibility: {
      bestie: { id: 'ragdoll', reason: 'Cùng thiên hướng con người, Ragdoll sâu sắc còn Siamese linh hoạt' },
      complement: { id: 'tabby', reason: 'Tabby giúp Siamese biến ý tưởng giao tiếp thành kế hoạch cụ thể' },
      frenemy: { id: 'bengal', reason: 'Bengal quá tập trung vào data, Siamese cần cảm xúc — nhưng kết hợp tốt thì rất mạnh' },
    },
  },
  bengal: {
    emoji: '🐆',
    description:
      'Bạn là kiểu người thấy vấn đề là phải giải. Tư duy phân tích sắc bén, bạn không ngại đào sâu vào dữ liệu và tìm ra pattern mà người khác bỏ qua. Bạn thích thử thách trí tuệ và cảm giác "eureka" khi crack được bài toán khó.',
    compatibility: {
      bestie: { id: 'tabby', reason: 'Tabby tổ chức, Bengal phân tích — dream team giải quyết vấn đề' },
      complement: { id: 'persian', reason: 'Persian mang góc nhìn sáng tạo, giúp Bengal truyền đạt insight đẹp hơn' },
      frenemy: { id: 'siamese', reason: 'Siamese ưu tiên cảm xúc, Bengal ưu tiên logic — cần học từ nhau' },
    },
  },
  persian: {
    emoji: '🐾',
    description:
      'Bạn là nghệ sĩ trong tâm hồn. Bạn thấy thế giới qua lăng kính thẩm mỹ, thích biến ý tưởng thành thứ nhìn thấy được. Bạn cần không gian riêng để sáng tạo và thường cho ra những sản phẩm có chiều sâu cảm xúc.',
    compatibility: {
      bestie: { id: 'munchkin', reason: 'Cùng sáng tạo — Persian tinh tế, Munchkin táo bạo' },
      complement: { id: 'bengal', reason: 'Bengal thêm chiều logic cho các quyết định thiết kế' },
      frenemy: { id: 'mainecoon', reason: 'Maine Coon muốn scale nhanh, Persian cần thời gian hoàn thiện — nhưng cùng nhau tạo ra sản phẩm cả đẹp cả mạnh' },
    },
  },
  mainecoon: {
    emoji: '🦁',
    description:
      'Bạn là người có tầm nhìn lớn và khả năng thực thi mạnh. Bạn không chỉ lên kế hoạch mà còn truyền cảm hứng cho cả team. Kết hợp giữa tư duy chiến lược và năng lượng hành động, bạn là kiểu leader tự nhiên.',
    compatibility: {
      bestie: { id: 'tabby', reason: 'Tabby biến vision của Maine Coon thành execution plan hoàn hảo' },
      complement: { id: 'ragdoll', reason: 'Ragdoll bổ sung EQ, giúp Maine Coon lãnh đạo nhân văn hơn' },
      frenemy: { id: 'persian', reason: 'Persian chậm và sâu, Maine Coon nhanh và rộng — tension tạo ra sản phẩm tốt' },
    },
  },
  ragdoll: {
    emoji: '🤍',
    description:
      'Bạn là người mang đến sự an toàn cho mọi người xung quanh. Bạn có trực giác tuyệt vời về cảm xúc và nhu cầu của người khác. Sự đồng cảm sâu sắc là siêu năng lực — bạn xây dựng môi trường nơi mọi người dám mở lòng.',
    compatibility: {
      bestie: { id: 'siamese', reason: 'Cùng thiên hướng con người — Siamese kết nối, Ragdoll chăm sóc' },
      complement: { id: 'mainecoon', reason: 'Maine Coon dẫn dắt, Ragdoll đảm bảo không ai bị bỏ lại' },
      frenemy: { id: 'bengal', reason: 'Bengal quá lý trí, Ragdoll quá cảm xúc — balance nhau' },
    },
  },
  munchkin: {
    emoji: '✨',
    description:
      'Bạn là người phá khuôn. Nhỏ nhưng có võ, bạn luôn tìm cách làm khác đi, thử thách status quo. Sự sáng tạo kết hợp tư duy hệ thống tạo ra những giải pháp bất ngờ — đó là lý do bạn phù hợp với innovation và product.',
    compatibility: {
      bestie: { id: 'persian', reason: 'Cùng sáng tạo — Munchkin phá, Persian xây' },
      complement: { id: 'tabby', reason: 'Tabby đem cấu trúc cho các ý tưởng bùng nổ của Munchkin' },
      frenemy: { id: 'tabby', reason: 'Tabby muốn trật tự, Munchkin muốn phá — nhưng khi hợp tác thì innovation có hệ thống' },
    },
  },
};

const LAYER_A_LABELS = {
  A1: { label: 'Hướng nội ↔ Hướng ngoại', left: 'Hướng nội', right: 'Hướng ngoại' },
  A2: { label: 'Trực giác ↔ Phân tích', left: 'Trực giác', right: 'Phân tích' },
  A3: { label: 'Tự chủ ↔ Đồng cảm', left: 'Tự chủ', right: 'Đồng cảm' },
  A4: { label: 'Suy ngẫm ↔ Hành động', left: 'Suy ngẫm', right: 'Hành động' },
  A5: { label: 'Linh hoạt ↔ Có cấu trúc', left: 'Linh hoạt', right: 'Có cấu trúc' },
};

const DRIVE_LABELS = {
  BUILD: { label: 'Xây Dựng', emoji: '🏗️', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  CONNECT: { label: 'Kết Nối', emoji: '🤝', color: 'bg-momo-soft text-momo border-momo-soft' },
  SOLVE: { label: 'Giải Quyết', emoji: '🧩', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CREATE: { label: 'Sáng Tạo', emoji: '🎨', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  EXPRESS: { label: 'Thể Hiện', emoji: '🎤', color: 'bg-violet-100 text-violet-700 border-violet-200' },
};

const APTITUDE_LABELS = {
  Verbal: { label: 'Ngôn ngữ', emoji: '📝' },
  Numerical: { label: 'Toán học', emoji: '🔢' },
  Systems: { label: 'Hệ thống', emoji: '⚙️' },
  Interpersonal: { label: 'Giao tiếp', emoji: '💬' },
  VisualCreative: { label: 'Sáng tạo thị giác', emoji: '🎨' },
};

// ─── Count-up hook ───────────────────────────────────────────
function useCountUp(target, duration = 1000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    let raf;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

// ─── Section wrapper with useInView ──────────────────────────
function Section({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function CatReveal({ breedId, breedDisplay, roadmapTemplate, revealed }) {
  return (
    <motion.div
      className="text-center py-12 md:py-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={revealed ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
    >
      <div className="mb-6">
        <AnimatedCat breed={breedId} size={120} mood={revealed ? 'happy' : 'idle'} />
      </div>
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
      >
        {roadmapTemplate?.breed_name || breedId}
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-momo font-bold mb-6"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        {roadmapTemplate?.tagline}
      </motion.p>
      <motion.p
        className="text-base md:text-lg font-medium text-gray-600 leading-relaxed max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
      >
        {breedDisplay.description}
      </motion.p>

      {/* Secondary breed */}
    </motion.div>
  );
}

function PersonalityBars({ normalizedA, revealed }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldAnimate = revealed && isInView;

  return (
    <div ref={ref} className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(165,0,100,0.08)] border-2 border-momo-soft p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] mb-6 tracking-tight">
        🧬 Tính cách của bạn
      </h2>
      <div className="space-y-5">
        {Object.entries(LAYER_A_LABELS).map(([key, meta], i) => {
          const value = normalizedA[key] ?? 50;
          const display = useCountUp(value, 1200, shouldAnimate);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">{meta.label}</span>
                <span className="text-sm font-extrabold text-momo">
                  {display}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-momo-light to-momo rounded-full"
                  initial={{ width: 0 }}
                  animate={shouldAnimate ? { width: `${value}%` } : { width: 0 }}
                  transition={{ duration: 1.2, delay: 0.1 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopDrives({ rankedB, allDrives }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(165,0,100,0.08)] border-2 border-momo-soft p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] mb-6 tracking-tight">
        🔥 Động lực chính
      </h2>
      <div className="space-y-3">
        {allDrives.slice(0, 3).map((d, i) => {
          const meta = DRIVE_LABELS[d.key];
          const isPrimary = i === 0;
          return (
            <div
              key={d.key}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${isPrimary ? meta.color : 'bg-[#F8F8F8] border-gray-100'}`}
            >
              <span className="text-2xl">{meta.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold ${isPrimary ? '' : 'text-[#1A1A1A]'}`}>{meta.label}</span>
                  {isPrimary && (
                    <span className="text-[10px] font-bold bg-white/60 px-2 py-0.5 rounded-full">
                      #1
                    </span>
                  )}
                </div>
              </div>
              <span className="text-lg font-extrabold">{d.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopAptitudes({ leveledC }) {
  const sorted = Object.entries(leveledC)
    .map(([key, level]) => ({
      key,
      level,
      rank: level === 'High' ? 3 : level === 'Mid' ? 2 : 1,
    }))
    .sort((a, b) => b.rank - a.rank);

  const levelColors = {
    High: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Mid: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(165,0,100,0.08)] border-2 border-momo-soft p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] mb-6 tracking-tight">
        💪 Năng lực nổi bật
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sorted.map(({ key, level }) => {
          const meta = APTITUDE_LABELS[key];
          return (
            <div
              key={key}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${levelColors[level]}`}
            >
              <span className="text-2xl">{meta.emoji}</span>
              <span className="text-sm font-bold text-center">{meta.label}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/60">
                {level}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CareerCluster({ careerCluster }) {
  if (!careerCluster) return null;
  const careers = careerCluster.split(',').map((c) => c.trim());

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(165,0,100,0.08)] border-2 border-momo-soft p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] mb-6 tracking-tight">
        💼 Nghề nghiệp phù hợp
      </h2>
      <div className="flex flex-wrap gap-2">
        {careers.map((career) => (
          <span
            key={career}
            className="px-4 py-2 bg-momo-soft text-momo rounded-full text-sm font-bold"
          >
            {career}
          </span>
        ))}
      </div>
    </div>
  );
}

function CompatibilitySection({ compatibility }) {
  if (!compatibility) return null;

  const types = [
    { key: 'bestie', label: 'Tri kỷ', emoji: '💜', desc: 'Bạn thân' },
    { key: 'complement', label: 'Bổ sung', emoji: '🤝', desc: 'Bổ trợ lẫn nhau' },
    { key: 'frenemy', label: 'Kỳ phùng', emoji: '⚡', desc: 'Vừa bạn vừa thù' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(165,0,100,0.08)] border-2 border-momo-soft p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] mb-6 tracking-tight">
        🐾 Tương thích
      </h2>
      <div className="space-y-3">
        {types.map(({ key, label, emoji, desc }) => {
          const match = compatibility[key];
          if (!match) return null;
          const matchTemplate = roadmapData.roadmap_templates[match.id];
          const matchDisplay = BREED_DISPLAY[match.id];

          return (
            <motion.div
              key={key}
              className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F8F8] border border-gray-100"
              whileHover={{ scale: 1.01 }}
            >
              <span className="text-3xl shrink-0">{emoji}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-[#1A1A1A]">{label}</span>
                  <span className="text-xs font-medium text-gray-500">{desc}</span>
                </div>
                <p className="text-sm font-bold text-momo">
                  {matchDisplay?.emoji}{' '}
                  {matchTemplate?.breed_name || match.id}
                </p>
                <p className="text-sm font-medium text-gray-600 mt-0.5">{match.reason}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function ResultScreen() {
  const navigate = useNavigate();
  const quizResult = useGameStore((s) => s.quizResult);
  const rawScores = useGameStore((s) => s.rawScores);
  const roadmapResult = useGameStore((s) => s.roadmapResult);
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!quizResult) {
      navigate('/');
      return;
    }
    const t1 = setTimeout(() => { setRevealed(true); setShowConfetti(true); }, 300);
    const t2 = setTimeout(() => setShowConfetti(false), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [quizResult, navigate]);

  if (!quizResult) return null;

  const breedId = quizResult.primary;
  const breedDisplay = BREED_DISPLAY[breedId] || BREED_DISPLAY.tabby;
  const roadmapTemplate = roadmapResult || roadmapData.roadmap_templates[breedId];

  const normalizedA = {};
  const MAX_POSSIBLE_RAW = 3 * 24;
  for (const key of ['A1', 'A2', 'A3', 'A4', 'A5']) {
    const raw = rawScores[key] || 0;
    normalizedA[key] = Math.max(
      0,
      Math.min(100, Math.round(50 + (raw / MAX_POSSIBLE_RAW) * 50))
    );
  }

  const LAYER_B_KEYS = ['BUILD', 'CONNECT', 'SOLVE', 'CREATE', 'EXPRESS'];
  const allDrives = LAYER_B_KEYS
    .map((key) => ({ key, score: rawScores[key] || 0 }))
    .sort((a, b) => b.score - a.score);
  const rankedB = {
    primary_drive: allDrives[0].key,
    secondary_drive: allDrives[1].key,
  };

  const LAYER_C_KEYS = ['Verbal', 'Numerical', 'Systems', 'Interpersonal', 'VisualCreative'];
  const cScores = LAYER_C_KEYS.map((key) => rawScores[key] || 0);
  const maxC = Math.max(...cScores, 1);
  const leveledC = {};
  for (const key of LAYER_C_KEYS) {
    const ratio = (rawScores[key] || 0) / maxC;
    leveledC[key] = ratio >= 0.66 ? 'High' : ratio >= 0.33 ? 'Mid' : 'Low';
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-momo-soft via-white to-white font-sans antialiased">
        {showConfetti && <Confetti />}

        {/* Top accent */}
        <div className="w-full h-1.5 bg-gradient-to-r from-momo via-momo-light to-momo-warning" />

        <div className="max-w-2xl mx-auto px-5 py-6">
          {/* Logo */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-momo text-center tracking-tight">
            StudentPath 🎓
          </h2>

          {/* 1. Cat Reveal — full viewport hero */}
          <CatReveal
            breedId={breedId}
            breedDisplay={breedDisplay}
            roadmapTemplate={roadmapTemplate}
            revealed={revealed}
          />

          {/* Secondary breed */}
          {quizResult.secondary && (
            <motion.p
              className="text-center text-sm font-semibold text-gray-500 -mt-8 mb-8"
              initial={{ opacity: 0 }}
              animate={revealed ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
            >
              Giống phụ:{' '}
              <span className="font-bold text-gray-700">
                {BREED_DISPLAY[quizResult.secondary]?.emoji}{' '}
                {roadmapData.roadmap_templates[quizResult.secondary]?.breed_name ||
                  quizResult.secondary}
              </span>
            </motion.p>
          )}

          {/* Scrollable sections with stagger */}
          <div className="space-y-6">
            {/* 2. Personality Bars */}
            <Section>
              <PersonalityBars normalizedA={normalizedA} revealed={revealed} />
            </Section>

            {/* 3. Top Drives */}
            <Section delay={0.1}>
              <TopDrives rankedB={rankedB} allDrives={allDrives} />
            </Section>

            {/* 4. Top Aptitudes */}
            <Section delay={0.1}>
              <TopAptitudes leveledC={leveledC} />
            </Section>

            {/* 5. Career Cluster */}
            <Section delay={0.1}>
              <CareerCluster careerCluster={roadmapTemplate?.career_cluster} />
            </Section>

            {/* 6. Compatibility */}
            <Section delay={0.1}>
              <CompatibilitySection compatibility={breedDisplay.compatibility} />
            </Section>

            {/* Action buttons */}
            <Section delay={0.1}>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-8">
                <motion.button
                  onClick={() => navigate('/forecast')}
                  className="flex-1 bg-momo hover:bg-momo-light text-white font-bold py-4 px-8 rounded-full shadow-[0_0_24px_rgba(216,45,139,0.3)] hover:shadow-[0_0_32px_rgba(216,45,139,0.4)] transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Xem dự báo nghề nghiệp"
                >
                  Xem dự báo nghề nghiệp &rarr;
                </motion.button>
                <motion.button
                  onClick={() => navigate('/roadmap')}
                  className="flex-1 bg-white hover:bg-[#F8F8F8] text-momo font-bold py-4 px-8 rounded-full border-2 border-momo-soft hover:border-momo-light transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Xem lộ trình kỹ năng"
                >
                  Xem lộ trình kỹ năng
                </motion.button>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

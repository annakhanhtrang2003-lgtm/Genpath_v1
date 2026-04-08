import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  A1: 'Hướng nội ↔ Hướng ngoại',
  A2: 'Trực giác ↔ Phân tích',
  A3: 'Tự chủ ↔ Đồng cảm',
  A4: 'Suy ngẫm ↔ Hành động',
  A5: 'Linh hoạt ↔ Có cấu trúc',
};

const DRIVE_LABELS = {
  BUILD: { label: 'Xây Dựng', color: 'bg-blue-100 text-blue-700' },
  CONNECT: { label: 'Kết Nối', color: 'bg-momo-soft text-momo' },
  SOLVE: { label: 'Giải Quyết', color: 'bg-emerald-100 text-emerald-700' },
  CREATE: { label: 'Sáng Tạo', color: 'bg-amber-100 text-amber-700' },
  EXPRESS: { label: 'Thể Hiện', color: 'bg-violet-100 text-violet-700' },
};

const APTITUDE_LABELS = {
  Verbal: 'Ngôn ngữ',
  Numerical: 'Toán học',
  Systems: 'Hệ thống',
  Interpersonal: 'Giao tiếp',
  VisualCreative: 'Sáng tạo thị giác',
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

// ─── Sub-components ──────────────────────────────────────────

function CatReveal({ breedId, breedDisplay, roadmapTemplate, revealed }) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={revealed ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
    >
      <div className="mb-4">
        <AnimatedCat breed={breedId} size={100} mood={revealed ? 'happy' : 'idle'} />
      </div>
      <motion.h1
        className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
      >
        {roadmapTemplate?.breed_name || breedId}
      </motion.h1>
      <motion.p
        className="text-lg text-momo font-medium mb-4"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        {roadmapTemplate?.tagline}
      </motion.p>
      <motion.p
        className="text-[#666666] leading-relaxed max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
      >
        {breedDisplay.description}
      </motion.p>
    </motion.div>
  );
}

function PersonalityBars({ normalizedA, revealed }) {
  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_16px_rgba(165,0,100,0.12)] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={revealed ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.8 }}
    >
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-5">
        Tính cách của bạn
      </h2>
      <div className="space-y-4">
        {Object.entries(LAYER_A_LABELS).map(([key, label], i) => {
          const value = normalizedA[key] ?? 50;
          const display = useCountUp(value, 1200, revealed);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-[#666666]">{label}</span>
                <span className="text-sm font-semibold text-momo">
                  {display}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-momo-light to-momo rounded-full"
                  initial={{ width: 0 }}
                  animate={revealed ? { width: `${value}%` } : { width: 0 }}
                  transition={{ duration: 1.2, delay: 0.9 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function TopDrives({ rankedB }) {
  const primary = DRIVE_LABELS[rankedB.primary_drive];
  const secondary = DRIVE_LABELS[rankedB.secondary_drive];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_16px_rgba(165,0,100,0.12)] p-6">
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
        Động lực chính
      </h2>
      <div className="flex flex-wrap gap-3">
        <span
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${primary.color} ring-2 ring-current/20`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          {primary.label}
          <span className="text-xs opacity-60 ml-1">Chính</span>
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${secondary.color}`}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-60" />
          {secondary.label}
          <span className="text-xs opacity-60 ml-1">Phụ</span>
        </span>
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
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 2);

  const levelColors = {
    High: 'bg-emerald-100 text-emerald-700',
    Mid: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-gray-100 text-[#999999]',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_16px_rgba(165,0,100,0.12)] p-6">
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
        Năng lực nổi bật
      </h2>
      <div className="flex flex-wrap gap-3">
        {sorted.map(({ key, level }) => (
          <span
            key={key}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${levelColors[level]}`}
          >
            {APTITUDE_LABELS[key] || key}
            <span className="text-xs opacity-70">{level}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CareerCluster({ careerCluster }) {
  if (!careerCluster) return null;
  const careers = careerCluster.split(',').map((c) => c.trim());

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_16px_rgba(165,0,100,0.12)] p-6">
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
        Nghề nghiệp phù hợp
      </h2>
      <div className="flex flex-wrap gap-2">
        {careers.map((career) => (
          <span
            key={career}
            className="px-3 py-1.5 bg-momo-soft text-momo rounded-lg text-sm font-medium"
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_16px_rgba(165,0,100,0.12)] p-6">
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
        Tương thích với các giống mèo khác
      </h2>
      <div className="space-y-4">
        {types.map(({ key, label, emoji, desc }) => {
          const match = compatibility[key];
          if (!match) return null;
          const matchTemplate = roadmapData.roadmap_templates[match.id];
          const matchDisplay = BREED_DISPLAY[match.id];

          return (
            <motion.div
              key={key}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#F8F8F8]"
              whileHover={{ scale: 1.01 }}
            >
              <span className="text-2xl shrink-0">{emoji}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-[#1A1A1A]">
                    {label}
                  </span>
                  <span className="text-xs text-[#999999]">{desc}</span>
                </div>
                <p className="text-sm font-medium text-momo">
                  {matchDisplay?.emoji}{' '}
                  {matchTemplate?.breed_name || match.id}
                </p>
                <p className="text-xs text-[#666666] mt-0.5">{match.reason}</p>
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
  const drives = LAYER_B_KEYS
    .map((key) => ({ key, score: rawScores[key] || 0 }))
    .sort((a, b) => b.score - a.score);
  const rankedB = {
    primary_drive: drives[0].key,
    secondary_drive: drives[1].key,
  };

  const LAYER_C_KEYS = ['Verbal', 'Numerical', 'Systems', 'Interpersonal', 'VisualCreative'];
  const cScores = LAYER_C_KEYS.map((key) => rawScores[key] || 0);
  const maxC = Math.max(...cScores, 1);
  const leveledC = {};
  for (const key of LAYER_C_KEYS) {
    const ratio = (rawScores[key] || 0) / maxC;
    leveledC[key] = ratio >= 0.66 ? 'High' : ratio >= 0.33 ? 'Mid' : 'Low';
  }

  const sectionStagger = (index) => ({
    initial: { opacity: 0, y: 20 },
    animate: revealed ? { opacity: 1, y: 0 } : {},
    transition: { delay: 1 + index * 0.15 },
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-momo-soft via-white to-white">
        {showConfetti && <Confetti />}

        {/* Top accent */}
        <div className="w-full h-2 bg-gradient-to-r from-momo via-momo-light to-momo-warning" />

        <div className="max-w-2xl mx-auto px-5 py-10 space-y-6">
          {/* Logo */}
          <h2 className="text-[32px] font-bold text-momo text-center tracking-tight">
            GenPath 💗
          </h2>

          {/* 1. Cat Reveal */}
          <CatReveal
            breedId={breedId}
            breedDisplay={breedDisplay}
            roadmapTemplate={roadmapTemplate}
            revealed={revealed}
          />

          {/* Secondary breed mention */}
          {quizResult.secondary && (
            <motion.p
              className="text-center text-sm text-[#999999]"
              initial={{ opacity: 0 }}
              animate={revealed ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
            >
              Giống phụ:{' '}
              <span className="font-medium text-[#666666]">
                {BREED_DISPLAY[quizResult.secondary]?.emoji}{' '}
                {roadmapData.roadmap_templates[quizResult.secondary]?.breed_name ||
                  quizResult.secondary}
              </span>
            </motion.p>
          )}

          {/* 2. Personality Bars */}
          <PersonalityBars normalizedA={normalizedA} revealed={revealed} />

          {/* 3. Top Drives */}
          <motion.div {...sectionStagger(0)}>
            <TopDrives rankedB={rankedB} />
          </motion.div>

          {/* 4. Top Aptitudes */}
          <motion.div {...sectionStagger(1)}>
            <TopAptitudes leveledC={leveledC} />
          </motion.div>

          {/* 5. Career Cluster */}
          <motion.div {...sectionStagger(2)}>
            <CareerCluster careerCluster={roadmapTemplate?.career_cluster} />
          </motion.div>

          {/* 6. Compatibility */}
          <motion.div {...sectionStagger(3)}>
            <CompatibilitySection compatibility={breedDisplay.compatibility} />
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 pt-4 pb-8"
            {...sectionStagger(4)}
          >
            <motion.button
              onClick={() => navigate('/forecast')}
              className="flex-1 bg-momo hover:bg-momo-light text-white font-semibold py-4 px-8 rounded-2xl shadow-[0_4px_16px_rgba(165,0,100,0.12)] hover:shadow-[0_8px_32px_rgba(165,0,100,0.16)] transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Xem dự báo nghề nghiệp
            </motion.button>
            <motion.button
              onClick={() => navigate('/roadmap')}
              className="flex-1 bg-white hover:bg-[#F8F8F8] text-momo font-semibold py-4 px-8 rounded-2xl border-2 border-momo-soft hover:border-momo-light shadow-[0_2px_8px_rgba(165,0,100,0.08)] transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Xem lộ trình kỹ năng
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

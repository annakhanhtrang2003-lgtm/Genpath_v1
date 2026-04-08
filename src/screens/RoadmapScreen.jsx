import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import useGameStore from '../store/gameStore';

// ─── Constants ──────────────────────────────────────────────
const PRIORITY_STYLES = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-amber-100 text-amber-700',
  3: 'bg-gray-100 text-gray-500',
};

const PRIORITY_LABELS = { 1: 'P1', 2: 'P2', 3: 'P3' };

const CATEGORY_COLORS = {
  core: 'bg-blue-50 text-blue-600',
  tool: 'bg-violet-50 text-violet-600',
  power: 'bg-emerald-50 text-emerald-600',
  soft: 'bg-momo-soft text-momo',
  experience: 'bg-amber-50 text-amber-600',
  strategy: 'bg-indigo-50 text-indigo-600',
};

const YEAR_ICONS = ['🌱', '🔥', '⚔️', '🎯'];

// ─── Section wrapper ────────────────────────────────────────
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

// ─── Quick Wins ─────────────────────────────────────────────

function QuickWinsSection({ quickWins }) {
  const [checked, setChecked] = useState(() => quickWins.map(() => false));

  if (!quickWins || quickWins.length === 0) return null;

  const completed = checked.filter(Boolean).length;
  const progress = (completed / quickWins.length) * 100;

  function toggle(index) {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-momo-soft shadow-[0_4px_20px_rgba(165,0,100,0.08)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">
          ⚡ Quick Wins — Tháng đầu tiên
        </h2>
        <span className="text-sm font-extrabold text-momo">
          {completed}/{quickWins.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
        <motion.div
          className="h-full bg-gradient-to-r from-momo-light to-momo rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="space-y-2.5">
        {quickWins.map((qw, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all cursor-pointer ${
              checked[i]
                ? 'bg-momo-soft/60 opacity-60'
                : 'bg-[#F8F8F8] hover:bg-momo-soft/30'
            }`}
          >
            <span
              className={`shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                checked[i]
                  ? 'bg-momo border-momo text-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {checked[i] && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className={`text-sm font-bold ${checked[i] ? 'line-through text-gray-500' : 'text-[#1A1A1A]'}`}>
                {qw.title}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                <span className="text-xs font-semibold text-gray-500">{qw.time}</span>
                <span className="text-xs font-bold text-momo">{qw.output}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Year Card ──────────────────────────────────────────────

function YearCard({ yearNum, yearData, isCurrent }) {
  const icon = YEAR_ICONS[yearNum - 1] || '📌';
  const isPast = yearData.status === 'past';

  return (
    <div className="relative flex gap-4">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0 font-bold ${
            isCurrent
              ? 'bg-momo text-white shadow-[0_0_16px_rgba(165,0,100,0.3)] ring-4 ring-momo-soft'
              : isPast
                ? 'bg-gray-200 text-gray-500'
                : 'bg-white border-2 border-gray-200 text-gray-500'
          }`}
        >
          {icon}
        </div>
        <div className="w-0.5 flex-1 bg-gray-200 min-h-[24px]" />
      </div>

      {/* Card content */}
      <div className={`flex-1 pb-8 transition-opacity ${isPast ? 'opacity-50' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <h3 className={`text-base font-extrabold ${isCurrent ? 'text-momo' : 'text-[#1A1A1A]'}`}>
            {yearData.label}
          </h3>
          {isCurrent && (
            <span className="text-[10px] font-bold bg-momo text-white px-2 py-0.5 rounded-full">
              Hiện tại
            </span>
          )}
        </div>

        <div className="space-y-2">
          {yearData.tasks.map((task, i) => (
            <TaskItem key={i} task={task} dimmed={isPast} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Task Item ──────────────────────────────────────────────

function TaskItem({ task, dimmed }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
        dimmed ? 'border-gray-100' : 'border-gray-200'
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left cursor-pointer hover:bg-[#F8F8F8] transition-colors"
      >
        <span
          className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            PRIORITY_STYLES[task.priority] || PRIORITY_STYLES[3]
          }`}
        >
          {PRIORITY_LABELS[task.priority] || 'P3'}
        </span>

        <span className="flex-1 text-sm font-bold text-[#1A1A1A] truncate">
          {task.skill}
        </span>

        {task.category && (
          <span
            className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              CATEGORY_COLORS[task.category] || 'bg-gray-50 text-gray-500'
            }`}
          >
            {task.category}
          </span>
        )}

        {task.time_weeks > 0 && (
          <span className="shrink-0 text-xs font-semibold text-gray-500">
            {task.time_weeks}w
          </span>
        )}

        <svg
          className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-3 border-t border-gray-100">
          {task.specifics && (
            <p className="text-xs font-medium text-gray-600 mt-2">{task.specifics}</p>
          )}
          {task.priority_note && (
            <p className="text-xs font-semibold text-momo-warning mt-1">{task.priority_note}</p>
          )}
          {task.is_quick_win && (
            <span className="inline-block mt-2 text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">
              Quick win
            </span>
          )}

          {task.resources_resolved && task.resources_resolved.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {task.resources_resolved.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-momo hover:text-momo-dark underline underline-offset-2"
                >
                  {res.name}
                  <CostBadge cost={res.cost} />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Cost Badge ─────────────────────────────────────────────

function CostBadge({ cost }) {
  const styles = {
    free: 'bg-green-100 text-green-600',
    paid: 'bg-amber-100 text-amber-600',
    freemium: 'bg-blue-100 text-blue-600',
  };
  if (!styles[cost]) return null;
  return (
    <span className={`text-[9px] font-bold px-1.5 py-px rounded-full ${styles[cost]}`}>
      {cost === 'free' ? 'Free' : cost === 'paid' ? 'Paid' : 'Freemium'}
    </span>
  );
}

// ─── Resources Panel ────────────────────────────────────────

function ResourcesPanel({ years }) {
  const seen = new Set();
  const allResources = [];

  for (const yearData of Object.values(years)) {
    for (const task of yearData.tasks) {
      if (task.resources_resolved) {
        for (const res of task.resources_resolved) {
          if (!seen.has(res.id)) {
            seen.add(res.id);
            allResources.push(res);
          }
        }
      }
    }
  }

  if (allResources.length === 0) return null;

  const typeEmoji = { course: '📚', video: '🎬', tool: '🔧', cert: '🏅', community: '👥' };

  return (
    <div className="bg-white rounded-2xl border-2 border-momo-soft shadow-[0_4px_20px_rgba(165,0,100,0.08)] p-6 md:p-8">
      <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-5 tracking-tight">
        📚 Tài nguyên học tập
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {allResources.map((res) => (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 rounded-2xl bg-[#F8F8F8] hover:bg-momo-soft/50 transition-colors group border border-gray-100"
          >
            <span className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-base group-hover:border-momo-soft">
              {typeEmoji[res.type] || '🔗'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-momo truncate">
                {res.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <CostBadge cost={res.cost} />
                {res.language && (
                  <span className="text-[9px] font-bold text-gray-500 uppercase">
                    {res.language === 'both' ? 'EN/VI' : res.language.toUpperCase()}
                  </span>
                )}
                {res.note && (
                  <span className="text-[10px] font-medium text-gray-500 truncate">
                    {res.note}
                  </span>
                )}
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-momo-light shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Main Screen ────────────────────────────────────────────

export default function RoadmapScreen() {
  const navigate = useNavigate();
  const roadmapResult = useGameStore((s) => s.roadmapResult);
  const userContext = useGameStore((s) => s.userContext);

  useEffect(() => {
    if (!roadmapResult) {
      navigate('/');
    }
  }, [roadmapResult, navigate]);

  if (!roadmapResult) return null;

  const { breed_name, years, quick_wins, career_cluster } = roadmapResult;
  const major = userContext?.major || '';

  const yearEntries = Object.entries(years).sort(([a], [b]) => a.localeCompare(b));
  const totalYears = yearEntries.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-momo-soft via-white to-white font-sans antialiased">
      <div className="w-full h-1.5 bg-gradient-to-r from-momo via-momo-light to-momo-warning" />

      <div className="max-w-2xl mx-auto px-5 py-10 space-y-8">
        {/* Header */}
        <Section>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-momo tracking-tight mb-4">
              StudentPath 🎓
            </h2>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight">
              {breed_name || 'Your Breed'}
              {major ? ` × ${major}` : ''}
            </h1>
            <p className="text-lg font-bold text-momo mt-2">
              🗺️ Lộ trình {totalYears} năm
            </p>
            {career_cluster && (
              <p className="text-sm font-semibold text-gray-500 mt-2">
                {career_cluster}
              </p>
            )}
          </div>
        </Section>

        {/* Quick Wins */}
        <Section delay={0.1}>
          <QuickWinsSection quickWins={quick_wins} />
        </Section>

        {/* Timeline */}
        <Section delay={0.1}>
          <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-5 tracking-tight">
            📅 Lộ trình theo năm
          </h2>
          <div>
            {yearEntries.map(([yearKey, yearData]) => {
              const yearNum = parseInt(yearKey.replace('year_', ''), 10);
              return (
                <YearCard
                  key={yearKey}
                  yearNum={yearNum}
                  yearData={yearData}
                  isCurrent={yearData.status === 'current'}
                />
              );
            })}
          </div>
        </Section>

        {/* Resources */}
        <Section delay={0.1}>
          <ResourcesPanel years={years} />
        </Section>

        {/* CTA */}
        <Section delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-8">
            <motion.button
              onClick={() => navigate('/result')}
              className="flex-1 bg-white hover:bg-[#F8F8F8] text-momo font-bold py-4 px-8 rounded-full border-2 border-momo-soft hover:border-momo-light transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Quay lại kết quả"
            >
              &larr; Quay lại kết quả
            </motion.button>
            <motion.button
              onClick={() => navigate('/forecast')}
              className="flex-1 bg-momo hover:bg-momo-light text-white font-bold py-4 px-8 rounded-full shadow-[0_0_24px_rgba(216,45,139,0.3)] hover:shadow-[0_0_32px_rgba(216,45,139,0.4)] transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Xem dự báo nghề nghiệp"
            >
              Xem dự báo &rarr;
            </motion.button>
          </div>
        </Section>
      </div>
    </div>
  );
}

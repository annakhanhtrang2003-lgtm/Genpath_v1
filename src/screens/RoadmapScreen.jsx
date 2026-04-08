import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';

// ─── Priority badge colors ──────────────────────────────────
const PRIORITY_STYLES = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-amber-100 text-amber-700',
  3: 'bg-gray-100 text-[#999999]',
};

const PRIORITY_LABELS = {
  1: 'P1',
  2: 'P2',
  3: 'P3',
};

const CATEGORY_COLORS = {
  core: 'bg-blue-50 text-blue-600',
  tool: 'bg-violet-50 text-violet-600',
  power: 'bg-emerald-50 text-emerald-600',
  soft: 'bg-momo-soft text-momo',
  experience: 'bg-amber-50 text-amber-600',
  strategy: 'bg-indigo-50 text-indigo-600',
};

const YEAR_ICONS = ['🌱', '🔥', '⚔️', '🎯'];

// ─── Quick Wins Section ──────────────────────────────────────

function QuickWinsSection({ quickWins }) {
  const [checked, setChecked] = useState(() => quickWins.map(() => false));

  if (!quickWins || quickWins.length === 0) return null;

  const completed = checked.filter(Boolean).length;

  function toggle(index) {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  return (
    <div className="bg-gradient-to-br from-momo-soft to-white rounded-2xl border-2 border-momo-light/30 shadow-[0_4px_16px_rgba(165,0,100,0.12)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#1A1A1A]">
          Quick Wins — Tháng đầu tiên
        </h2>
        <span className="text-sm font-medium text-momo">
          {completed}/{quickWins.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-momo-soft rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-momo rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(completed / quickWins.length) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {quickWins.map((qw, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
              checked[i]
                ? 'bg-momo-soft/80 opacity-60'
                : 'bg-white hover:bg-[#F8F8F8]'
            }`}
          >
            {/* Checkbox */}
            <span
              className={`shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                checked[i]
                  ? 'bg-momo border-momo text-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {checked[i] && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium ${checked[i] ? 'line-through text-[#999999]' : 'text-[#1A1A1A]'}`}>
                {qw.title}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                <span className="text-xs text-[#999999]">
                  {qw.time}
                </span>
                <span className="text-xs text-momo font-medium">
                  {qw.output}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Year Card ───────────────────────────────────────────────

function YearCard({ yearNum, yearData, isCurrent }) {
  const icon = YEAR_ICONS[yearNum - 1] || '📌';
  const isPast = yearData.status === 'past';

  return (
    <div className="relative flex gap-4">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
            isCurrent
              ? 'bg-momo text-white shadow-[0_4px_16px_rgba(165,0,100,0.12)] ring-4 ring-momo-soft'
              : isPast
                ? 'bg-gray-200 text-[#999999]'
                : 'bg-white border-2 border-gray-200 text-[#999999]'
          }`}
        >
          {icon}
        </div>
        {/* Vertical line (except last) */}
        <div className="w-0.5 flex-1 bg-gray-200 min-h-[24px]" />
      </div>

      {/* Card content */}
      <div
        className={`flex-1 pb-8 transition-opacity ${
          isPast ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <h3 className={`text-base font-semibold ${isCurrent ? 'text-momo' : 'text-[#1A1A1A]'}`}>
            {yearData.label}
          </h3>
          {isCurrent && (
            <span className="text-xs bg-momo-soft text-momo px-2 py-0.5 rounded-full font-medium">
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

// ─── Task Item ───────────────────────────────────────────────

function TaskItem({ task, dimmed }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all ${
        dimmed ? 'border-gray-100' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left cursor-pointer hover:bg-[#F8F8F8] transition-colors"
      >
        {/* Priority badge */}
        <span
          className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${
            PRIORITY_STYLES[task.priority] || PRIORITY_STYLES[3]
          }`}
        >
          {PRIORITY_LABELS[task.priority] || 'P3'}
        </span>

        {/* Skill name */}
        <span className="flex-1 text-sm font-medium text-[#1A1A1A] truncate">
          {task.skill}
        </span>

        {/* Category badge */}
        {task.category && (
          <span
            className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
              CATEGORY_COLORS[task.category] || 'bg-gray-50 text-[#999999]'
            }`}
          >
            {task.category}
          </span>
        )}

        {/* Time */}
        {task.time_weeks > 0 && (
          <span className="shrink-0 text-xs text-[#999999]">
            {task.time_weeks}w
          </span>
        )}

        {/* Expand arrow */}
        <svg
          className={`w-4 h-4 text-gray-300 transition-transform shrink-0 ${
            expanded ? 'rotate-180' : ''
          }`}
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
            <p className="text-xs text-[#666666] mt-2">{task.specifics}</p>
          )}
          {task.priority_note && (
            <p className="text-xs text-momo-warning mt-1 italic">{task.priority_note}</p>
          )}
          {task.is_quick_win && (
            <span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Quick win
            </span>
          )}

          {/* Inline resources */}
          {task.resources_resolved && task.resources_resolved.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {task.resources_resolved.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-momo hover:text-momo-dark underline underline-offset-2"
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

// ─── Cost Badge ──────────────────────────────────────────────

function CostBadge({ cost }) {
  if (cost === 'free') {
    return (
      <span className="text-[9px] font-semibold bg-green-100 text-green-600 px-1.5 py-px rounded-full">
        Free
      </span>
    );
  }
  if (cost === 'paid') {
    return (
      <span className="text-[9px] font-semibold bg-amber-100 text-amber-600 px-1.5 py-px rounded-full">
        Paid
      </span>
    );
  }
  if (cost === 'freemium') {
    return (
      <span className="text-[9px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-px rounded-full">
        Freemium
      </span>
    );
  }
  return null;
}

// ─── Resources Panel ─────────────────────────────────────────

function ResourcesPanel({ years }) {
  // Collect all unique resources across all years
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_16px_rgba(165,0,100,0.12)] p-6">
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
        Tài nguyên học tập
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {allResources.map((res) => (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-xl bg-[#F8F8F8] hover:bg-momo-soft transition-colors group"
          >
            <span className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm group-hover:border-momo-light/30">
              {res.type === 'course' ? '📚' : res.type === 'video' ? '🎬' : res.type === 'tool' ? '🔧' : res.type === 'cert' ? '🏅' : res.type === 'community' ? '👥' : '🔗'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-momo truncate">
                {res.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <CostBadge cost={res.cost} />
                {res.language && (
                  <span className="text-[9px] font-medium text-[#999999] uppercase">
                    {res.language === 'both' ? 'EN/VI' : res.language.toUpperCase()}
                  </span>
                )}
                {res.note && (
                  <span className="text-[10px] text-[#999999] truncate">
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

// ─── Main Screen ─────────────────────────────────────────────

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
  const currentYear = userContext?.current_year || 1;

  // Count total years available
  const yearEntries = Object.entries(years)
    .sort(([a], [b]) => a.localeCompare(b));
  const totalYears = yearEntries.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-momo-soft via-white to-white">
      {/* Top accent */}
      <div className="w-full h-2 bg-gradient-to-r from-momo via-momo-light to-momo-warning" />

      <div className="max-w-2xl mx-auto px-5 py-10 space-y-6">
        {/* Logo */}
        <h2 className="text-[32px] font-bold text-momo text-center tracking-tight">
          GenPath 💗
        </h2>

        {/* 1. Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-[28px] font-bold text-[#1A1A1A] leading-tight">
            {breed_name || 'Your Breed'}
            {major ? ` × ${major}` : ''}
          </h1>
          <p className="text-momo font-medium mt-1">
            Lộ trình {totalYears} năm
          </p>
          {career_cluster && (
            <p className="text-sm text-[#999999] mt-2">
              {career_cluster}
            </p>
          )}
        </div>

        {/* 2. Quick Wins */}
        <QuickWinsSection quickWins={quick_wins} />

        {/* 3. Timeline View */}
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-5">
            Lộ trình theo năm
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
        </div>

        {/* 4. Resources Panel */}
        <ResourcesPanel years={years} />

        {/* 5. CTA */}
        <div className="pt-4 pb-8">
          <button
            onClick={() => navigate('/result')}
            className="w-full bg-white hover:bg-[#F8F8F8] text-momo font-semibold py-4 px-8 rounded-2xl border-2 border-momo-soft hover:border-momo-light/50 shadow-[0_2px_8px_rgba(165,0,100,0.08)] transition-all active:scale-95 cursor-pointer"
          >
            &larr; Quay lại kết quả
          </button>
        </div>
      </div>
    </div>
  );
}

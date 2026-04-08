import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';

/* ── helpers ── */
function formatSalary(trieu) {
  if (!trieu) return '—';
  return `${trieu}tr`;
}

function threatColor(threat) {
  if (!threat) return 'text-[#999999]';
  if (threat.startsWith('low')) return 'text-momo-success';
  if (threat.startsWith('medium')) return 'text-momo-warning';
  return 'text-momo-error';
}

function threatLabel(detail) {
  return detail.ai_threat_label || detail.ai_threat || '—';
}

function scoreToTen(score) {
  return Math.round((score / 100) * 10 * 10) / 10;
}

function timingAdvice(yearsLeft) {
  if (yearsLeft >= 3) {
    return {
      icon: '🟢',
      title: 'Bạn còn nhiều thời gian!',
      text: 'Tập trung xây nền tảng kỹ năng, thực tập sớm để khám phá, và xây dựng portfolio từ bây giờ.',
      bg: 'bg-green-50 border-green-200',
      textColor: 'text-green-800',
    };
  }
  if (yearsLeft >= 1) {
    return {
      icon: '🟡',
      title: 'Thời điểm hành động!',
      text: 'Ưu tiên thực tập, networking, và hoàn thiện CV. Tập trung vào 1-2 ngành phù hợp nhất thay vì dàn trải.',
      bg: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800',
    };
  }
  return {
    icon: '🔴',
    title: 'Sắp ra trường — tập trung cao độ!',
    text: 'Apply ngay các vị trí phù hợp, chuẩn bị phỏng vấn, và leverage mọi kết nối bạn có. Đừng chờ "sẵn sàng" — hãy bắt đầu ngay.',
    bg: 'bg-red-50 border-red-200',
    textColor: 'text-red-800',
  };
}

/* ── Animated bar ── */
function Bar({ value, max, color, label }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.width = `${(value / max) * 100}%`;
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, max]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#666666] w-20 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          ref={ref}
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: '0%' }}
        />
      </div>
      <span className="text-xs font-semibold text-[#1A1A1A] w-10">{value}/{max}</span>
    </div>
  );
}

/* ── Main component ── */
export default function ForecastScreen() {
  const navigate = useNavigate();
  const forecastResult = useGameStore((s) => s.forecastResult);
  const quizResult = useGameStore((s) => s.quizResult);
  const userContext = useGameStore((s) => s.userContext);

  useEffect(() => {
    if (!forecastResult || !quizResult) {
      navigate('/');
    }
  }, [forecastResult, quizResult, navigate]);

  if (!forecastResult || !quizResult) return null;

  const { top_roles, hot_roles, avoid_roles, industries_detail } = forecastResult;
  const gradYear = userContext.graduation_year || 2027;
  const currentYear = 2026;
  const yearsLeft = Math.max(0, gradYear - currentYear);
  const breedName = quizResult.primary?.name || 'Chưa xác định';
  const major = userContext.major || '';

  const primaryIndustry = industries_detail.find((d) => d.isPrimary);
  const avgSalary = primaryIndustry?.summary_salary || '—';
  const avgForecast = primaryIndustry ? scoreToTen(primaryIndustry.forecast_score) : '—';
  const aiThreat = primaryIndustry ? threatLabel(primaryIndustry) : '—';

  const displayRoles = top_roles.slice(0, 3);
  const shouldPursue = hot_roles.filter((_, i) => i < 6);
  const shouldAvoid = avoid_roles.filter((_, i) => i < 6);
  const timing = timingAdvice(yearsLeft);

  return (
    <div className="min-h-screen bg-gradient-to-b from-momo-soft via-white to-white">
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">

        {/* ═══ Section 1: Hero / Overview ═══ */}
        <div className="text-center space-y-3 animate-fade-in">
          {/* Logo */}
          <h2 className="text-[32px] font-bold text-momo tracking-tight">
            GenPath 💗
          </h2>
          <div className="text-5xl">📊</div>
          <h1 className="text-2xl md:text-[28px] font-bold text-[#1A1A1A]">
            Dự báo thị trường
          </h1>
          <p className="text-[#666666]">
            Ra trường năm <span className="font-semibold text-[#1A1A1A]">{gradYear}</span>
            {major && <> &middot; Ngành <span className="font-semibold text-[#1A1A1A]">{major}</span></>}
          </p>
          <p className="text-sm text-momo font-medium">
            Giống mèo: {breedName}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-[0_4px_16px_rgba(165,0,100,0.12)]">
            <p className="text-2xl font-bold text-[#1A1A1A]">{avgSalary}</p>
            <p className="text-xs text-[#999999] mt-1">Lương trung bình</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-[0_4px_16px_rgba(165,0,100,0.12)]">
            <p className="text-2xl font-bold text-momo-info">{avgForecast}/10</p>
            <p className="text-xs text-[#999999] mt-1">Triển vọng</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-[0_4px_16px_rgba(165,0,100,0.12)]">
            <p className={`text-2xl font-bold ${primaryIndustry ? threatColor(primaryIndustry.ai_threat) : 'text-[#999999]'}`}>
              {aiThreat}
            </p>
            <p className="text-xs text-[#999999] mt-1">Rủi ro AI</p>
          </div>
        </div>

        {/* ═══ Section 2: Top Roles ═══ */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            Top nghề nghiệp phù hợp
          </h2>

          {displayRoles.map((role, i) => {
            const score10 = scoreToTen(role.forecast_score);
            const salary = role.salary_verified?.value;
            const demand = Math.min(10, Math.round(score10 * 1.05));
            const competition = Math.max(2, 10 - Math.round(score10 * 0.6));
            const aiSafety = Math.min(10, Math.round(score10 * 0.9));

            return (
              <div
                key={`${role.role}-${i}`}
                className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_16px_rgba(165,0,100,0.12)] p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {i === 0 && <span className="text-xs bg-momo-soft text-momo px-2 py-0.5 rounded-full font-medium">#1 Phù hợp nhất</span>}
                      {role.isPrimary && i !== 0 && <span className="text-xs bg-blue-50 text-momo-info px-2 py-0.5 rounded-full font-medium">Ngành chính</span>}
                      {!role.isPrimary && <span className="text-xs bg-gray-100 text-[#999999] px-2 py-0.5 rounded-full font-medium">Ngành phụ</span>}
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">{role.role}</h3>
                    <p className="text-sm text-[#666666]">{role.industry}</p>
                  </div>
                  {salary && (
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-momo-success">{formatSalary(salary)}</p>
                      <p className="text-[10px] text-[#999999]">
                        {role.salary_verified?.company || 'verified'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Bar value={demand} max={10} color="bg-momo-info" label="Nhu cầu" />
                  <Bar value={competition} max={10} color="bg-momo-warning" label="Cạnh tranh" />
                  <Bar value={aiSafety} max={10} color="bg-momo-success" label="An toàn AI" />
                </div>

                <p className="text-xs text-[#999999]">
                  Điểm triển vọng: {score10}/10
                </p>
              </div>
            );
          })}

          {displayRoles.length === 0 && (
            <p className="text-[#999999] text-center py-6">Chưa có dữ liệu nghề nghiệp.</p>
          )}
        </div>

        {/* ═══ Section 3: Should / Shouldn't ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
            <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
              <span>✅</span> Nên theo đuổi
            </h3>
            {shouldPursue.length > 0 ? (
              <ul className="space-y-2">
                {shouldPursue.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-momo-success mt-0.5 shrink-0">&#x2022;</span>
                    <div>
                      <p className="text-sm font-medium text-green-900">{r.role}</p>
                      <p className="text-xs text-green-600">{r.industry}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-600">Chưa có dữ liệu</p>
            )}
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
            <h3 className="text-base font-bold text-red-800 mb-3 flex items-center gap-2">
              <span>⚠️</span> Cần cân nhắc
            </h3>
            {shouldAvoid.length > 0 ? (
              <ul className="space-y-2">
                {shouldAvoid.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-momo-error mt-0.5 shrink-0">&#x2022;</span>
                    <div>
                      <p className="text-sm font-medium text-red-900">{r.role}</p>
                      <p className="text-xs text-red-500">{r.industry} &mdash; {r.reason}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-500">Không có cảnh báo</p>
            )}
          </div>
        </div>

        {/* ═══ Section 4: Timing Advice ═══ */}
        <div
          className={`rounded-2xl border p-5 ${timing.bg} animate-fade-in`}
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{timing.icon}</span>
            <div>
              <h3 className={`font-bold ${timing.textColor}`}>{timing.title}</h3>
              <p className={`text-sm mt-1 ${timing.textColor} opacity-80`}>
                Còn {yearsLeft > 0 ? `${yearsLeft} năm` : 'dưới 1 năm'} trước khi ra trường.
              </p>
              <p className={`text-sm mt-2 ${timing.textColor}`}>{timing.text}</p>
            </div>
          </div>
        </div>

        {/* ═══ CTA Buttons ═══ */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => navigate('/result')}
            className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-200 text-[#1A1A1A] font-medium hover:border-gray-300 hover:bg-[#F8F8F8] transition-all cursor-pointer"
          >
            &larr; Xem lại kết quả
          </button>
          <button
            onClick={() => navigate('/roadmap')}
            className="flex-1 px-8 py-4 rounded-2xl bg-momo hover:bg-momo-light text-white font-semibold shadow-[0_4px_16px_rgba(165,0,100,0.12)] hover:shadow-[0_8px_32px_rgba(165,0,100,0.16)] transition-all active:scale-[0.98] cursor-pointer"
          >
            Xem lộ trình kỹ năng &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import useGameStore from '../store/gameStore';

/* ── helpers ── */
function formatSalary(trieu) {
  if (!trieu) return '—';
  return `${trieu}tr`;
}

function threatColor(threat) {
  if (!threat) return 'text-gray-500';
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
      bg: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-800',
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

/* ── Section wrapper with useInView ── */
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

/* ── Animated bar ── */
function Bar({ value, max, color, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-xs font-semibold text-gray-600 w-20 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${(value / max) * 100}%` } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-bold text-[#1A1A1A] w-10">{value}/{max}</span>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ emoji, value, label, valueColor = 'text-[#1A1A1A]' }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-momo-soft shadow-[0_4px_20px_rgba(165,0,100,0.08)] p-5 text-center">
      <span className="text-3xl block mb-2">{emoji}</span>
      <p className={`text-2xl md:text-3xl font-extrabold ${valueColor} tracking-tight`}>{value}</p>
      <p className="text-xs font-semibold text-gray-500 mt-1">{label}</p>
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
    <div className="min-h-screen bg-gradient-to-b from-momo-soft via-white to-white font-sans antialiased">
      <div className="w-full h-1.5 bg-gradient-to-r from-momo via-momo-light to-momo-warning" />

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">

        {/* ═══ Section 1: Hero ═══ */}
        <Section>
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-momo tracking-tight">
              StudentPath 🎓
            </h2>
            <span className="text-5xl block">📊</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Dự báo thị trường
            </h1>
            <p className="text-base font-medium text-gray-600">
              Ra trường năm <span className="font-bold text-[#1A1A1A]">{gradYear}</span>
              {major && <> &middot; Ngành <span className="font-bold text-[#1A1A1A]">{major}</span></>}
            </p>
            <p className="text-sm font-semibold text-momo">
              Giống mèo: {breedName}
            </p>
          </div>
        </Section>

        {/* Stat cards */}
        <Section delay={0.1}>
          <div className="grid grid-cols-3 gap-3">
            <StatCard emoji="💰" value={avgSalary} label="Lương trung bình" />
            <StatCard emoji="📈" value={`${avgForecast}/10`} label="Triển vọng" valueColor="text-momo-info" />
            <StatCard
              emoji="🤖"
              value={aiThreat}
              label="Rủi ro AI"
              valueColor={primaryIndustry ? threatColor(primaryIndustry.ai_threat) : 'text-gray-500'}
            />
          </div>
        </Section>

        {/* ═══ Section 2: Top Roles ═══ */}
        <Section delay={0.1}>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] mb-4 tracking-tight">
            🏆 Top nghề nghiệp phù hợp
          </h2>

          <div className="space-y-4">
            {displayRoles.map((role, i) => {
              const score10 = scoreToTen(role.forecast_score);
              const salary = role.salary_verified?.value;
              const demand = Math.min(10, Math.round(score10 * 1.05));
              const competition = Math.max(2, 10 - Math.round(score10 * 0.6));
              const aiSafety = Math.min(10, Math.round(score10 * 0.9));

              return (
                <div
                  key={`${role.role}-${i}`}
                  className="bg-white rounded-2xl border-2 border-momo-soft shadow-[0_4px_20px_rgba(165,0,100,0.08)] p-5 md:p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        {i === 0 && <span className="text-xs font-bold bg-momo text-white px-2.5 py-1 rounded-full">#1 Phù hợp nhất</span>}
                        {role.isPrimary && i !== 0 && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">Ngành chính</span>}
                        {!role.isPrimary && <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Ngành phụ</span>}
                      </div>
                      <h3 className="text-lg font-bold text-[#1A1A1A]">{role.role}</h3>
                      <p className="text-sm font-medium text-gray-600">{role.industry}</p>
                    </div>
                    {salary && (
                      <div className="text-right shrink-0">
                        <p className="text-xl font-extrabold text-momo-success">{formatSalary(salary)}</p>
                        <p className="text-[10px] font-medium text-gray-500">
                          {role.salary_verified?.company || 'verified'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Bar value={demand} max={10} color="bg-gradient-to-r from-momo-info to-[#90CAF9]" label="Nhu cầu" />
                    <Bar value={competition} max={10} color="bg-gradient-to-r from-momo-warning to-[#FFCC80]" label="Cạnh tranh" />
                    <Bar value={aiSafety} max={10} color="bg-gradient-to-r from-momo-success to-[#80E8C8]" label="An toàn AI" />
                  </div>

                  <p className="text-xs font-semibold text-gray-500">
                    Điểm triển vọng: {score10}/10
                  </p>
                </div>
              );
            })}

            {displayRoles.length === 0 && (
              <div className="text-center py-12">
                <span className="text-5xl block mb-3">📭</span>
                <p className="text-gray-500 font-medium">Chưa có dữ liệu nghề nghiệp.</p>
              </div>
            )}
          </div>
        </Section>

        {/* ═══ Section 3: Should / Shouldn't ═══ */}
        <Section delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-5 md:p-6">
              <h3 className="text-base font-extrabold text-green-800 mb-4 flex items-center gap-2">
                ✅ Nên theo đuổi
              </h3>
              {shouldPursue.length > 0 ? (
                <div className="space-y-2.5">
                  {shouldPursue.map((r, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-momo-success mt-0.5 shrink-0">&#x2022;</span>
                      <div>
                        <p className="text-sm font-bold text-green-900">{r.role}</p>
                        <p className="text-xs font-medium text-green-600">{r.industry}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-green-600">Chưa có dữ liệu</p>
              )}
            </div>

            <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-5 md:p-6">
              <h3 className="text-base font-extrabold text-red-800 mb-4 flex items-center gap-2">
                ⚠️ Cần cân nhắc
              </h3>
              {shouldAvoid.length > 0 ? (
                <div className="space-y-2.5">
                  {shouldAvoid.map((r, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-momo-error mt-0.5 shrink-0">&#x2022;</span>
                      <div>
                        <p className="text-sm font-bold text-red-900">{r.role}</p>
                        <p className="text-xs font-medium text-red-500">{r.industry} &mdash; {r.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-red-500">Không có cảnh báo</p>
              )}
            </div>
          </div>
        </Section>

        {/* ═══ Section 4: Timing Advice ═══ */}
        <Section delay={0.1}>
          <div className={`rounded-2xl border-2 p-5 md:p-6 ${timing.bg}`}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">{timing.icon}</span>
              <div>
                <h3 className={`font-extrabold text-lg ${timing.textColor}`}>{timing.title}</h3>
                <p className={`text-sm font-semibold mt-1 ${timing.textColor} opacity-80`}>
                  Còn {yearsLeft > 0 ? `${yearsLeft} năm` : 'dưới 1 năm'} trước khi ra trường.
                </p>
                <p className={`text-sm font-medium mt-2 ${timing.textColor}`}>{timing.text}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══ CTA Buttons ═══ */}
        <Section delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <motion.button
              onClick={() => navigate('/result')}
              className="flex-1 px-8 py-4 rounded-full border-2 border-gray-200 text-[#1A1A1A] font-bold hover:border-gray-300 hover:bg-[#F8F8F8] transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Xem lại kết quả"
            >
              &larr; Xem lại kết quả
            </motion.button>
            <motion.button
              onClick={() => navigate('/roadmap')}
              className="flex-1 px-8 py-4 rounded-full bg-momo hover:bg-momo-light text-white font-bold shadow-[0_0_24px_rgba(216,45,139,0.3)] hover:shadow-[0_0_32px_rgba(216,45,139,0.4)] transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Xem lộ trình kỹ năng"
            >
              Xem lộ trình kỹ năng &rarr;
            </motion.button>
          </div>
        </Section>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';

const AI_BADGE = {
  low: { label: 'Thấp', color: 'bg-green-100 text-green-800' },
  low_medium: { label: 'Thấp-TB', color: 'bg-green-100 text-green-700' },
  medium: { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  medium_high: { label: 'TB-Cao', color: 'bg-orange-100 text-orange-800' },
  high: { label: 'Cao', color: 'bg-red-100 text-red-800' },
  high_routine_low_advisory: { label: 'Cao (routine)', color: 'bg-red-100 text-red-700' },
  high_transactional: { label: 'Cao (giao dịch)', color: 'bg-red-100 text-red-700' },
  high_warehouse_medium_planning: { label: 'Cao (kho)/TB', color: 'bg-orange-100 text-orange-700' },
};

function AiRiskBadge({ threat }) {
  const badge = AI_BADGE[threat] || { label: threat, color: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
      AI: {badge.label}
    </span>
  );
}

function SalaryTag({ salary }) {
  if (!salary) return <span className="text-xs text-gray-400 italic">Chưa verified</span>;
  return (
    <span className="text-sm font-semibold text-purple-700">
      {salary.value}tr <span className="text-xs font-normal text-gray-500">({salary.company})</span>
    </span>
  );
}

function getTimingAdvice(graduationYear) {
  if (!graduationYear) return null;
  const now = new Date().getFullYear();
  const yearsLeft = graduationYear - now;
  if (yearsLeft <= 0) return 'Ra trường rồi — nên apply ngay, ưu tiên hot roles.';
  if (yearsLeft === 1) return 'Còn ~1 năm — tập trung internship + chứng chỉ ngay bây giờ.';
  if (yearsLeft === 2) return 'Còn ~2 năm — build skills + portfolio, intern từ năm sau.';
  return `Còn ~${yearsLeft} năm — khám phá rộng, xây nền tảng vững.`;
}

export default function ForecastScreen() {
  const navigate = useNavigate();
  const forecastResult = useGameStore((s) => s.forecastResult);
  const userContext = useGameStore((s) => s.userContext);
  const [expandedIndustry, setExpandedIndustry] = useState(null);

  useEffect(() => {
    if (!forecastResult) {
      navigate('/');
    }
  }, [forecastResult, navigate]);

  if (!forecastResult) return null;

  const forecast = forecastResult;
  const graduationYear = userContext?.graduation_year;
  const timing = getTimingAdvice(graduationYear);
  const topRoles = forecast.top_roles.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dự Báo Thị Trường
          </h1>
          <p className="text-gray-500">Ngành nghề phù hợp với profile của bạn</p>
        </div>

        {/* Market Summary */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">
            Tổng quan thị trường
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm">
            {forecast.market_summary}
          </p>
        </div>

        {/* Timing Advice */}
        {timing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <span className="text-xl mt-0.5">&#9200;</span>
            <div>
              <p className="text-sm font-medium text-blue-800">Timing cho bạn</p>
              <p className="text-sm text-blue-700">{timing}</p>
            </div>
          </div>
        )}

        {/* Top 3 Roles Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Roles</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Salary</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">AI Risk</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Score</th>
                </tr>
              </thead>
              <tbody>
                {topRoles.map((role, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-purple-600">{i + 1}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">{role.role}</p>
                      <p className="text-xs text-gray-500">{role.industry}</p>
                    </td>
                    <td className="px-5 py-4">
                      <SalaryTag salary={role.salary_verified} />
                    </td>
                    <td className="px-5 py-4">
                      <AiRiskBadge threat={
                        forecast.industries_detail.find(ind => ind.name === role.industry)?.ai_threat || 'medium'
                      } />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-gray-800">{role.forecast_score}</span>
                      <span className="text-xs text-gray-400">/100</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hot vs Avoid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Hot Roles */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3">
              Hot Roles
            </h3>
            <ul className="space-y-2">
              {forecast.hot_roles.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 text-sm">&#9650;</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.role}</p>
                    <p className="text-xs text-gray-500">{r.industry}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Avoid Roles */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-3">
              Avoid / Declining
            </h3>
            <ul className="space-y-2">
              {forecast.avoid_roles.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 text-sm">&#9660;</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.role}</p>
                    <p className="text-xs text-gray-500">{r.industry}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Industry Detail Expandable */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi Tiet Nganh</h2>
          <div className="space-y-3">
            {forecast.industries_detail.map((ind) => (
              <div
                key={ind.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedIndustry(expandedIndustry === ind.id ? null : ind.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${ind.isPrimary ? 'bg-purple-500' : 'bg-gray-300'}`} />
                    <span className="text-sm font-medium text-gray-900">{ind.name}</span>
                    {ind.no_verified_data && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Chua co verified salary
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <AiRiskBadge threat={ind.ai_threat} />
                    <span className="text-xs text-gray-400">
                      {expandedIndustry === ind.id ? '&#9650;' : '&#9660;'}
                    </span>
                  </div>
                </button>

                {expandedIndustry === ind.id && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500 mb-3">
                      Salary range: <span className="font-medium text-gray-700">{ind.summary_salary}</span>
                    </p>
                    {ind.verified_salaries.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-600 mb-1">Verified salaries:</p>
                        <div className="flex flex-wrap gap-2">
                          {ind.verified_salaries.map((v, i) => (
                            <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg">
                              {v.role}: {v.salary_trieu}tr ({v.company})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-green-700 mb-1">Growing:</p>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {ind.roles_growing.slice(0, 4).map((r, i) => (
                            <li key={i}>+ {r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-red-700 mb-1">Declining:</p>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {ind.roles_declining.slice(0, 4).map((r, i) => (
                            <li key={i}>- {r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/roadmap')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-full transition-colors shadow-lg shadow-purple-200"
          >
            Xem Roadmap &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

import marketData from '../data/market_data.json';

const breedMap = marketData.breed_to_industry_map;
const industries = marketData.industries;
const verifiedRoles = marketData.verified_salary_roles.roles;

// Map industry id → verified salary roles from verified_salary_roles
const INDUSTRY_TO_VERIFIED_CATEGORY = {
  technology: 'Tech / Software / AI',
  marketing: 'Marketing / Brand',
  finance: 'Finance / Fintech',
  design: 'Design / Creative',
  hr: 'HR / Talent',
  sales: 'Sales / BizDev',
  operations: 'Ops / Supply Chain',
  consulting: null, // No verified data
};

/**
 * Get verified salary roles for an industry id.
 */
function getVerifiedSalaries(industryId) {
  const category = INDUSTRY_TO_VERIFIED_CATEGORY[industryId];
  if (!category) return [];
  return verifiedRoles.filter(r => r.industry === category);
}

/**
 * Classify a role as hot, top, or avoid based on industry data.
 */
function classifyRoles(industry) {
  const hot = (industry.roles_growing || []).slice(0, 3);
  const avoid = (industry.roles_declining || []);
  const top = (industry.roles_growing || []).slice(0, 5);
  return { hot, avoid, top };
}

/**
 * Build a forecast_score heuristic for an industry.
 * Higher = better outlook. Based on ai_threat + demand signals.
 */
function computeForecastScore(industry) {
  const threatScores = {
    low: 90,
    low_medium: 80,
    medium: 60,
    medium_high: 45,
    high: 30,
    high_routine_low_advisory: 50,
    high_transactional: 40,
    high_warehouse_medium_planning: 50,
  };

  const baseScore = threatScores[industry.ai_threat] ?? 50;

  // Bonus for demand signal
  let demandBonus = 0;
  if (industry.vietnam_demand_topcv) {
    const pct = parseFloat(industry.vietnam_demand_topcv);
    if (!isNaN(pct)) {
      demandBonus = Math.min(pct, 20);
    }
  }

  return Math.round(baseScore + demandBonus);
}

/**
 * Generate market summary string from industry data.
 */
function buildSummary(industryId, industry, verified, isPrimary) {
  const tier = isPrimary ? 'ngành phù hợp chính' : 'ngành phụ';
  const threat = industry.ai_threat_label || industry.ai_threat;
  const salaryNote = verified.length > 0
    ? `Lương verified: ${verified.map(r => `${r.role} ${r.salary_trieu}tr (${r.company})`).join(', ')}`
    : '⚠️ Chưa có verified salary data từ job postings — chỉ có range ước lượng từ PDF';

  return `${industry.name_vi} — ${tier}. AI threat: ${threat}. ${salaryNote}.`;
}

/**
 * Generate a full forecast report for a breed.
 *
 * @param {string} breedId - One of: tabby, siamese, bengal, persian, mainecoon, ragdoll, munchkin
 * @param {Object} userContext - Optional { experience_level?: 'entry'|'mid'|'senior' }
 * @returns {{ top_roles, hot_roles, avoid_roles, market_summary, industries_detail }}
 */
export function generateForecast(breedId, userContext = {}) {
  const mapping = breedMap[breedId];
  if (!mapping) {
    return {
      top_roles: [],
      hot_roles: [],
      avoid_roles: [],
      market_summary: `Không tìm thấy breed "${breedId}" trong breed_to_industry_map.`,
      industries_detail: [],
    };
  }

  const allIndustryIds = [
    ...mapping.primary.map(id => ({ id, isPrimary: true })),
    ...mapping.secondary.map(id => ({ id, isPrimary: false })),
  ];

  const top_roles = [];
  const hot_roles = [];
  const avoid_roles = [];
  const summaries = [];
  const industries_detail = [];

  for (const { id: industryId, isPrimary } of allIndustryIds) {
    const industry = industries[industryId];
    if (!industry) continue;

    const verified = getVerifiedSalaries(industryId);
    const classified = classifyRoles(industry);
    const forecastScore = computeForecastScore(industry);
    const summary = buildSummary(industryId, industry, verified, isPrimary);

    // Collect roles with salary info attached
    for (const role of classified.top) {
      const salaryMatch = verified.find(v =>
        role.toLowerCase().includes(v.role.toLowerCase().split(' ')[0])
      );
      top_roles.push({
        role,
        industry: industry.name_vi,
        isPrimary,
        salary_verified: salaryMatch
          ? { value: salaryMatch.salary_trieu, unit: 'M_VND', company: salaryMatch.company }
          : null,
        forecast_score: forecastScore,
      });
    }

    for (const role of classified.hot) {
      hot_roles.push({
        role,
        industry: industry.name_vi,
        ai_threat: industry.ai_threat,
      });
    }

    for (const role of classified.avoid) {
      avoid_roles.push({
        role,
        industry: industry.name_vi,
        reason: 'declining/automated',
      });
    }

    summaries.push(summary);

    industries_detail.push({
      id: industryId,
      name: industry.name_vi,
      isPrimary,
      ai_threat: industry.ai_threat,
      ai_threat_label: industry.ai_threat_label,
      forecast_score: forecastScore,
      verified_salaries: verified,
      no_verified_data: verified.length === 0,
      roles_growing: industry.roles_growing || [],
      roles_declining: industry.roles_declining || [],
      summary_salary: industry.summary_salary_mid,
    });
  }

  // Sort top_roles: primary industries first, then by forecast_score
  top_roles.sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return b.forecast_score - a.forecast_score;
  });

  const market_summary = summaries.join(' | ');

  return {
    top_roles,
    hot_roles,
    avoid_roles,
    market_summary,
    industries_detail,
  };
}

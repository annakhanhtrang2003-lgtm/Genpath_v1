import roadmapData from '../data/roadmap_template.json';

const templates = roadmapData.roadmap_templates;
const curatedResources = roadmapData.curated_resources;

// Build a flat lookup: resource id → resource object
const resourceMap = {};
for (const tier of ['free', 'paid']) {
  for (const res of curatedResources[tier]) {
    resourceMap[res.id] = res;
  }
}

const CATEGORY_WEIGHTS = { core: 4, tool: 3, power: 2, soft: 1 };
const MAX_P1_PER_PHASE = 3;

// Year key order for phase mapping
const YEAR_KEYS = ['year_1', 'year_2', 'year_3', 'year_4'];

/**
 * Normalize year keys from template (e.g. "year_1_discover" → "year_1").
 */
function normalizeYearKey(rawKey) {
  const match = rawKey.match(/^(year_\d)/);
  return match ? match[1] : rawKey;
}

/**
 * Sort tasks using the 4-step priority logic from JSON spec.
 * 1. priority ascending
 * 2. time_estimate_weeks ascending (use time_weeks from JSON)
 * 3. is_quick_win = true first
 * 4. category weight descending (core > tool > power > soft)
 */
function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    const aTime = a.time_weeks ?? 0;
    const bTime = b.time_weeks ?? 0;
    if (aTime !== bTime) return aTime - bTime;
    if (a.is_quick_win !== b.is_quick_win) return a.is_quick_win ? -1 : 1;
    return (CATEGORY_WEIGHTS[b.category] || 0) - (CATEGORY_WEIGHTS[a.category] || 0);
  });
}

/**
 * Enforce max 3 priority-1 tasks per year.
 * Demote the ones with highest time_weeks to priority 2.
 */
function enforceMaxPriority(tasks) {
  const p1 = tasks
    .filter(t => t.priority === 1)
    .sort((a, b) => (b.time_weeks ?? 0) - (a.time_weeks ?? 0));

  while (p1.length > MAX_P1_PER_PHASE) {
    const demoted = p1.shift();
    demoted.priority = 2;
    demoted.priority_note = 'Auto-demoted: quá nhiều P1 trong phase';
  }

  return tasks;
}

/**
 * Map resource IDs in a task to full resource objects from curated_resources.
 * Only returns resources that exist in the curated list.
 */
function resolveResources(resourceIds) {
  return (resourceIds || [])
    .map(id => resourceMap[id])
    .filter(Boolean);
}

/**
 * Generate a full roadmap package for a breed.
 *
 * @param {string} breedId - One of: tabby, siamese, bengal, persian, mainecoon, ragdoll, munchkin
 * @param {Object} userContext - { current_year?: 1|2|3|4 }
 * @returns {Object} roadmapPackage
 */
export function generateRoadmap(breedId, userContext = {}) {
  const template = templates[breedId];
  if (!template) {
    return {
      breed_id: breedId,
      breed_name: null,
      tagline: null,
      current_phase: null,
      years: {},
      quick_wins: [],
      career_cluster: null,
      error: `Breed "${breedId}" not found in roadmap_templates.`,
    };
  }

  const currentYear = userContext.current_year || 1;
  const currentPhase = `year_${currentYear}`;

  const years = {};

  for (const [rawKey, yearData] of Object.entries(template.years)) {
    const normalizedKey = normalizeYearKey(rawKey);
    const yearNum = parseInt(normalizedKey.replace('year_', ''), 10);

    // Deep-clone tasks so we don't mutate the imported JSON
    let tasks = yearData.tasks.map(t => ({
      ...t,
      resources_resolved: resolveResources(t.resources),
    }));

    // Enforce max P1 before sorting
    tasks = enforceMaxPriority(tasks);
    tasks = sortTasks(tasks);

    // Determine phase status relative to current year
    let status;
    if (yearNum < currentYear) {
      status = 'past';
    } else if (yearNum === currentYear) {
      status = 'current';
    } else {
      status = 'future';
    }

    years[normalizedKey] = {
      label: yearData.label,
      status,
      tasks,
    };
  }

  const quick_wins = (template.quick_wins_month_1 || []).map(qw => ({ ...qw }));

  return {
    breed_id: template.breed_id,
    breed_name: template.breed_name,
    tagline: template.tagline,
    current_phase: currentPhase,
    years,
    quick_wins,
    career_cluster: template.career_cluster,
  };
}

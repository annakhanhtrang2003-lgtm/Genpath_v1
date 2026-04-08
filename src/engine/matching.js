/**
 * Breed matching engine.
 *
 * 7 breed profiles hardcoded from design doc.
 * matchBreed() implements the 6-step algorithm.
 */

const BREED_PROFILES = {
  tabby: {
    name: 'Tabby',
    layerA: { A2: 'high', A5: 'high' },
    layerB: ['BUILD'],
    layerC: ['Systems', 'Numerical'],
  },
  siamese: {
    name: 'Siamese',
    layerA: { A1: 'high', A3: 'high' },
    layerB: ['CONNECT'],
    layerC: ['Interpersonal', 'Verbal'],
  },
  bengal: {
    name: 'Bengal',
    layerA: { A2: 'high', A4: 'high' },
    layerB: ['SOLVE'],
    layerC: ['Numerical', 'Systems'],
  },
  persian: {
    name: 'Persian',
    layerA: { A1: 'low', A4: 'low' },
    layerB: ['CREATE'],
    layerC: ['VisualCreative', 'Verbal'],
  },
  mainecoon: {
    name: 'Maine Coon',
    layerA: { A1: 'high', A4: 'high', A5: 'high' },
    layerB: ['BUILD', 'EXPRESS'],
    layerC: ['Systems', 'Interpersonal'],
  },
  ragdoll: {
    name: 'Ragdoll',
    layerA: { A3: 'very_high', A1: 'low' },
    layerC: ['Interpersonal', 'Verbal'],
    layerB: ['CONNECT'],
  },
  munchkin: {
    name: 'Munchkin',
    layerA: { A5: 'low', A4: 'high' },
    layerB: ['CREATE'],
    layerC: ['VisualCreative', 'Systems'],
  },
};

// Weights for composite score
const WEIGHT_A = 0.40;
const WEIGHT_B = 0.35;
const WEIGHT_C = 0.25;

/**
 * Step 1: Score Layer A match.
 * For each breed axis preference, measure how well normalizedA aligns.
 * 'high' = want >50, 'low' = want <50, 'very_high' = want >>50 (stronger signal).
 */
function scoreLayerA(normalizedA, breedProfile) {
  const prefs = breedProfile.layerA;
  const axes = Object.keys(prefs);
  if (axes.length === 0) return 0;

  let totalScore = 0;

  for (const axis of axes) {
    const value = normalizedA[axis] ?? 50;
    const direction = prefs[axis];

    if (direction === 'high') {
      // 50→50: 0 points, 100→100: 100 points
      totalScore += Math.max(0, value - 50) * 2;
    } else if (direction === 'very_high') {
      // Stronger reward for extreme values
      totalScore += Math.max(0, value - 50) * 2.5;
    } else if (direction === 'low') {
      // 50→50: 0 points, 0→0: 100 points
      totalScore += Math.max(0, 50 - value) * 2;
    }
  }

  return totalScore / axes.length;
}

/**
 * Step 2-3: Score Layer B match.
 * Check if user's top drives overlap with breed's preferred drives.
 */
function scoreLayerB(rankedB, breedProfile) {
  const breedDrives = breedProfile.layerB;
  let score = 0;

  if (breedDrives.includes(rankedB.primary_drive)) {
    score += 100;
  }
  if (breedDrives.includes(rankedB.secondary_drive)) {
    score += 50;
  }

  // Max possible: 100 if single-drive breed, 150 if dual-drive breed
  const maxPossible = breedDrives.length === 1 ? 100 : 150;
  return (score / maxPossible) * 100;
}

/**
 * Step 3: Score Layer C match.
 * Check if user's aptitude levels align with breed's preferred aptitudes.
 */
function scoreLayerC(leveledC, breedProfile) {
  const breedAptitudes = breedProfile.layerC;
  if (breedAptitudes.length === 0) return 0;

  const levelValue = { High: 100, Mid: 50, Low: 10 };
  let totalScore = 0;

  for (const apt of breedAptitudes) {
    const level = leveledC[apt] || 'Low';
    totalScore += levelValue[level];
  }

  return totalScore / breedAptitudes.length;
}

/**
 * Match user profile against all 7 breeds.
 *
 * @param {Object} normalizedA - { A1: 0-100, ..., A5: 0-100 }
 * @param {Object} rankedB     - { primary_drive, secondary_drive }
 * @param {Object} leveledC    - { Verbal: 'High'|'Mid'|'Low', ... }
 * @param {string|null} tieBreakBoost - Q24 tie_breaker_boost value: 'CONNECT'|'BUILD'|'SOLVE' or null
 * @returns {{ primary: string, secondary: string, match_scores: Object }}
 */
export function matchBreed(normalizedA, rankedB, leveledC, tieBreakBoost = null) {
  // Step 4: Compute match scores for all 7 breeds
  const match_scores = {};

  for (const [breedId, profile] of Object.entries(BREED_PROFILES)) {
    const aScore = scoreLayerA(normalizedA, profile);
    const bScore = scoreLayerB(rankedB, profile);
    const cScore = scoreLayerC(leveledC, profile);

    match_scores[breedId] = Math.round(
      aScore * WEIGHT_A + bScore * WEIGHT_B + cScore * WEIGHT_C
    );
  }

  // Step 5: Sort by match score, take top 2
  const sorted = Object.entries(match_scores)
    .sort(([, a], [, b]) => b - a);

  let primary = sorted[0][0];
  let secondary = sorted[1][0];

  // Step 6: Tie-breaker — if top 2 within 5%, use Q24 boost
  if (tieBreakBoost) {
    const topScore = sorted[0][1];
    const secondScore = sorted[1][1];
    const gap = topScore > 0 ? ((topScore - secondScore) / topScore) * 100 : 0;

    if (gap < 5) {
      // Find which of top 2 has the boosted drive in their profile
      const primaryDrives = BREED_PROFILES[primary].layerB;
      const secondaryDrives = BREED_PROFILES[secondary].layerB;

      if (secondaryDrives.includes(tieBreakBoost) && !primaryDrives.includes(tieBreakBoost)) {
        [primary, secondary] = [secondary, primary];
      }
    }
  }

  return { primary, secondary, match_scores };
}

import scoringData from '../data/scoring_data.json';

const LAYER_A_KEYS = ['A1', 'A2', 'A3', 'A4', 'A5'];
const LAYER_B_KEYS = ['BUILD', 'CONNECT', 'SOLVE', 'CREATE', 'EXPRESS'];
const LAYER_C_KEYS = ['Verbal', 'Numerical', 'Systems', 'Interpersonal', 'VisualCreative'];

// Max possible raw per axis: strongest weight (3) × number of questions (24)
const MAX_POSSIBLE_RAW = 3 * 24;

/**
 * Return all 24 questions from scoring_data.json
 */
export function loadQuestions() {
  return scoringData.questions;
}

/**
 * Process a single answer: read weights from JSON, apply to currentScores.
 * Returns a new scores object (does not mutate currentScores).
 */
export function processAnswer(questionId, answerId, currentScores) {
  const question = scoringData.questions.find(q => q.id === questionId);
  if (!question) return { ...currentScores };

  const answer = question.answers.find(a => a.id === answerId);
  if (!answer) return { ...currentScores };

  const updatedScores = { ...currentScores };

  for (const [key, weight] of Object.entries(answer.scoring)) {
    updatedScores[key] = (updatedScores[key] || 0) + weight;
  }

  return updatedScores;
}

/**
 * Normalize Layer A raw scores to 0-100 scale.
 * Formula: normalized = 50 + (raw / max_possible_raw) × 50, clamped [0, 100]
 */
export function normalizeLayerA(rawScores) {
  const normalized = {};

  for (const key of LAYER_A_KEYS) {
    const raw = rawScores[key] || 0;
    const value = 50 + (raw / MAX_POSSIBLE_RAW) * 50;
    normalized[key] = Math.max(0, Math.min(100, Math.round(value)));
  }

  return normalized;
}

/**
 * Rank Layer B drives. Returns { primary_drive, secondary_drive }.
 */
export function rankLayerB(rawScores) {
  const drives = LAYER_B_KEYS
    .map(key => ({ key, score: rawScores[key] || 0 }))
    .sort((a, b) => b.score - a.score);

  return {
    primary_drive: drives[0].key,
    secondary_drive: drives[1].key,
  };
}

/**
 * Level Layer C aptitudes into 'High' | 'Mid' | 'Low'.
 */
export function levelLayerC(rawScores) {
  const aptitudes = LAYER_C_KEYS.map(key => ({
    key,
    score: rawScores[key] || 0,
  }));

  const scores = aptitudes.map(a => a.score);
  const maxScore = Math.max(...scores, 1);

  const levels = {};
  for (const { key, score } of aptitudes) {
    const ratio = score / maxScore;
    if (ratio >= 0.66) {
      levels[key] = 'High';
    } else if (ratio >= 0.33) {
      levels[key] = 'Mid';
    } else {
      levels[key] = 'Low';
    }
  }

  return levels;
}

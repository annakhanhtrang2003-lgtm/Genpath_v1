import scoringData from '../data/scoring_data.json';

/**
 * Get the branch destination for a branching question + answer.
 * Returns the branch object { id, name, affects_gate, description? }
 * or null if no branching exists for this question/answer.
 */
export function getBranch(questionId, answerId) {
  const questionMap = scoringData.branching_map[questionId];
  if (!questionMap) return null;

  const branch = questionMap[answerId];
  return branch || null;
}

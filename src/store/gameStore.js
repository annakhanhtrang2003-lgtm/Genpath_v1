import { create } from 'zustand';
import { processAnswer, normalizeLayerA, rankLayerB, levelLayerC } from '../engine/scoring';
import { getBranch } from '../engine/branching';
import { matchBreed } from '../engine/matching';
import { generateForecast } from '../engine/forecast';
import { generateRoadmap } from '../engine/roadmap';

const INITIAL_SCORES = {
  A1: 0, A2: 0, A3: 0, A4: 0, A5: 0,
  BUILD: 0, CONNECT: 0, SOLVE: 0, CREATE: 0, EXPRESS: 0,
  Verbal: 0, Numerical: 0, Systems: 0, Interpersonal: 0, VisualCreative: 0,
};

const useGameStore = create((set, get) => ({
  // User info
  userContext: {
    name: '',
    major: '',
    interests: [],
    current_year: null,
    graduation_year: null,
  },

  // Quiz state
  currentQuestion: 0,
  answers: [],
  rawScores: { ...INITIAL_SCORES },
  branchPath: [],
  tieBreakBoost: null,

  // Results
  quizResult: null,
  forecastResult: null,
  roadmapResult: null,

  // Actions
  setUserContext: (ctx) =>
    set((state) => ({
      userContext: { ...state.userContext, ...ctx },
    })),

  submitAnswer: (questionId, answerId, answerData) =>
    set((state) => {
      const newScores = processAnswer(questionId, answerId, state.rawScores);
      const branch = getBranch(questionId, answerId);
      const newBranchPath = branch
        ? [...state.branchPath, branch]
        : state.branchPath;
      const newTieBreak = answerData?.tie_breaker_boost || state.tieBreakBoost;

      return {
        rawScores: newScores,
        answers: [...state.answers, { questionId, answerId }],
        currentQuestion: state.currentQuestion + 1,
        branchPath: newBranchPath,
        tieBreakBoost: newTieBreak,
      };
    }),

  submitAnswerV2: (questionId, answerId, scoring) =>
    set((state) => {
      const updatedScores = { ...state.rawScores };
      for (const [key, weight] of Object.entries(scoring)) {
        updatedScores[key] = (updatedScores[key] || 0) + weight;
      }
      return {
        rawScores: updatedScores,
        answers: [...state.answers, { questionId, answerId }],
        currentQuestion: state.currentQuestion + 1,
      };
    }),

  calculateResult: () => {
    const { rawScores, userContext, tieBreakBoost } = get();

    const normalizedA = normalizeLayerA(rawScores);
    const rankedB = rankLayerB(rawScores);
    const leveledC = levelLayerC(rawScores);

    const quizResult = matchBreed(normalizedA, rankedB, leveledC, tieBreakBoost);
    const forecastResult = generateForecast(quizResult.primary, userContext);
    const roadmapResult = generateRoadmap(quizResult.primary, {
      current_year: userContext.current_year || 1,
    });

    set({ quizResult, forecastResult, roadmapResult });
  },

  resetQuiz: () =>
    set({
      currentQuestion: 0,
      answers: [],
      rawScores: { ...INITIAL_SCORES },
      branchPath: [],
      tieBreakBoost: null,
      quizResult: null,
      forecastResult: null,
      roadmapResult: null,
    }),
}));

export default useGameStore;

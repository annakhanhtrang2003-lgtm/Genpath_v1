import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';
import { loadQuestions } from '../engine/scoring';

const questions = loadQuestions();
const TOTAL = questions.length;

const DRIVE_LABELS = {
  BUILD: 'BUILD',
  CONNECT: 'CONNECT',
  SOLVE: 'SOLVE',
  CREATE: 'CREATE',
  EXPRESS: 'EXPRESS',
};

// ─── PersonalityPulse ────────────────────────────────────────
function PersonalityPulse({ rawScores, questionIndex }) {
  const thinking = rawScores.A2 ?? 0;
  const social = ((rawScores.A1 ?? 0) + (rawScores.A3 ?? 0)) / 2;
  const action = ((rawScores.A4 ?? 0) + (rawScores.A5 ?? 0)) / 2;

  // Normalize to 0-100 for display (raw can go negative on bipolar axes)
  // Use a soft max of ~20 raw points as "full bar"
  const norm = (v) => Math.max(0, Math.min(100, 50 + v * 2.5));

  const bars = [
    { label: 'Thinking', value: norm(thinking), color: 'bg-blue-500' },
    { label: 'Social', value: norm(social), color: 'bg-pink-500' },
    { label: 'Action', value: norm(action), color: 'bg-amber-500' },
  ];

  // After Q8, show the top Layer B drive
  const showSignal = questionIndex >= 8;
  let topDrive = null;
  if (showSignal) {
    const drives = Object.entries(DRIVE_LABELS)
      .map(([key, label]) => ({ key, label, score: rawScores[key] ?? 0 }))
      .sort((a, b) => b.score - a.score);
    if (drives[0].score > 0) {
      topDrive = drives[0].label;
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-6 px-2">
      <div className="space-y-2.5">
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500 w-16 text-right shrink-0">
              {bar.label}
            </span>
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${bar.color} transition-all duration-500 ease-out`}
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {topDrive && (
        <p className="text-center text-xs text-purple-600 font-medium mt-3 animate-pulse">
          {topDrive} dang dan...
        </p>
      )}
    </div>
  );
}

// ─── QuizScreen ──────────────────────────────────────────────
export default function QuizScreen() {
  const navigate = useNavigate();
  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const rawScores = useGameStore((s) => s.rawScores);
  const submitAnswer = useGameStore((s) => s.submitAnswer);
  const calculateResult = useGameStore((s) => s.calculateResult);

  const [animState, setAnimState] = useState('idle'); // 'idle' | 'selected' | 'sliding'
  const [selectedId, setSelectedId] = useState(null);

  const question = questions[currentQuestion];
  const isLast = currentQuestion >= TOTAL - 1;

  // Gate progress: which gates have which question ranges
  const gateInfo = useMemo(() => {
    if (!question) return null;
    const gateNum = question.gate;
    const gateName = question.gate_name;
    // Count questions in the same gate
    const gateQuestions = questions.filter((q) => q.gate === gateNum);
    const posInGate = gateQuestions.indexOf(question) + 1;
    const totalInGate = gateQuestions.length;
    return { gateNum, gateName, posInGate, totalInGate };
  }, [question]);

  // Navigate away if quiz is done (e.g. refresh after finishing)
  useEffect(() => {
    if (currentQuestion >= TOTAL) {
      navigate('/result');
    }
  }, [currentQuestion, navigate]);

  if (!question || !gateInfo) return null;

  const progress = ((currentQuestion) / TOTAL) * 100;

  function handleSelect(answer) {
    if (animState !== 'idle') return;

    setSelectedId(answer.id);
    setAnimState('selected');

    // After scale animation, submit + slide
    setTimeout(() => {
      submitAnswer(question.id, answer.id, answer);
      setAnimState('sliding');

      setTimeout(() => {
        // If that was the last question, calculate and navigate
        if (isLast) {
          // Need to read fresh state after submitAnswer
          // Use setTimeout to let Zustand flush
          setTimeout(() => {
            useGameStore.getState().calculateResult();
            navigate('/result');
          }, 50);
        } else {
          setAnimState('idle');
          setSelectedId(null);
        }
      }, 200);
    }, 150);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100">
        <div
          className="h-full bg-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center px-5 py-6 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-purple-600">
              Cua ai {gateInfo.gateNum}/5 &mdash; {gateInfo.gateName}
            </p>
          </div>
          <span className="text-sm font-medium text-gray-400">
            Q{currentQuestion + 1}/{TOTAL}
          </span>
        </div>

        {/* Question card */}
        <div
          className={`w-full transition-all duration-200 ${
            animState === 'sliding'
              ? 'opacity-0 translate-x-8'
              : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Question text */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              {question.text}
            </p>
            {question.is_branching && (
              <span className="inline-block mt-3 text-xs bg-purple-100 text-purple-600 px-2.5 py-0.5 rounded-full font-medium">
                Cau hoi re nhanh
              </span>
            )}
          </div>

          {/* Answer buttons */}
          <div className="space-y-3">
            {question.answers.map((answer) => {
              const isSelected = selectedId === answer.id;
              return (
                <button
                  key={answer.id}
                  onClick={() => handleSelect(answer)}
                  disabled={animState !== 'idle'}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 scale-[1.02] shadow-md shadow-purple-100'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
                  } ${animState !== 'idle' && !isSelected ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}
                    >
                      {answer.id}
                    </span>
                    <span className="text-gray-700 text-sm md:text-base leading-relaxed pt-0.5">
                      {answer.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Personality Pulse */}
        <div className="mt-auto pt-8 w-full">
          <PersonalityPulse rawScores={rawScores} questionIndex={currentQuestion} />
        </div>
      </div>
    </div>
  );
}

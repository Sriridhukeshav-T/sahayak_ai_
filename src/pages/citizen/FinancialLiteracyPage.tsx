import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  RefreshCw,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { LITERACY_ARTICLES, FINANCIAL_QUIZ_QUESTIONS, LiteracyArticle } from '../../data/literacy';
import { useLanguage } from '../../context/LanguageContext';

export const FinancialLiteracyPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<LiteracyArticle | null>(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isQuizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    FINANCIAL_QUIZ_QUESTIONS.forEach(q => {
      const selected = quizAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.correct) {
        correct++;
      }
    });
    return Math.round((correct / FINANCIAL_QUIZ_QUESTIONS.length) * 100);
  };

  const score = calculateScore();

  const resetQuiz = () => {
    setQuizAnswers({});
    setIsQuizSubmitted(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 inline-block">
          Public Financial Literacy
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Borrower Knowledge & Readiness
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Official guidance on reducing balance calculations, debt service capacity, moratorium terms, and statutory borrower rights.
        </p>
      </div>

      {/* Educational Article Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-800" />
            <span>Essential Borrowing Guides</span>
          </h2>
          <span className="text-xs text-slate-500">5 published modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LITERACY_ARTICLES.map(art => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
                    {art.category}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>Read Full Guidance</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Financial Readiness Quiz */}
      <div className="bg-white rounded-lg p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base text-slate-900 font-serif">
                Borrower Assessment & Readiness Evaluation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              8 objective questions to evaluate credit literacy and comprehension of statutory loan obligations.
            </p>
          </div>

          {isQuizSubmitted && (
            <button
              onClick={resetQuiz}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors flex items-center gap-1.5 self-start"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Evaluation</span>
            </button>
          )}
        </div>

        {/* Quiz Score Banner when submitted */}
        {isQuizSubmitted && (
          <div className="p-5 rounded-md bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                Evaluation Scorecard
              </span>
              <h4 className="text-lg font-bold text-slate-900">
                Readiness Score: {score} / 100
              </h4>
              <p className="text-xs text-slate-600">
                {score >= 80
                  ? 'Strong credit awareness demonstrated. Prepared for institutional loan obligations.'
                  : score >= 50
                  ? 'Satisfactory baseline. Review the borrowing guides above to clarify debt amortization rules.'
                  : 'Borrower caution advised. Review guides on Reducing Balance vs Flat Rate prior to borrowing.'}
              </p>
            </div>

            <div className="w-16 h-16 rounded-md bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-900 text-xl shrink-0 shadow-xs">
              {score}%
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-5">
          {FINANCIAL_QUIZ_QUESTIONS.map((q, qIndex) => {
            const selectedIdx = quizAnswers[q.id];
            const hasAnswered = selectedIdx !== undefined;

            return (
              <div key={q.id} className="p-4 sm:p-5 rounded-md bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-sm bg-slate-200 text-slate-700 text-xs font-mono font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 leading-snug">
                    {q.question}
                  </h4>
                </div>

                <div className="space-y-2 pl-7">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedIdx === optIdx;
                    let optionStyle = 'bg-white border-slate-300 text-slate-700 hover:border-slate-400';

                    if (isQuizSubmitted) {
                      if (opt.correct) {
                        optionStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                      } else if (isSelected && !opt.correct) {
                        optionStyle = 'bg-red-50 border-red-400 text-red-900 line-through';
                      } else {
                        optionStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-emerald-50/60 border-emerald-700 text-emerald-950 font-semibold ring-1 ring-emerald-700/30';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-md border text-xs transition-all flex items-start gap-2 ${optionStyle}`}
                      >
                        <span className="font-mono text-slate-500 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="leading-relaxed flex-1">{opt.text}</span>
                        {isQuizSubmitted && opt.correct && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        )}
                        {isQuizSubmitted && isSelected && !opt.correct && (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Reveal */}
                {isQuizSubmitted && hasAnswered && (
                  <div className="ml-7 p-3 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-800 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    <span>{q.options[selectedIdx].explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Quiz Button */}
        {!isQuizSubmitted && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsQuizSubmitted(true)}
              disabled={Object.keys(quizAnswers).length === 0}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 rounded-md shadow-xs transition-all flex items-center gap-2"
            >
              <span>Submit Evaluation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Close ✕
              </button>
            </div>

            <h2 className="text-lg font-serif font-bold text-slate-900">
              {selectedArticle.title}
            </h2>

            <div className="p-3.5 bg-emerald-50 rounded-md border border-emerald-200 text-xs text-emerald-900 font-medium leading-relaxed">
              <strong>Key Principle:</strong> {selectedArticle.keyTakeaway}
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

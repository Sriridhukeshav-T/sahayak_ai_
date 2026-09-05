import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  RefreshCw,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { LITERACY_ARTICLES, FINANCIAL_QUIZ_QUESTIONS, LiteracyArticle } from '../../data/literacy';
import { DemoBadge } from '../../components/common/DemoBadge';

export const FinancialLiteracyPage: React.FC = () => {
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
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Financial Literacy & Capacity Building
          </span>
          <DemoBadge />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Learn Before You Borrow
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Master the fundamentals of institutional credit, reducing-balance interest, moratoriums, and protect your enterprise from debt distress.
        </p>
      </div>

      {/* Educational Article Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Essential Borrowing Guides</span>
          </h2>
          <span className="text-xs text-slate-400">5 curated modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LITERACY_ARTICLES.map(art => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {art.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Financial Readiness Quiz */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base text-slate-900">
                Interactive Financial Readiness Quiz
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              8 quick practical questions to test your credit readiness before signing a bank loan.
            </p>
          </div>

          {isQuizSubmitted && (
            <button
              onClick={resetQuiz}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 self-start"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          )}
        </div>

        {/* Quiz Score Banner when submitted */}
        {isQuizSubmitted && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Evaluation Complete
              </span>
              <h4 className="text-xl font-black text-slate-900">
                Your Financial Readiness Score: {score} / 100
              </h4>
              <p className="text-xs text-slate-600">
                {score >= 80
                  ? '🎉 Outstanding! You have solid financial awareness and are well prepared for institutional borrowing.'
                  : score >= 50
                  ? '👍 Good baseline! Review the educational articles above to strengthen your debt management skills.'
                  : '⚠️ Please read the articles on Reducing Balance and Moratorium before taking a loan.'}
              </p>
            </div>

            <div className="w-20 h-20 rounded-full bg-white border-4 border-blue-600 flex items-center justify-center font-extrabold text-blue-900 text-2xl shrink-0 shadow-sm">
              {score}%
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {FINANCIAL_QUIZ_QUESTIONS.map((q, qIndex) => {
            const selectedIdx = quizAnswers[q.id];
            const hasAnswered = selectedIdx !== undefined;

            return (
              <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    {q.question}
                  </h4>
                </div>

                <div className="space-y-2 pl-8">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedIdx === optIdx;
                    let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';

                    if (isQuizSubmitted) {
                      if (opt.correct) {
                        optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected && !opt.correct) {
                        optionStyle = 'bg-red-50 border-red-500 text-red-900 line-through';
                      } else {
                        optionStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2 ${optionStyle}`}
                      >
                        <span className="font-mono text-slate-400 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="leading-relaxed flex-1">{opt.text}</span>
                        {isQuizSubmitted && opt.correct && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
                  <div className="ml-8 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
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
              className="px-6 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-40 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Submit & Score My Readiness</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Close ✕
              </button>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900">
              {selectedArticle.title}
            </h2>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium leading-relaxed">
              💡 <strong>Key Takeaway:</strong> {selectedArticle.keyTakeaway}
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

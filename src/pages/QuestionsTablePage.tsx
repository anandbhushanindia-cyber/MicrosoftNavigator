import React, { useMemo } from 'react';
import questionsData from '../data/questions.json';

type QuestionRow = {
  contextId: string;
  contextName: string;
  questionId: string;
  questionText: string;
  optionId: string;
  optionText: string;
  tags: string[];
  weight: number;
};

export const QuestionsTablePage: React.FC = () => {
  const rows = useMemo<QuestionRow[]>(() => {
    const result: QuestionRow[] = [];
    const contexts = questionsData.contexts ?? {};

    for (const [contextId, contextValue] of Object.entries(contexts)) {
      const contextName = contextValue?.name ?? contextId;
      const questions = contextValue?.questions ?? [];

      for (const question of questions) {
        const options = question?.options ?? [];
        for (const option of options) {
          result.push({
            contextId,
            contextName,
            questionId: question.id,
            questionText: question.text,
            optionId: option.id,
            optionText: option.text,
            tags: option.tags ?? [],
            weight: option.weight ?? 0,
          });
        }
      }
    }

    return result;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Questions Data
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Showing {rows.length} options across {Object.keys(questionsData.contexts ?? {}).length} contexts.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Context</th>
                <th className="px-4 py-3 font-semibold">Question</th>
                <th className="px-4 py-3 font-semibold">Option</th>
                <th className="px-4 py-3 font-semibold">Tags</th>
                <th className="px-4 py-3 font-semibold">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={`${row.contextId}-${row.questionId}-${row.optionId}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-slate-900">{row.contextName}</div>
                    <div className="text-xs text-slate-500">{row.contextId}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-slate-900">{row.questionText}</div>
                    <div className="text-xs text-slate-500">{row.questionId}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-slate-900">{row.optionText}</div>
                    <div className="text-xs text-slate-500">{row.optionId}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {row.tags.map((tag) => (
                        <span
                          key={`${row.optionId}-${tag}`}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top font-semibold text-slate-900">
                    {row.weight}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                    No questions found in questions.json.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

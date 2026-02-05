import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Circle } from 'lucide-react';
import type { Question } from '../../types/navigator.types';

interface QuestionFlowProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (optionId: string, tags: string[], weight: number) => void;
}

export const QuestionFlow: React.FC<QuestionFlowProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* Progress Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg sm:text-xl font-medium text-gray-800">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-lg sm:text-xl font-semibold text-indigo-600">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full"
          />
        </div>
      </div>

      {/* Question Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-10 leading-tight">
            {question.text}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  onAnswer(option.id, option.tags, option.weight)
                }
                className="
                  group w-full text-left p-6 sm:p-7 rounded-2xl
                  bg-white border border-gray-200
                  hover:border-indigo-500 hover:bg-indigo-50
                  transition-all duration-200
                  shadow-sm hover:shadow-md
                  focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40
                "
                aria-label={`Select option: ${option.text}`}
              >
                <div className="flex items-center gap-5">
                  {/* Radio Indicator */}
                  <div className="flex-shrink-0">
                    <div className="
                      w-6 h-6 rounded-full border-2 border-gray-300
                      flex items-center justify-center
                      group-hover:border-indigo-500 transition-colors
                    ">
                      <Circle
                        className="
                          w-3.5 h-3.5 text-indigo-500
                          opacity-0 group-hover:opacity-100
                          transition-opacity
                        "
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  {/* Option Text */}
                  <span className="flex-1 text-lg sm:text-xl text-gray-700 group-hover:text-gray-900 transition-colors">
                    {option.text}
                  </span>

                  {/* Arrow */}
                  <ChevronRight
                    className="
                      w-6 h-6 text-gray-300
                      group-hover:text-indigo-500
                      group-hover:translate-x-1
                      transition-all
                    "
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
};

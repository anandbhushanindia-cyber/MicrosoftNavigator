import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RadioButtonChecked, ArrowLeft } from '@carbon/icons-react';
import type { Question } from '../../types/navigator.types';
import { EditableText } from '../admin/EditableText';
import { useAdmin } from '../../contexts/AdminContext';
import { AnimatedBackground } from '../visualizations/AnimatedBackground';

interface QuestionFlowProps {
  question: Question;
  scenarioId: string;
  subScenarioId: string;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (optionId: string, signalPath: string, weight: number) => void;
  onBack: () => void;
}

// --- Color palette for option bars (cycles per index) ---
const OPTION_COLORS = [
  {
    border: 'border-l-blue-500',
    activeBorder: 'active:border-l-blue-600',
    radio: 'border-blue-400 group-active:border-blue-600',
    dot: 'text-blue-500',
  },
];

export const QuestionFlow: React.FC<QuestionFlowProps> = ({
  question,
  scenarioId,
  subScenarioId,
  currentIndex,
  totalQuestions,
  onAnswer,
  onBack,
}) => {
  const { updateScenarioField } = useAdmin();
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full max-w-5xl mx-auto"
    >
      {/* Animated Background Visualization */}
      <AnimatedBackground variant="pulse" />

      {/* Content — sits above background */}
      <div className="relative z-10">

      {/* Back Button — kiosk-friendly touchable */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="
          inline-flex items-center gap-2.5
          text-gray-600 mb-8
          px-5 py-3 rounded-2xl
          bg-white/80 backdrop-blur-sm
          border border-gray-200
          shadow-sm hover:shadow-md active:shadow-inner
          hover:bg-white active:bg-gray-50
          transition-all min-h-[52px]
        "
      >
        <ArrowLeft size={24} />
        <span className="text-base sm:text-lg font-semibold">
          {currentIndex === 0 ? (
            <EditableText labelKey="question.backToSub" as="span" className="text-base sm:text-lg font-semibold" />
          ) : (
            <EditableText labelKey="question.backPrevious" as="span" className="text-base sm:text-lg font-semibold" />
          )}
        </span>
      </motion.button>

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

        <div className="relative w-full h-2.5 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-10 leading-tight drop-shadow-sm">
            <EditableText
              value={question.text}
              onSave={(v) => updateScenarioField(scenarioId, `subScenarios.${subScenarioId}.questions.${question.id}.text`, v)}
              as="span"
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight"
            />
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => {
              const color = OPTION_COLORS[index % OPTION_COLORS.length];

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileTap={{ scale: 0.98, x: 6 }}
                  onClick={() =>
                    onAnswer(option.id, option.signalPath, option.weight)
                  }
                  className={`
                    group w-full text-left p-6 sm:p-7 rounded-2xl
                    bg-white/95 backdrop-blur-sm
                    border border-white/80 border-l-4 ${color.border}
                    ${color.activeBorder} active:bg-indigo-50/80
                    transition-all duration-200
                    shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:shadow-2xl
                    min-h-[64px]
                    focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40
                  `}
                  aria-label={`Select option: ${option.text}`}
                >
                  <div className="flex items-center gap-5">
                    {/* Radio Indicator */}
                    <div className="flex-shrink-0">
                      <div className={`
                        w-6 h-6 rounded-full border-2 ${color.radio}
                        flex items-center justify-center
                        transition-colors
                      `}>
                        <RadioButtonChecked
                          size={14}
                          className={`
                            ${color.dot}
                            opacity-0 group-active:opacity-100
                            transition-opacity
                          `}
                        />
                      </div>
                    </div>

                    {/* Option Text */}
                    <span className="flex-1 text-lg sm:text-xl text-gray-700 group-active:text-gray-900 transition-colors">
                      <EditableText
                        value={option.text}
                        onSave={(v) => updateScenarioField(scenarioId, `subScenarios.${subScenarioId}.questions.${question.id}.options.${option.id}.text`, v)}
                        as="span"
                        className="text-lg sm:text-xl text-gray-700"
                      />
                    </span>

                    {/* Arrow */}
                    <ChevronRight
                      size={24}
                      className="
                        text-gray-300
                        group-active:text-indigo-500
                        transition-all
                      "
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      </div>
    </motion.section>
  );
};

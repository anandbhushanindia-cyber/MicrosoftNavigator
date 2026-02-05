import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { NavigatorLayout } from '../components/navigator/NavigatorLayout';
import { LandingScreen } from '../components/navigator/LandingScreen';
import { ContextSelector } from '../components/navigator/ContextSelector';
import { QuestionFlow } from '../components/navigator/QuestionFlow';
import { RecommendationScreen } from '../components/navigator/RecommendationScreen';

import { useNavigator } from '../hooks/useNavigator';

export const NavigatorPage: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    selectContext,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    addAnswer,
    recommendation,
    leadershipMode,
    toggleLeadershipMode,
    reset,
  } = useNavigator();

  return (
    <NavigatorLayout>
      <AnimatePresence mode="wait">
        {/* Landing */}
        {currentStep === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <LandingScreen
              onStart={() => setCurrentStep('context')}
            />
          </motion.div>
        )}

        {/* Context Selection */}
        {currentStep === 'context' && (
          <motion.div
            key="context"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            <ContextSelector
              onSelect={(contextId) => {
                selectContext(contextId);
              }}
            />
          </motion.div>
        )}

        {/* Questions */}
        {currentStep === 'questions' && currentQuestion && (
          <motion.div
            key={`question-${currentQuestion.id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            <QuestionFlow
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              onAnswer={(optionId, tags, weight) => {
                addAnswer(
                  currentQuestion.id,
                  optionId,
                  tags,
                  weight
                );
              }}
            />
          </motion.div>
        )}

        {/* Results */}
        {currentStep === 'results' && recommendation && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full"
          >
            <RecommendationScreen
              recommendation={recommendation}
              leadershipMode={leadershipMode}
              onToggleMode={toggleLeadershipMode}
              onReset={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </NavigatorLayout>
  );
};

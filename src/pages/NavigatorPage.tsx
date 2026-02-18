import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { NavigatorLayout } from '../components/navigator/NavigatorLayout';
import { LandingScreen } from '../components/navigator/LandingScreen';
import { ScenarioSelector } from '../components/navigator/ScenarioSelector';
import { SubScenarioSelector } from '../components/navigator/SubScenarioSelector';
import { QuestionFlow } from '../components/navigator/QuestionFlow';
import { RecommendationScreen } from '../components/navigator/RecommendationScreen';
import { IdleWarningModal } from '../components/navigator/IdleWarningModal';

import { useNavigator } from '../hooks/useNavigator';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import { useAdmin } from '../contexts/AdminContext';
import { AdminToolbar } from '../components/admin/AdminToolbar';

export const NavigatorPage: React.FC = () => {
  const { getConfig } = useAdmin();

  const {
    currentStep,
    setCurrentStep,
    selectedScenario,
    selectedScenarioId,
    selectedSubScenarioId,
    selectScenario,
    selectSubScenario,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    addAnswer,
    goBack,
    recommendation,
    reset,
    scenarios,
  } = useNavigator();

  const { showWarning, warningSecondsLeft, dismissWarning } = useIdleTimeout(reset, {
    timeoutMs: getConfig('idleTimeoutMs'),
    warningMs: getConfig('warningMs'),
    enabled: currentStep !== 'landing',
  });

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
              onStart={() => setCurrentStep('scenario')}
            />
          </motion.div>
        )}

        {/* Scenario Selection */}
        {currentStep === 'scenario' && (
          <motion.div
            key="scenario"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            <ScenarioSelector
              scenarios={scenarios}
              onSelect={selectScenario}
              onBack={goBack}
            />
          </motion.div>
        )}

        {/* Sub-Scenario Selection */}
        {currentStep === 'subscenario' && selectedScenario && (
          <motion.div
            key="subscenario"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            <SubScenarioSelector
              subScenarios={selectedScenario.subScenarios}
              scenarioId={selectedScenario.id}
              scenarioTitle={selectedScenario.title}
              onSelect={selectSubScenario}
              onBack={goBack}
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
              scenarioId={selectedScenarioId || ''}
              subScenarioId={selectedSubScenarioId || ''}
              currentIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              onAnswer={(optionId, signalPath, weight) => {
                addAnswer(
                  currentQuestion.id,
                  optionId,
                  signalPath,
                  weight
                );
              }}
              onBack={goBack}
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
              onReset={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle Warning Modal */}
      <IdleWarningModal
        visible={showWarning}
        secondsLeft={warningSecondsLeft}
        onDismiss={dismissWarning}
      />

      {/* Admin Toolbar (only visible in admin mode) */}
      <AdminToolbar />
    </NavigatorLayout>
  );
};

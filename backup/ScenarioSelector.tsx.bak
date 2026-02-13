import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Database, Zap, ShieldCheck, ChevronRight, Bot, Rocket, RefreshCw, Activity, Clock, Cloud, GitBranch, TrendingUp } from 'lucide-react';
import type { Scenario } from '../../types/navigator.types';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  onSelect: (scenarioId: string) => void;
  onBack: () => void;
}

const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  Database: <Database className="w-7 h-7 sm:w-8 sm:h-8" />,
  Zap: <Zap className="w-7 h-7 sm:w-8 sm:h-8" />,
  ShieldCheck: <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />,
  Bot: <Bot className="w-7 h-7 sm:w-8 sm:h-8" />,
  Rocket: <Rocket className="w-7 h-7 sm:w-8 sm:h-8" />,
  RefreshCw: <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8" />,
  Activity: <Activity className="w-7 h-7 sm:w-8 sm:h-8" />,
  Cloud: <Cloud className="w-7 h-7 sm:w-8 sm:h-8" />,
  GitBranch: <GitBranch className="w-7 h-7 sm:w-8 sm:h-8" />,
  TrendingUp: <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8" />,
};

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  onSelect,
  onBack,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 mb-6 px-3 py-2 rounded-xl active:bg-gray-100 transition-colors min-h-[48px]"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-base font-medium">Back</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 sm:mb-12"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
          What best describes your current challenge?
        </h2>
        <p className="text-lg sm:text-xl text-gray-500">
          Select the scenario that resonates most with your situation
        </p>
      </motion.div>

      {/* Scenario Cards */}
      <div className="flex flex-col gap-4">
        {scenarios.map((scenario, index) => {
          const isEnabled = scenario.enabled;

          return (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.08, duration: 0.35, ease: 'easeOut' }}
              whileTap={isEnabled ? { scale: 0.98 } : undefined}
              onClick={() => isEnabled && onSelect(scenario.id)}
              disabled={!isEnabled}
              className={`
                relative text-left rounded-2xl sm:rounded-3xl p-6 sm:p-7
                border-2 transition-all min-h-[100px]
                focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300/40
                ${isEnabled
                  ? 'bg-white border-gray-200 active:border-indigo-400 active:shadow-lg cursor-pointer'
                  : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
                }
              `}
              aria-label={scenario.title}
            >
              <div className="flex items-center gap-5 sm:gap-6">
                {/* Icon */}
                <div className={`
                  shrink-0 inline-flex items-center justify-center
                  w-14 h-14 sm:w-16 sm:h-16 rounded-2xl
                  bg-gradient-to-br ${scenario.color}
                  text-white shadow-lg
                  ${!isEnabled ? 'opacity-50' : ''}
                `}>
                  {SCENARIO_ICONS[scenario.icon] || <Database className="w-7 h-7 sm:w-8 sm:h-8" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                    {scenario.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-500 leading-relaxed line-clamp-2">
                    {scenario.description}
                  </p>
                </div>

                {/* Arrow or Coming Soon Badge */}
                <div className="shrink-0 self-center">
                  {isEnabled ? (
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" />
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
};

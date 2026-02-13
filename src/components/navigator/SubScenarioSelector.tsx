import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { SubScenario } from '../../types/navigator.types';
import { EditableText } from '../admin/EditableText';
import { useAdmin } from '../../contexts/AdminContext';

interface SubScenarioSelectorProps {
  subScenarios: SubScenario[];
  scenarioId: string;
  scenarioTitle: string;
  onSelect: (subScenarioId: string) => void;
  onBack: () => void;
}

export const SubScenarioSelector: React.FC<SubScenarioSelectorProps> = ({
  subScenarios,
  scenarioId,
  scenarioTitle,
  onSelect,
  onBack,
}) => {
  const { updateScenarioField } = useAdmin();
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
        <EditableText labelKey="subscenario.backButton" as="span" className="text-base font-medium" />
      </motion.button>

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4"
      >
        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          {scenarioTitle}
        </span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 sm:mb-12"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
          <EditableText
            labelKey="subscenario.heading"
            as="span"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900"
          />
        </h2>
        <p className="text-lg sm:text-xl text-gray-500">
          <EditableText
            labelKey="subscenario.subheading"
            as="span"
            className="text-lg sm:text-xl text-gray-500"
          />
        </p>
      </motion.div>

      {/* Sub-Scenario Cards — 2×2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {subScenarios.map((subScenario, index) => (
          <motion.button
            key={subScenario.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.08, duration: 0.35, ease: 'easeOut' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(subScenario.id)}
            className={`
              relative text-left rounded-2xl p-6 sm:p-7
              bg-white border-2 border-gray-200
              active:border-indigo-400 active:shadow-lg
              transition-all min-h-[120px]
              focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300/40
            `}
            aria-label={subScenario.text}
          >
            <div className="flex flex-col h-full justify-between gap-4">
              {/* Sub-scenario text */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug">
                <EditableText
                  value={subScenario.text}
                  onSave={(v) => updateScenarioField(scenarioId, `subScenarios.${subScenario.id}.text`, v)}
                  as="span"
                  className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug"
                />
              </h3>

              {/* Business meaning + chevron */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500 leading-snug">
                  <EditableText
                    value={subScenario.businessMeaning}
                    onSave={(v) => updateScenarioField(scenarioId, `subScenarios.${subScenario.id}.businessMeaning`, v)}
                    as="span"
                    className="text-sm text-gray-500 leading-snug"
                  />
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
};

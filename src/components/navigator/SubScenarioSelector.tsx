import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { SubScenario } from '../../types/navigator.types';
import { EditableText } from '../admin/EditableText';
import { useAdmin } from '../../contexts/AdminContext';
import { AnimatedBackground } from '../visualizations/AnimatedBackground';

interface SubScenarioSelectorProps {
  subScenarios: SubScenario[];
  scenarioId: string;
  scenarioTitle: string;
  onSelect: (subScenarioId: string) => void;
  onBack: () => void;
}

// --- Cycling color palette for sub-scenario tiles (visible on kiosk) ---
const SUB_TILE_COLORS = [
  'from-blue-100 via-blue-50/80 to-white',
  'from-teal-100 via-teal-50/80 to-white',
  'from-purple-100 via-purple-50/80 to-white',
  'from-amber-100 via-amber-50/80 to-white',
];

const SUB_TILE_ACCENTS = [
  'border-l-blue-500',
  'border-l-teal-500',
  'border-l-purple-500',
  'border-l-amber-500',
];

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
      className="relative w-full max-w-4xl mx-auto"
    >
      {/* Animated Background Visualization */}
      <AnimatedBackground variant="focus" />

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
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        <EditableText labelKey="subscenario.backButton" as="span" className="text-base sm:text-lg font-semibold" />
      </motion.button>

      {/* Selected Scenario Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <p className="text-base text-gray-500 font-medium mb-1">You have selected</p>
        <h3 className="text-2xl sm:text-3xl font-bold text-indigo-700">
          {scenarioTitle}
        </h3>
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
              bg-gradient-to-br ${SUB_TILE_COLORS[index % SUB_TILE_COLORS.length]}
              backdrop-blur-sm
              border-2 border-white/80 border-l-4 ${SUB_TILE_ACCENTS[index % SUB_TILE_ACCENTS.length]}
              active:border-indigo-400
              shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:shadow-2xl
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
      </div>
    </motion.section>
  );
};

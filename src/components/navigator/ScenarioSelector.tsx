import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Time } from '@carbon/icons-react';
import {
  DataWarehousing,
  Lightning as LightningPicto,
  SecurityShield,
  Ai as AiPicto,
  Rocket as RocketPicto,
  AppModernization,
  Analytics as AnalyticsPicto,
  CloudComputing,
  Devops,
  Growth as GrowthPicto,
} from '@carbon/pictograms-react';
import type { Scenario } from '../../types/navigator.types';
import { EditableText } from '../admin/EditableText';
import { useAdmin } from '../../contexts/AdminContext';
import { AnimatedBackground } from '../visualizations/AnimatedBackground';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  onSelect: (scenarioId: string) => void;
  onBack: () => void;
}

// --- Icon registry using Carbon pictograms (larger, more detailed for kiosk) ---
const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  Database: <DataWarehousing size={48} />,
  Zap: <LightningPicto size={48} />,
  ShieldCheck: <SecurityShield size={48} />,
  Bot: <AiPicto size={48} />,
  Rocket: <RocketPicto size={48} />,
  RefreshCw: <AppModernization size={48} />,
  Activity: <AnalyticsPicto size={48} />,
  Cloud: <CloudComputing size={48} />,
  GitBranch: <Devops size={48} />,
  TrendingUp: <GrowthPicto size={48} />,
};

// --- IBM Carbon-inspired offering group color config ---
const OFFERING_GROUP_CONFIG: Record<string, {
  label: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconText: string;
  cardBg: string;
  hoverBorder: string;
  activeBorder: string;
}> = {
  DT: {
    label: 'Data Transformation',
    accentColor: 'border-l-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    iconBg: 'bg-blue-200',
    iconText: 'text-blue-700',
    cardBg: 'bg-gradient-to-br from-blue-100 via-blue-50/80 to-white backdrop-blur-sm',
    hoverBorder: 'active:border-blue-400',
    activeBorder: 'focus-visible:ring-blue-300/40',
  },
  AMM: {
    label: 'App Modernization',
    accentColor: 'border-l-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    iconBg: 'bg-blue-200',
    iconText: 'text-blue-700',
    cardBg: 'bg-gradient-to-br from-blue-100 via-blue-50/80 to-white backdrop-blur-sm',
    hoverBorder: 'active:border-blue-400',
    activeBorder: 'focus-visible:ring-blue-300/40',
  },
  DPDE: {
    label: 'Product Engineering',
    accentColor: 'border-l-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    iconBg: 'bg-blue-200',
    iconText: 'text-blue-700',
    cardBg: 'bg-gradient-to-br from-blue-100 via-blue-50/80 to-white backdrop-blur-sm',
    hoverBorder: 'active:border-blue-400',
    activeBorder: 'focus-visible:ring-blue-300/40',
  },
};

const DEFAULT_GROUP_CONFIG = {
  label: 'Transformation',
  accentColor: 'border-l-blue-600',
  badgeBg: 'bg-blue-100',
  badgeText: 'text-blue-800',
  iconBg: 'bg-blue-200',
  iconText: 'text-blue-700',
  cardBg: 'bg-gradient-to-br from-blue-100 via-blue-50/80 to-white backdrop-blur-sm',
  hoverBorder: 'active:border-blue-400',
  activeBorder: 'focus-visible:ring-blue-300/40',
};

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
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
      className="relative w-full max-w-6xl mx-auto"
    >
      {/* Animated Background Visualization */}
      <AnimatedBackground variant="flow" />

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
        <EditableText labelKey="scenario.backButton" as="span" className="text-base sm:text-lg font-semibold" />
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 sm:mb-12"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 drop-shadow-sm">
          <EditableText
            labelKey="scenario.heading"
            as="span"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900"
          />
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 font-medium">
          <EditableText
            labelKey="scenario.subheading"
            as="span"
            className="text-lg sm:text-xl text-gray-600 font-medium"
          />
        </p>
      </motion.div>

      {/* Scenario Tiles — 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scenarios.map((scenario, index) => {
          const isEnabled = scenario.enabled;
          const group = OFFERING_GROUP_CONFIG[scenario.offeringGroup || ''] || DEFAULT_GROUP_CONFIG;

          return (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.06, duration: 0.35, ease: 'easeOut' }}
              whileTap={isEnabled ? { scale: 0.97 } : undefined}
              onClick={() => isEnabled && onSelect(scenario.id)}
              disabled={!isEnabled}
              className={`
                relative text-left rounded-2xl
                border border-white/80 border-l-4 ${group.accentColor}
                transition-all min-h-[180px]
                focus:outline-none focus-visible:ring-4 ${group.activeBorder}
                ${isEnabled
                  ? `${group.cardBg} ${group.hoverBorder} shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:shadow-2xl cursor-pointer`
                  : 'bg-white/70 backdrop-blur-sm border-l-gray-300 cursor-not-allowed opacity-60'
                }
              `}
              aria-label={scenario.title}
            >
              <div className="flex flex-col h-full p-5 sm:p-6">
                {/* Coming Soon badge for disabled scenarios */}
                {!isEnabled && (
                  <div className="flex items-center justify-end mb-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded whitespace-nowrap">
                      <Time size={12} />
                      Coming Soon
                    </span>
                  </div>
                )}

                {/* Icon + Title Row */}
                <div className="flex items-start gap-4 mb-3">
                  <div className={`
                    shrink-0 inline-flex items-center justify-center
                    w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl
                    ${isEnabled ? `${group.iconBg} ${group.iconText}` : 'bg-gray-100 text-gray-400'}
                  `}>
                    {SCENARIO_ICONS[scenario.icon] || <DataWarehousing size={48} />}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-semibold text-gray-900 leading-snug pt-1 flex-1 min-w-0">
                    <EditableText
                      value={scenario.title}
                      onSave={(v) => updateScenarioField(scenario.id, 'title', v)}
                      as="span"
                      className="text-xl sm:text-2xl lg:text-[1.65rem] font-semibold text-gray-900 leading-snug"
                    />
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-3">
                  <EditableText
                    value={scenario.description}
                    onSave={(v) => updateScenarioField(scenario.id, 'description', v)}
                    as="span"
                    multiline
                    className="text-sm sm:text-base text-gray-500 leading-relaxed"
                  />
                </p>

                {/* Footer with Chevron */}
                <div className="flex items-center justify-end">
                  {isEnabled && (
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                      <EditableText
                        labelKey="scenario.explore"
                        as="span"
                        className="text-xs font-medium text-gray-400"
                      />
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      </div>
    </motion.section>
  );
};

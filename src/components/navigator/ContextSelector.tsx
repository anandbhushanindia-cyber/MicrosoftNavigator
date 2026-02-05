import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  BrainCircuit,
  Layers3,
  Rocket,
  DollarSign,
  Target
} from 'lucide-react';

interface ContextOption {
  id: string;
  Icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

interface ContextSelectorProps {
  onSelect: (contextId: string) => void;
}

const contexts: ContextOption[] = [
  {
    id: 'data',
    Icon: BarChart3,
    title: 'DATA',
    description: 'Insights arrive too late',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'ai',
    Icon: BrainCircuit,
    title: 'AI',
    description: 'Stuck in pilot mode',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'apps',
    Icon: Layers3,
    title: 'APPS',
    description: 'Legacy systems holding us back',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'speed',
    Icon: Rocket,
    title: 'SPEED',
    description: 'Innovation can’t keep up',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'cost',
    Icon: DollarSign,
    title: 'COST',
    description: 'Cloud spend is out of control',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'customer',
    Icon: Target,
    title: 'CUSTOMER',
    description: 'Experience is slipping',
    color: 'from-red-500 to-red-600'
  }
];

export const ContextSelector: React.FC<ContextSelectorProps> = ({ onSelect }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10 lg:mb-14"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
          What’s Your Primary Challenge?
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto">
          Select the area creating the most friction in your business today
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto">
        {contexts.map((context, index) => (
          <motion.button
            key={context.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -10, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(context.id)}
            className="group relative w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 rounded-3xl"
            aria-label={`Select ${context.title} challenge`}
          >
            <div
              className={`relative h-56 lg:h-60 rounded-3xl bg-gradient-to-br ${context.color} p-7 lg:p-8 shadow-xl transition-all overflow-hidden`}
            >
              {/* Glass Hover Layer */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center">
                {/* Icon Halo */}
                <div className="mb-4 flex items-center justify-center w-16 h-16 lg:w-18 lg:h-18 rounded-2xl bg-white/15 backdrop-blur-md shadow-inner">
                  <context.Icon className="w-8 h-8 lg:w-9 lg:h-9 text-white" strokeWidth={1.8} />
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 tracking-wide">
                  {context.title}
                </h3>

                <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xs">
                  “{context.description}”
                </p>
              </div>

              {/* Ambient Accent */}
              <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-3xl" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer Helper */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-gray-500 mt-8 lg:mt-10 text-sm sm:text-base max-w-3xl mx-auto"
      >
        You’ll have a chance to explore other dimensions next
      </motion.p>
    </motion.section>
  );
};

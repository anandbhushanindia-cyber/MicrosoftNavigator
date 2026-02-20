import React from 'react';
import { motion } from 'framer-motion';
import { MagicWand } from '@carbon/icons-react';
import { EditableText } from '../admin/EditableText';
import { AnimatedBackground } from '../visualizations/AnimatedBackground';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative w-full max-w-4xl mx-auto text-center"
    >
      {/* Animated Background Visualization */}
      <AnimatedBackground variant="hero" />

      {/* Content — sits above background */}
      <div className="relative z-10">
        {/* Hero */}
        <div className="mb-14">
          {/* IBM + Microsoft Logos */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-6 sm:gap-8 mb-10"
          >
            <img
              src="/logos/ibm.svg"
              alt="IBM"
              className="h-10 sm:h-12 lg:h-14 w-auto"
            />
            <div className="w-px h-10 sm:h-12 lg:h-14 bg-gray-300" />
            <img
              src="/logos/microsoft.svg"
              alt="Microsoft"
              className="h-8 sm:h-10 lg:h-12 w-auto"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="
              text-4xl sm:text-5xl lg:text-6xl
              font-semibold text-gray-900
              mb-6 leading-tight
            "
          >
            <EditableText
              labelKey="landing.heading"
              as="span"
              renderNewlines
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight"
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-xl sm:text-2xl text-gray-700 mb-4"
          >
            <EditableText
              labelKey="landing.subtitle"
              as="span"
              className="text-xl sm:text-2xl text-gray-700"
            />
          </motion.p>

          {/* Attribution */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-base sm:text-lg text-gray-500"
          >
            <EditableText
              labelKey="landing.attribution"
              as="span"
              className="text-base sm:text-lg text-gray-500"
            />
          </motion.p>
        </div>

        {/* CTA */}
        <motion.button
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="
            inline-flex items-center gap-3
            px-10 sm:px-14 py-5 sm:py-6
            bg-gradient-to-r from-blue-500 to-indigo-600
            active:from-blue-600 active:to-indigo-700
            text-white text-lg sm:text-xl font-semibold
            rounded-2xl
            shadow-2xl
            transition-all
            min-h-[64px]
            focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40
          "
        >
          <EditableText
            labelKey="landing.cta"
            as="span"
            className="text-lg sm:text-xl font-semibold"
          />
          <MagicWand size={24} />
        </motion.button>

      </div>
    </motion.section>
  );
};

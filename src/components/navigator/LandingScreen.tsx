import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Sparkles } from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto text-center"
    >
      {/* Hero */}
      <div className="mb-14">
        {/* Icon */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="
            inline-flex items-center justify-center
            w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
            rounded-2xl
            bg-gradient-to-br from-blue-500 to-indigo-600
            mb-8 shadow-2xl
          "
        >
          <Navigation
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white"
            strokeWidth={1.6}
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
          Microsoft Transformation
          <br />
          Navigator
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xl sm:text-2xl text-gray-700 mb-4"
        >
          From Business Friction to Transformation Clarity
        </motion.p>

        {/* Attribution */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-base sm:text-lg text-gray-500"
        >
          Curated by IBM Consulting Microsoft Offering Team
        </motion.p>
      </div>

      {/* Framing Stats */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="
          flex flex-wrap items-center justify-center
          gap-10 sm:gap-14
          mb-14
        "
      >
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-semibold text-indigo-600 mb-1">
            ~3
          </div>
          <div className="text-sm sm:text-base text-gray-600">
            Minutes
          </div>
        </div>

        <div className="w-px h-12 sm:h-16 bg-gray-300" />

        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-semibold text-indigo-600 mb-1">
            6
          </div>
          <div className="text-sm sm:text-base text-gray-600">
            Strategic Questions
          </div>
        </div>

        <div className="w-px h-12 sm:h-16 bg-gray-300" />

        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-semibold text-indigo-600 mb-1">
            1
          </div>
          <div className="text-sm sm:text-base text-gray-600">
            Clear Direction
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
        className="
          inline-flex items-center gap-3
          px-10 sm:px-14 py-4 sm:py-5
          bg-gradient-to-r from-blue-500 to-indigo-600
          hover:from-blue-600 hover:to-indigo-700
          text-white text-lg sm:text-xl font-semibold
          rounded-2xl
          shadow-2xl hover:shadow-indigo-500/40
          transition-all
          focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40
        "
      >
        Begin Your Journey
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      {/* Trust Line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        className="text-gray-500 mt-10 sm:mt-14 text-sm sm:text-base"
      >
        Trusted by global enterprises modernizing with Microsoft and IBM
      </motion.p>
    </motion.section>
  );
};

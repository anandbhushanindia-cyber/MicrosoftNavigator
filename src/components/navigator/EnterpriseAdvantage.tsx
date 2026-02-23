import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Enterprise } from '@carbon/icons-react';
import type { OfferingName } from '../../types/navigator.types';

interface EnterpriseAdvantageProps {
  primaryOffering: OfferingName;
}

const OFFERING_DISPLAY: Record<OfferingName, string> = {
  Data: 'Data Transformation',
  AI: 'AI Integration',
  AMM: 'Application Migration & Modernization',
  DPDE: 'Digital Product Design & Engineering',
};

export const EnterpriseAdvantage: React.FC<EnterpriseAdvantageProps> = ({ primaryOffering }) => {
  const prefersReducedMotion = useReducedMotion();

  const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const fadeIn = (delay: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.5, ease: easing },
        };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

      <div className="p-5 sm:p-6 lg:p-8">
        {/* Section header */}
        <motion.div {...fadeIn(0)} className="flex items-center gap-2 mb-6">
          <Enterprise size={18} className="text-blue-600" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Powered by IBM Enterprise Advantage
          </h3>
        </motion.div>

        {/* IEA 3D Diagram Image */}
        <motion.div {...fadeIn(0.15)} className="flex justify-center">
          <img
            src="/media/images/IEA.png"
            alt="IBM Enterprise Advantage — 3-layer stack: IBM Consulting Advantage, Advantage Marketplace, and High Value Consulting Services"
            className="w-full max-w-3xl rounded-lg"
            loading="lazy"
          />
        </motion.div>

        {/* Contextual tagline */}
        <motion.div {...fadeIn(0.3)} className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Your <span className="font-semibold text-blue-700">{OFFERING_DISPLAY[primaryOffering]}</span> transformation
            journey is powered by IBM Enterprise Advantage — combining platform, marketplace, and consulting expertise
            to accelerate delivery at scale.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

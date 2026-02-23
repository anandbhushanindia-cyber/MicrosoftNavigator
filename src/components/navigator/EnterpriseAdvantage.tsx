import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Enterprise, ZoomIn, Close } from '@carbon/icons-react';
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
  const [isZoomed, setIsZoomed] = useState(false);

  const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const fadeIn = (delay: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.5, ease: easing },
        };

  const openZoom = useCallback(() => setIsZoomed(true), []);
  const closeZoom = useCallback(() => setIsZoomed(false), []);

  // Close on Escape key
  useEffect(() => {
    if (!isZoomed) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeZoom();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isZoomed, closeZoom]);

  // Prevent body scroll when zoomed
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isZoomed]);

  return (
    <>
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

          {/* IEA 3D Diagram Image — clickable to zoom */}
          <motion.div {...fadeIn(0.15)} className="flex justify-center">
            <div
              className="relative group cursor-zoom-in w-full max-w-3xl"
              onClick={openZoom}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openZoom(); }}
              aria-label="Click to enlarge IBM Enterprise Advantage diagram"
            >
              <img
                src="/media/images/IEA.png"
                alt="IBM Enterprise Advantage — 3-layer stack: IBM Consulting Advantage, Advantage Marketplace, and High Value Consulting Services"
                className="w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              {/* Zoom hint overlay */}
              <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                  <ZoomIn size={20} className="text-gray-700" />
                </div>
              </div>
            </div>
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

      {/* ─── Lightbox / Zoom Overlay ─── */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeZoom}
          >
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); closeZoom(); }}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
              aria-label="Close zoomed view"
            >
              <Close size={24} className="text-gray-800" />
            </button>

            {/* Zoomed image */}
            <motion.img
              src="/media/images/IEA.png"
              alt="IBM Enterprise Advantage — 3-layer stack: IBM Consulting Advantage, Advantage Marketplace, and High Value Consulting Services"
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Hint text */}
            <motion.p
              className="absolute bottom-6 text-white/60 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Click anywhere or press Esc to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

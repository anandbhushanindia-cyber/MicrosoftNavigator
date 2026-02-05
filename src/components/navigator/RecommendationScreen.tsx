import React, { useMemo, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Rocket, 
  Download, 
  Video, 
  Phone, 
  QrCode,
  RotateCcw,
  Info,
  Eye,
  Zap,
  Target,
  Package,
  Link2,
  ArrowRight
} from 'lucide-react';
import type { Recommendation, LeadershipMode } from '../../types/navigator.types';

interface RecommendationScreenProps {
  recommendation: Recommendation;
  leadershipMode: LeadershipMode;
  onToggleMode: () => void;
  onReset: () => void;
}

export const RecommendationScreen: React.FC<RecommendationScreenProps> = ({
  recommendation,
  leadershipMode,
  onToggleMode,
  onReset,
}) => {
  const { primary, complementary, confidence } = recommendation;
  const viewData = leadershipMode === 'leadership' ? primary.leadershipView : primary.technicalView;

  const prefersReducedMotion = useReducedMotion();

  const [displayConfidence, setDisplayConfidence] = useState(0);
  const [isHoveringQR, setIsHoveringQR] = useState(false);
  const [isQRExpanded, setIsQRExpanded] = useState(false);
  const [isWhyExpanded, setIsWhyExpanded] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayConfidence(confidence);
      return;
    }

    let current = 0;
    const increment = confidence / 60;
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= confidence) {
        setDisplayConfidence(confidence);
        clearInterval(interval);
      } else {
        setDisplayConfidence(Math.floor(current));
      }
    }, 15);

    return () => clearInterval(interval);
  }, [confidence, prefersReducedMotion]);

  const qrTimestamp = useMemo(() => Date.now().toString(), []);
  const personalizedURL = useMemo(() => {
    const baseURL = 'https://ibm.com/transformation-path';
    const params = new URLSearchParams({
      offering: primary.id,
      confidence: confidence.toString(),
      mode: leadershipMode,
      timestamp: qrTimestamp,
    });
    return `${baseURL}?${params.toString()}`;
  }, [primary.id, confidence, leadershipMode, qrTimestamp]);

  const confidenceBreakdown = useMemo(
    () => [
      { label: 'Industry Fit', value: 40 },
      { label: 'Pain Severity', value: 35 },
      { label: 'Readiness Signals', value: 25 },
    ],
    []
  );

  const splitSignal = (signal: string) => {
    const separators = [' - ', ': '];
    for (const separator of separators) {
      if (signal.includes(separator)) {
        const [title, ...rest] = signal.split(separator);
        return { title: title.trim(), description: rest.join(separator).trim() };
      }
    }
    return { title: signal.trim(), description: 'Learn more about this offering.' };
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 sm:mb-8 lg:mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            {/* Title */}
            <div>
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider">
                  Personalized Recommendation
                </span>
              </motion.div>
              <motion.h1
                initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.3, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 sm:mt-4 mb-2 sm:mb-3"
              >
                Your Transformation Path
              </motion.h1>
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.4, duration: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-gray-600"
              >
                Recommended based on your business priorities
              </motion.p>
            </div>

            {/* View Toggle */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.5, duration: 0.6 }}
              className="flex-shrink-0"
            >
              <motion.button
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                onClick={onToggleMode}
                type="button"
                className="group relative overflow-hidden bg-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">View Mode</div>
                    <div className="text-sm font-bold text-gray-900">
                      {leadershipMode === 'leadership' ? 'Leadership' : 'Technical'}
                    </div>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10">
          
          {/* PRIMARY CARD */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 xl:col-span-8 relative"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl blur-2xl opacity-20" />
            
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Top Gradient Bar */}
              <div className="h-1.5 sm:h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              
              <div className="p-6 sm:p-8 lg:p-10">
                {/* Header with Icon */}
                <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <motion.div
                    initial={prefersReducedMotion ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.8, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl flex-shrink-0"
                  >
                    <span className="text-3xl sm:text-4xl">{primary.icon}</span>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 sm:mb-2">
                      Primary Recommendation
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                      {primary.name}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600">
                      {primary.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Confidence Meter */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: 1, duration: 0.6 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            Recommendation Confidence
                          </div>
                          <div className="text-xs text-gray-500">
                            Based on multiple factors
                          </div>
                        </div>
                      </div>
                      <motion.div
                        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.2, type: "spring" }}
                        className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                      >
                        {displayConfidence}%
                      </motion.div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div
                      className="relative h-3 sm:h-4 bg-white rounded-full overflow-hidden shadow-inner"
                      role="progressbar"
                      aria-valuenow={displayConfidence}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Recommendation confidence"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${displayConfidence}%` }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.5, ease: "easeOut", delay: 1 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                      >
                        {/* Shimmer */}
                        <motion.div
                          animate={prefersReducedMotion ? { x: '0%' } : { x: ['0%', '200%'] }}
                          transition={prefersReducedMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                      </motion.div>
                    </div>

                    {/* Confidence Breakdown */}
                    <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
                      {confidenceBreakdown.map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <div className="w-28 sm:w-32 text-xs sm:text-sm text-gray-600 font-semibold">
                            {item.label}
                          </div>
                          <div className="flex-1 h-2 sm:h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.2, ease: "easeOut", delay: 1.1 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            />
                          </div>
                          <div className="w-10 text-right text-xs sm:text-sm font-semibold text-gray-700">
                            {item.value}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Problem → Solution Cards */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {/* Challenge */}
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.2, duration: 0.5 }}
                    className="group bg-gradient-to-br from-red-50 to-rose-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-red-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1 sm:mb-2">
                        Your Challenge
                      </div>
                      <ul className="text-sm sm:text-base text-gray-800 leading-relaxed list-disc pl-5 space-y-1">
                        {viewData.problem
                          .split(/[.;]\s+/)
                          .filter(Boolean)
                          .map((point, index) => (
                            <li key={`${primary.id}-problem-${index}`}>{point.trim()}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                  {/* Solution */}
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.3, duration: 0.5 }}
                    className="group bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-emerald-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 sm:mb-2">
                        IBM + Microsoft Solution
                      </div>
                      <ul className="text-sm sm:text-base text-gray-800 leading-relaxed list-disc pl-5 space-y-1">
                        {viewData.solution
                          .split(/[.;]\s+/)
                          .filter(Boolean)
                          .map((point, index) => (
                            <li key={`${primary.id}-solution-${index}`}>{point.trim()}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                  {/* Approach */}
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.4, duration: 0.5 }}
                    className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 sm:mb-2">
                        Delivery Approach
                      </div>
                      <ul className="text-sm sm:text-base text-gray-800 leading-relaxed list-disc pl-5 space-y-1">
                        {viewData.approach
                          .split(/[.;]\s+/)
                          .filter(Boolean)
                          .map((point, index) => (
                            <li key={`${primary.id}-approach-${index}`}>{point.trim()}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
                </div>

                {/* Why This Recommendation */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.45, duration: 0.5 }}
                  className="mb-6 sm:mb-8"
                >
                  <button
                    type="button"
                    onClick={() => setIsWhyExpanded((prev) => !prev)}
                    aria-expanded={isWhyExpanded}
                    className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm sm:text-base font-bold text-gray-900">Why this recommendation?</div>
                        <div className="text-xs sm:text-sm text-gray-500">Evidence behind the match</div>
                      </div>
                    </div>
                    <motion.div
                      animate={prefersReducedMotion ? { rotate: 0 } : { rotate: isWhyExpanded ? 180 : 0 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                      className="text-gray-400"
                    >
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" />
                    </motion.div>
                  </button>

                  {isWhyExpanded && (
                    <motion.div
                      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }}
                      className="mt-3 sm:mt-4 bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5"
                    >
                      <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          <span>{viewData.problem}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          <span>{viewData.solution}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                          <span>{viewData.approach}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Action Buttons */}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.5, duration: 0.5 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3"
              >
                {[
                  { icon: Download, label: 'Download', color: 'from-blue-500 to-blue-600' },
                  { icon: Video, label: 'Demo', color: 'from-purple-500 to-purple-600' },
                  { icon: Phone, label: 'Connect', color: 'from-green-500 to-green-600' },
                  { icon: QrCode, label: 'QR Code', color: 'from-gray-700 to-gray-800' }
                ].map((btn) => {
                  const Icon = btn.icon;
                  return (
                    <motion.button
                      key={btn.label}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                      onMouseEnter={() => btn.label === 'QR Code' && setIsHoveringQR(true)}
                      onMouseLeave={() => btn.label === 'QR Code' && setIsHoveringQR(false)}
                      onClick={() => btn.label === 'QR Code' && setIsQRExpanded((prev) => !prev)}
                      type="button"
                      aria-haspopup={btn.label === 'QR Code' ? 'dialog' : undefined}
                      aria-expanded={btn.label === 'QR Code' ? isQRExpanded : undefined}
                      aria-label={btn.label === 'Download' ? `Download ${primary.name} brief` : btn.label}
                      className={`relative group bg-gradient-to-r ${btn.color} text-white px-3 sm:px-4 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all overflow-visible`}
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-xl" />
                      <div className="relative flex flex-col items-center gap-1">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-xs">{btn.label}</span>
                      </div>

                      {/* QR Code Popup */}
                      {btn.label === 'QR Code' && (isHoveringQR || isQRExpanded) && (
                        <motion.div
                          initial={prefersReducedMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={prefersReducedMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute bottom-full left-1 -translate-x-1/2 mb-4 z-50 pointer-events-none"
                        >
                          <div className="bg-white p-4 rounded-2xl shadow-2xl border-4 border-gray-800">
                            <QRCodeSVG
                              value={personalizedURL}
                              size={140}
                              level="H"
                              includeMargin={true}
                              bgColor="#FFFFFF"
                              fgColor="#000000"
                            />
                            <div className="text-center mt-2 text-xs font-semibold text-gray-700">
                              Scan for Details
                            </div>
                          </div>
                          {/* Arrow pointer */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:space-y-8">
            
            {/* Key Capabilities */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.8, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition" />
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Key Capabilities</h3>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {primary.capabilities.slice(0, 4).map((capability, idx) => (
                    <motion.li
                      key={`${capability}-${idx}`}
                      initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { delay: 1 + idx * 0.1, duration: 0.5 }}
                      className="flex items-start gap-2 sm:gap-3 group/item"
                    >
                      <motion.div
                        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.1 + idx * 0.1, type: "spring" }}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md group-hover/item:scale-110 transition-transform"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </motion.div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                        {capability}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* What IBM Offers */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { delay: 1, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition" />
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">What IBM Offers</h3>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {primary.readinessSignals.slice(0, 4).map((signal, idx) => (
                    <motion.li
                      key={`${signal}-${idx}`}
                      initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.2 + idx * 0.1, duration: 0.5 }}
                      className="flex items-start gap-2 sm:gap-3 group/item"
                    >
                      <motion.div
                        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.3 + idx * 0.1, type: "spring" }}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md group-hover/item:scale-110 transition-transform"
                      >
                        <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={`${personalizedURL}&signal=${encodeURIComponent(splitSignal(signal).title)}`}
                          className="text-sm sm:text-base font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
                          aria-label={`Learn more about ${splitSignal(signal).title}`}
                        >
                          {splitSignal(signal).title}
                        </a>
                        <div className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">
                          {splitSignal(signal).description}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Complementary Offerings */}
            {complementary.length > 0 && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.2, duration: 0.8 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition" />
                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Also Consider</h3>
                  </div>
                  <div className="space-y-3">
                    {complementary.map((offering, idx) => (
                      <motion.button
                        key={offering.id}
                        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.4 + idx * 0.1, duration: 0.5 }}
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.02, x: 4 }}
                        type="button"
                        aria-label={`View ${offering.name}`}
                        className="w-full text-left flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group/offer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                          {offering.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm sm:text-base text-gray-900 truncate">
                            {offering.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {offering.shortDescription}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover/offer:text-purple-600 group-hover/offer:translate-x-1 transition-all flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { delay: 1.6, duration: 0.6 }}
          className="mt-6 sm:mt-8 lg:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100"
        >
          <button
            onClick={onReset}
            type="button"
            className="group flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg sm:rounded-xl transition-all w-full sm:w-auto justify-center sm:justify-start"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-rotate-180 transition-transform duration-500" />
            <span className="text-sm sm:text-base">Start Over</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-xs sm:text-sm text-center sm:text-left">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
            <span>Your personalized transformation roadmap is ready</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

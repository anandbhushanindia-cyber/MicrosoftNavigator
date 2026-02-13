import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Sparkles,
  TrendingUp,
  RotateCcw,
  QrCode,
  ArrowRight,
  Layers,
  Cpu,
  AlertTriangle,
  CheckCircle,
  ArrowRightCircle,
  Zap,
  Play,
  FileImage,
  FileText,
  Wrench,
  Monitor,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Recommendation, IBMOffer, OfferingName } from '../../types/navigator.types';
import { EditableText } from '../admin/EditableText';
import { EditableList } from '../admin/EditableList';

interface RecommendationScreenProps {
  recommendation: Recommendation;
  onReset: () => void;
}

// Color palette for signal path bars
const SIGNAL_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-500',
];

// Offering display labels and colors
const OFFERING_LABELS: Record<OfferingName, string> = {
  Data: 'Data Transformation',
  AI: 'AI Integration',
  AMM: 'Application Migration & Modernization',
  DPDE: 'Digital Product Design & Engineering',
};

const OFFERING_COLORS: Record<OfferingName, string> = {
  Data: 'from-blue-500 to-cyan-600',
  AI: 'from-violet-500 to-purple-600',
  AMM: 'from-orange-500 to-red-500',
  DPDE: 'from-emerald-500 to-teal-600',
};

const OFFERING_BG_COLORS: Record<OfferingName, string> = {
  Data: 'bg-blue-50 border-blue-200 text-blue-700',
  AI: 'bg-violet-50 border-violet-200 text-violet-700',
  AMM: 'bg-orange-50 border-orange-200 text-orange-700',
  DPDE: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

// Map offer type to icon
const OFFER_TYPE_ICONS: Record<IBMOffer['type'], React.ReactNode> = {
  video: <Play className="w-5 h-5" />,
  demo: <Monitor className="w-5 h-5" />,
  architecture: <FileImage className="w-5 h-5" />,
  document: <FileText className="w-5 h-5" />,
  tool: <Wrench className="w-5 h-5" />,
};

const OFFER_TYPE_LABELS: Record<IBMOffer['type'], string> = {
  video: 'Video',
  demo: 'Live Demo',
  architecture: 'Architecture',
  document: 'Document',
  tool: 'Tool',
};

// Media component with graceful fallback
const MediaDisplay: React.FC<{ offer: IBMOffer }> = ({ offer }) => {
  const [hasError, setHasError] = useState(false);

  const isVideo = offer.type === 'video' || offer.type === 'demo';

  if (hasError || !offer.mediaUrl) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 border border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-400">
          {OFFER_TYPE_ICONS[offer.type]}
        </div>
        <span className="text-sm font-medium text-slate-500">
          {OFFER_TYPE_LABELS[offer.type]} — Coming Soon
        </span>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
        <video
          src={offer.mediaUrl}
          poster={offer.thumbnailUrl || '/media/placeholder.svg'}
          controls
          muted
          playsInline
          preload="metadata"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Image-based (architecture, tool, document)
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
      <img
        src={offer.mediaUrl}
        alt={offer.title}
        onError={() => setHasError(true)}
        className="w-full h-full object-contain p-2"
        loading="lazy"
      />
    </div>
  );
};

// --- Type-based grouping utility ---
const OFFER_TYPE_ORDER: IBMOffer['type'][] = ['demo', 'architecture', 'tool', 'video', 'document'];

const groupOffersByType = (offers: IBMOffer[]): { type: IBMOffer['type']; items: IBMOffer[] }[] => {
  const grouped: Partial<Record<IBMOffer['type'], IBMOffer[]>> = {};
  for (const offer of offers) {
    if (!grouped[offer.type]) grouped[offer.type] = [];
    grouped[offer.type]!.push(offer);
  }
  return OFFER_TYPE_ORDER
    .filter(type => grouped[type] && grouped[type]!.length > 0)
    .map(type => ({ type, items: grouped[type]! }));
};

// --- Offer Type Carousel Container ---
const OfferTypeCarousel: React.FC<{
  type: IBMOffer['type'];
  items: IBMOffer[];
  prefersReducedMotion: boolean | null;
  animDelay: number;
}> = ({ type, items, prefersReducedMotion, animDelay }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = items.length > 1;

  const goNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const currentItem = items[activeIndex];

  // Swipe support via pointer events
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (hasMultiple) setDragStartX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX !== null && hasMultiple) {
      const diff = e.clientX - dragStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) goNext();
        else goPrev();
      }
      setDragStartX(null);
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { delay: animDelay, duration: 0.6 }}
      className="group relative"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
        {/* Type Badge Header */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wide">
            {OFFER_TYPE_ICONS[type]}
            {OFFER_TYPE_LABELS[type]}
          </span>
          {hasMultiple && (
            <span className="text-xs font-semibold text-gray-400">
              {activeIndex + 1} / {items.length}
            </span>
          )}
        </div>

        {/* Swipeable content area */}
        <div
          className="relative flex-1 flex flex-col"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          style={{ touchAction: hasMultiple ? 'pan-y' : 'auto' }}
        >
          {/* Navigation arrows (only when multiple items) */}
          {hasMultiple && (
            <>
              <button
                onClick={goPrev}
                type="button"
                aria-label="Previous item"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-all min-h-[44px] min-w-[44px]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                type="button"
                aria-label="Next item"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-all min-h-[44px] min-w-[44px]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' }}
              className="flex-1 flex flex-col"
            >
              {/* Media Area */}
              <div className="px-5 py-2">
                <MediaDisplay offer={currentItem} />
              </div>

              {/* Content */}
              <div className="px-5 pt-3 pb-2 flex-1">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 leading-snug">
                  {currentItem.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentItem.description}
                </p>
              </div>

              {/* QR Code */}
              <div className="px-5 pb-4 pt-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <QRCodeSVG
                    value={currentItem.referenceUrl}
                    size={72}
                    level="M"
                    includeMargin={false}
                    bgColor="#F9FAFB"
                    fgColor="#1E293B"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-700 mb-0.5">Scan for details</div>
                    <div className="text-[11px] text-gray-400 truncate">{currentItem.referenceUrl}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators (only when multiple items) */}
        {hasMultiple && (
          <div className="flex items-center justify-center gap-2 pb-4 pt-1">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to item ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all min-h-[20px] min-w-[20px] flex items-center justify-center ${
                  idx === activeIndex
                    ? 'bg-indigo-500 scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                <span className={`block w-2.5 h-2.5 rounded-full ${
                  idx === activeIndex ? 'bg-indigo-500' : 'bg-gray-300'
                }`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const RecommendationScreen: React.FC<RecommendationScreenProps> = ({
  recommendation,
  onReset,
}) => {
  const {
    scenarioTitle,
    subScenarioText,
    primaryOffering,
    supportingOffering,
    optionalOffering,
    offeringScores,
    primarySignalPath,
    primaryRecommendation,
    primaryDescription,
    primaryTechStack,
    supportingSignalPath,
    supportingCapability,
    supportingDescription,
    confidence,
    signalScores,
    challenges,
    solutions,
    approach,
    capabilities,
    ibmOffers,
  } = recommendation;

  const prefersReducedMotion = useReducedMotion();
  const [displayConfidence, setDisplayConfidence] = useState(0);

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
      signal: primarySignalPath,
      confidence: confidence.toString(),
      ts: qrTimestamp,
    });
    return `${baseURL}?${params.toString()}`;
  }, [primarySignalPath, confidence, qrTimestamp]);

  const totalScore = signalScores.reduce((sum, s) => sum + s.score, 0);

  // Animation helpers
  const fadeIn = (delay: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 overflow-x-hidden">
      <div className="max-w-[1800px] mx-auto">

        {/* ─── HEADER ─── */}
        <motion.div {...fadeIn(0.1)} className="mb-6 lg:mb-8">
          <motion.div
            {...fadeIn(0.15)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider">
              <EditableText labelKey="results.badge" as="span" className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider" />
            </span>
          </motion.div>
          <motion.h1 {...fadeIn(0.2)} className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2">
            <EditableText labelKey="results.heading" as="span" className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900" />
          </motion.h1>
          <motion.p {...fadeIn(0.25)} className="text-base sm:text-lg lg:text-xl text-gray-600">
            For your challenge: &ldquo;{scenarioTitle}&rdquo; &mdash; {subScenarioText}
          </motion.p>
        </motion.div>

        {/* ─── PRIMARY RECOMMENDATION BANNER ─── */}
        <motion.div {...fadeIn(0.35)} className="relative mb-8 lg:mb-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl blur-2xl opacity-15" />
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
                {/* Left: Recommendation info */}
                <div className="flex-1 min-w-0 mb-6 lg:mb-0">
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold">
                      <Layers className="w-4 h-4" />
                      {primarySignalPath}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {primaryRecommendation}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {primaryDescription}
                  </p>
                </div>

                {/* Right: Solution Coverage Meter */}
                <div className="lg:w-[320px] xl:w-[360px] shrink-0">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            <EditableText labelKey="results.solutionOptics" as="span" className="text-sm font-semibold text-gray-900" />
                          </div>
                          <div className="text-xs text-gray-500">
                            <EditableText labelKey="results.basedOnResponses" as="span" className="text-xs text-gray-500" />
                          </div>
                        </div>
                      </div>
                      <motion.div
                        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.8, type: 'spring' }}
                        className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                      >
                        {displayConfidence}%
                      </motion.div>
                    </div>
                    <div
                      className="relative h-3 bg-white rounded-full overflow-hidden shadow-inner"
                      role="progressbar"
                      aria-valuenow={displayConfidence}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${displayConfidence}%` }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.5, ease: 'easeOut', delay: 0.6 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                      >
                        <motion.div
                          animate={prefersReducedMotion ? { x: '0%' } : { x: ['0%', '200%'] }}
                          transition={prefersReducedMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── OFFERING SCORES ─── */}
        <motion.div {...fadeIn(0.42)} className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {offeringScores.filter(o => o.score > 0).map((item, idx) => {
              const isPrimary = item.offering === primaryOffering;
              const isSupporting = item.offering === supportingOffering;
              const isOptional = item.offering === optionalOffering;
              const maxScore = offeringScores[0]?.score || 1;
              const pct = Math.round((item.score / maxScore) * 100);

              return (
                <motion.div
                  key={item.offering}
                  initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.5 + idx * 0.08, type: 'spring' }}
                  className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all ${
                    isPrimary
                      ? 'bg-white border-indigo-300 shadow-lg ring-2 ring-indigo-100'
                      : 'bg-white border-gray-100 shadow-md'
                  }`}
                >
                  {/* Badge */}
                  {(isPrimary || isSupporting || isOptional) && (
                    <div className="absolute -top-2.5 left-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isPrimary
                          ? 'bg-indigo-600 text-white'
                          : isSupporting
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {isPrimary ? 'Primary' : isSupporting ? 'Supporting' : 'Optional'}
                      </span>
                    </div>
                  )}

                  <div className="mt-1">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold mb-3 ${OFFERING_BG_COLORS[item.offering]}`}>
                      {item.offering}
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">
                      {OFFERING_LABELS[item.offering]}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, ease: 'easeOut', delay: 0.6 + idx * 0.1 }}
                          className={`h-full bg-gradient-to-r ${OFFERING_COLORS[item.offering]} rounded-full`}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-10 text-right">{item.score}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ─── THREE CARDS: CHALLENGE / SOLUTION / APPROACH ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 mb-8 lg:mb-10">
          {/* Your Challenge */}
          <motion.div {...fadeIn(0.5)} className="relative">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-rose-500 to-red-500" />
              <div className="p-5 sm:p-6 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center shadow-md shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    <EditableText labelKey="results.yourChallenge" as="span" className="text-lg sm:text-xl font-bold text-gray-900" />
                  </h3>
                </div>
                <EditableList
                  items={challenges}
                  onSave={() => {}}
                  className="space-y-3"
                  renderItem={(item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  )}
                />
              </div>
            </div>
          </motion.div>

          {/* IBM + Microsoft Solution */}
          <motion.div {...fadeIn(0.6)} className="relative">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-500" />
              <div className="p-5 sm:p-6 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-md shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    <EditableText labelKey="results.ibmSolution" as="span" className="text-lg sm:text-xl font-bold text-gray-900" />
                  </h3>
                </div>
                <EditableList
                  items={solutions}
                  onSave={() => {}}
                  className="space-y-3"
                  renderItem={(item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  )}
                />
              </div>
            </div>
          </motion.div>

          {/* Delivery Approach */}
          <motion.div {...fadeIn(0.7)} className="relative">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="p-5 sm:p-6 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shrink-0">
                    <ArrowRightCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    <EditableText labelKey="results.deliveryApproach" as="span" className="text-lg sm:text-xl font-bold text-gray-900" />
                  </h3>
                </div>
                <EditableList
                  items={approach}
                  onSave={() => {}}
                  className="space-y-3"
                  renderItem={(item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-0.5 w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                      </span>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  )}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── KEY CAPABILITIES + TECH STACK ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-8 lg:mb-10">
          {/* Key Capabilities */}
          {capabilities.length > 0 && (
            <motion.div {...fadeIn(0.8)}>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <EditableText labelKey="results.keyCapabilities" as="span" className="text-sm font-bold text-gray-700 uppercase tracking-wider" />
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {capabilities.map((cap, idx) => (
                    <motion.span
                      key={cap}
                      initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.9 + idx * 0.05, type: 'spring' }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 text-sm font-semibold"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {cap}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tech Stack */}
          {primaryTechStack.length > 0 && (
            <motion.div {...fadeIn(0.85)}>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <EditableText labelKey="results.techStack" as="span" className="text-sm font-bold text-gray-700 uppercase tracking-wider" />
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {primaryTechStack.map((tech, idx) => (
                    <motion.span
                      key={tech}
                      initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.95 + idx * 0.05, type: 'spring' }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ─── WHAT IBM OFFERS — TYPE-BASED CONTAINERS ─── */}
        {ibmOffers.length > 0 && (() => {
          const offerGroups = groupOffersByType(ibmOffers);
          return (
            <motion.div {...fadeIn(1.0)} className="mb-8 lg:mb-10">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-5 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-indigo-500" />
                <EditableText labelKey="results.whatIbmOffers" as="span" className="text-sm font-bold text-gray-700 uppercase tracking-wider" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {offerGroups.map((group, idx) => (
                  <OfferTypeCarousel
                    key={group.type}
                    type={group.type}
                    items={group.items}
                    prefersReducedMotion={prefersReducedMotion}
                    animDelay={1.1 + idx * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          );
        })()}

        {/* ─── SIGNAL PATH ANALYSIS + SUPPORTING CAPABILITY ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-8 lg:mb-10">
          {/* Signal Path Analysis */}
          <motion.div {...fadeIn(1.3)}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                <EditableText labelKey="results.signalAnalysis" as="span" className="text-sm font-bold text-gray-700 uppercase tracking-wider" />
              </h3>
              <div className="space-y-3">
                {signalScores.map((signal, idx) => {
                  const pct = totalScore > 0 ? Math.round((signal.score / totalScore) * 100) : 0;
                  const colorClass = SIGNAL_COLORS[idx % SIGNAL_COLORS.length];
                  const isPrimary = idx === 0;

                  return (
                    <div key={signal.signalPath} className="flex items-center gap-3">
                      <div className="w-36 sm:w-44 text-xs sm:text-sm text-gray-700 font-medium truncate">
                        {isPrimary && <span className="text-indigo-600 mr-1">&#9679;</span>}
                        {signal.signalPath}
                      </div>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, ease: 'easeOut', delay: 1.4 + idx * 0.08 }}
                          className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
                        />
                      </div>
                      <div className="w-14 text-right text-xs sm:text-sm font-semibold text-gray-600">
                        {signal.score} pts
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Supporting Capability */}
          {supportingSignalPath && (
            <motion.div {...fadeIn(1.35)}>
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-15 transition" />
                <div className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md shrink-0">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-0.5">
                        <EditableText labelKey="results.supportingCapability" as="span" className="text-xs font-bold text-purple-600 uppercase tracking-wider" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {supportingCapability}
                      </h3>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium">
                      <Layers className="w-3.5 h-3.5" />
                      {supportingSignalPath}
                    </span>
                  </div>

                  {supportingDescription && (
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {supportingDescription}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ─── ACTION BAR ─── */}
        <motion.div
          {...fadeIn(1.5)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 p-5 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          {/* QR Code Button */}
          <div className="relative">
            <QRCodeButton personalizedURL={personalizedURL} prefersReducedMotion={!!prefersReducedMotion} />
          </div>

          {/* Start Over */}
          <button
            onClick={onReset}
            type="button"
            className="group flex items-center gap-3 px-8 sm:px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 active:from-blue-600 active:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg min-h-[56px] text-base sm:text-lg"
          >
            <RotateCcw className="w-5 h-5 group-active:-rotate-180 transition-transform duration-500" />
            <EditableText labelKey="results.startOver" as="span" className="font-semibold" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// QR Code button with popup
const QRCodeButton: React.FC<{ personalizedURL: string; prefersReducedMotion: boolean }> = ({
  personalizedURL,
  prefersReducedMotion,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.button
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      onClick={() => setIsExpanded(prev => !prev)}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isExpanded}
      className="relative group bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-4 rounded-xl font-semibold shadow-lg active:shadow-xl transition-all min-h-[56px]"
    >
      <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity rounded-xl" />
      <div className="relative flex items-center gap-2">
        <QrCode className="w-5 h-5" />
        <span className="text-base"><EditableText labelKey="results.scanReport" as="span" className="text-base" /></span>
      </div>

      {isExpanded && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-50 pointer-events-none"
        >
          <div className="bg-white p-4 rounded-2xl shadow-2xl border-4 border-gray-800">
            <QRCodeSVG
              value={personalizedURL}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
            <div className="text-center mt-2 text-xs font-semibold text-gray-700">
              Scan for Details
            </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
        </motion.div>
      )}
    </motion.button>
  );
};

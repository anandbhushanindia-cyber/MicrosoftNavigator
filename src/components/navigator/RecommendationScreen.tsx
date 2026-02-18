import React, { useState, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RotateCcw,
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
  Database,
  Bot,
  RefreshCw,
  Blocks,
} from 'lucide-react';
import type { Recommendation, IBMOffer, OfferingName } from '../../types/navigator.types';
import { EditableText } from '../admin/EditableText';
import { EditableList } from '../admin/EditableList';
import { DocumentCard } from './DocumentCard';
import { ZoomableMediaModal } from './ZoomableMediaModal';
import { useArtifacts } from '../../hooks/useArtifacts';
import { AnimatedBackground } from '../visualizations/AnimatedBackground';

interface RecommendationScreenProps {
  recommendation: Recommendation;
  onReset: () => void;
}

// Offering display labels and colors
const OFFERING_LABELS: Record<OfferingName, string> = {
  Data: 'Data Transformation',
  AI: 'AI Integration',
  AMM: 'Application Migration & Modernization',
  DPDE: 'Digital Product Design & Engineering',
};

const OFFERING_ICON_CONFIG: Record<OfferingName, {
  icon: React.ReactNode;
  bg: string;
}> = {
  Data: {
    icon: <Database className="w-8 h-8 text-white" />,
    bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  },
  AI: {
    icon: <Bot className="w-8 h-8 text-white" />,
    bg: 'bg-gradient-to-br from-violet-500 to-purple-600',
  },
  AMM: {
    icon: <RefreshCw className="w-8 h-8 text-white" />,
    bg: 'bg-gradient-to-br from-orange-500 to-red-500',
  },
  DPDE: {
    icon: <Blocks className="w-8 h-8 text-white" />,
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  },
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

// Detect file extension from URL
const getFileExt = (url?: string): string =>
  (url?.split('?')[0]?.split('.').pop() || '').toLowerCase();

// Media component with graceful fallback — supports PNG, MP4, PDF, PPTX, XLSX
const MediaDisplay: React.FC<{ offer: IBMOffer; onZoom?: (offer: IBMOffer) => void }> = ({ offer, onZoom }) => {
  const [hasError, setHasError] = useState(false);

  const ext = offer.fileType || getFileExt(offer.mediaUrl);
  const isVideo = ext === 'mp4' || ext === 'webm' || offer.type === 'video' || offer.type === 'demo';
  const isPdf = ext === 'pdf';
  const isOfficeDoc = ext === 'pptx' || ext === 'xlsx';
  const isImage = ['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(ext);

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
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-black cursor-pointer"
        onClick={() => onZoom?.(offer)}
      >
        <video
          src={offer.mediaUrl}
          poster={offer.thumbnailUrl}
          controls
          muted
          playsInline
          preload="metadata"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-medium text-white/80 pointer-events-none">
          Click to expand
        </div>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-200 cursor-pointer"
        onClick={() => onZoom?.(offer)}
      >
        <iframe
          src={offer.mediaUrl}
          title={offer.title}
          className="w-full h-full pointer-events-none"
          style={{ border: 'none' }}
        />
        <div className="absolute inset-0 bg-transparent" />
        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-medium text-slate-600 shadow-sm">
          PDF — Click to expand
        </div>
      </div>
    );
  }

  if (isOfficeDoc) {
    return (
      <DocumentCard
        url={offer.mediaUrl}
        fileName={offer.title}
        description={offer.description}
        fileSize={offer.fileSize}
        fileType={ext as 'pptx' | 'xlsx'}
      />
    );
  }

  if (isImage) {
    return (
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-200 cursor-pointer"
        onClick={() => onZoom?.(offer)}
      >
        <img
          src={offer.mediaUrl}
          alt={offer.title}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain p-2"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-medium text-slate-600 shadow-sm">
          Click to zoom
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 border border-slate-200">
      <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-400">
        {OFFER_TYPE_ICONS[offer.type]}
      </div>
      <span className="text-sm font-medium text-slate-500">{offer.title}</span>
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

// --- Offer Type Carousel Container (QR code removed) ---
const OfferTypeCarousel: React.FC<{
  type: IBMOffer['type'];
  items: IBMOffer[];
  prefersReducedMotion: boolean | null;
  animDelay: number;
  onZoom?: (offer: IBMOffer) => void;
}> = ({ type, items, prefersReducedMotion, animDelay, onZoom }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = items.length > 1;

  const goNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const currentItem = items[activeIndex];

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
                <MediaDisplay offer={currentItem} onZoom={onZoom} />
              </div>

              {/* Content */}
              <div className="px-5 pt-3 pb-4 flex-1">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 leading-snug">
                  {currentItem.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentItem.description}
                </p>
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
    challenges,
    solutions,
    approach,
    capabilities,
    ibmOffers: staticOffers,
  } = recommendation;

  // Dynamically load artifacts from Azure Blob Storage (falls back to static)
  const { offers: dynamicOffers, isLoading: artifactsLoading } = useArtifacts(
    recommendation.offeringGroup,
    staticOffers,
  );
  const ibmOffers = dynamicOffers;

  const prefersReducedMotion = useReducedMotion();

  // Zoom modal state
  const [zoomOffer, setZoomOffer] = useState<IBMOffer | null>(null);
  const handleZoom = useCallback((offer: IBMOffer) => {
    setZoomOffer(offer);
  }, []);

  // Animation helpers
  const fadeIn = (delay: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">

      {/* Animated Background Visualization */}
      <AnimatedBackground variant="reveal" />

      {/* ─── PAGE CONTENT ─── */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
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
              <div className="mb-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold">
                  <Layers className="w-4 h-4" />
                  {primarySignalPath}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {primaryRecommendation}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-4xl">
                {primaryDescription}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── OFFERING SCORES — with icons instead of bars ─── */}
        <motion.div {...fadeIn(0.42)} className="mb-8 lg:mb-10">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            IBM&apos;s Offerings That Meet Your Current Requirements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {offeringScores.filter(o => o.score > 0).map((item, idx) => {
              const isPrimary = item.offering === primaryOffering;
              const isSupporting = item.offering === supportingOffering;
              const isOptional = item.offering === optionalOffering;
              const iconConfig = OFFERING_ICON_CONFIG[item.offering];

              return (
                <motion.div
                  key={item.offering}
                  initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.5 + idx * 0.08, type: 'spring' }}
                  className={`relative rounded-2xl p-5 sm:p-6 border-2 transition-all ${
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

                  <div className="mt-1 flex flex-col items-center text-center">
                    {/* Large Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${iconConfig.bg} flex items-center justify-center shadow-lg mb-4`}>
                      {iconConfig.icon}
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {OFFERING_LABELS[item.offering]}
                    </h4>
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

        {/* ─── WHAT IBM OFFERS — TYPE-BASED CONTAINERS (no QR codes) ─── */}
        {(ibmOffers.length > 0 || artifactsLoading) && (
          <motion.div {...fadeIn(1.0)} className="mb-8 lg:mb-10">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-5 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-indigo-500" />
              <EditableText labelKey="results.whatIbmOffers" as="span" className="text-sm font-bold text-gray-700 uppercase tracking-wider" />
            </h3>
            {artifactsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-pulse">
                    <div className="h-5 w-24 bg-gray-200 rounded-full mb-4" />
                    <div className="aspect-video bg-gray-200 rounded-xl mb-4" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {groupOffersByType(ibmOffers).map((group, idx) => (
                  <OfferTypeCarousel
                    key={group.type}
                    type={group.type}
                    items={group.items}
                    prefersReducedMotion={prefersReducedMotion}
                    animDelay={idx * 0.1}
                    onZoom={handleZoom}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── ACTION BAR — Start Over only ─── */}
        <motion.div
          {...fadeIn(1.2)}
          className="flex items-center justify-center p-5 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <button
            onClick={onReset}
            type="button"
            className="group flex items-center gap-3 px-8 sm:px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 active:from-blue-600 active:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg min-h-[56px] text-base sm:text-lg"
          >
            <RotateCcw className="w-5 h-5 group-active:-rotate-180 transition-transform duration-500" />
            <EditableText labelKey="results.startOver" as="span" className="font-semibold" />
          </button>
        </motion.div>

        {/* Zoom / Lightbox Modal */}
        <ZoomableMediaModal
          offer={zoomOffer}
          onClose={() => setZoomOffer(null)}
        />
      </div>
      </div>
    </div>
  );
};

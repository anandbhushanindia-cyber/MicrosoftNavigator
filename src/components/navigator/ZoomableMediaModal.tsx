import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import type { IBMOffer } from '../../types/navigator.types';

interface ZoomableMediaModalProps {
  offer: IBMOffer | null;
  onClose: () => void;
}

// Detect file extension from URL
const getFileExt = (url?: string): string =>
  (url?.split('?')[0]?.split('.').pop() || '').toLowerCase();

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.5;

export const ZoomableMediaModal: React.FC<ZoomableMediaModalProps> = ({
  offer,
  onClose,
}) => {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);

  // Pinch state
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef(1);

  // Reset on offer change
  useEffect(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [offer?.id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (offer) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [offer]);

  // Escape key to close
  useEffect(() => {
    if (!offer) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [offer, onClose]);

  // --- Zoom helpers ---
  const zoomIn = useCallback(() => {
    setScale(s => Math.min(s + ZOOM_STEP, MAX_SCALE));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(s => {
      const next = Math.max(s - ZOOM_STEP, MIN_SCALE);
      if (next <= 1) setTranslate({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // --- Wheel zoom ---
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    },
    [zoomIn, zoomOut],
  );

  // --- Mouse drag (pan when zoomed) ---
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (scale <= 1) return;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        tx: translate.x,
        ty: translate.y,
      };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [scale, translate],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setTranslate({
        x: dragStartRef.current.tx + dx / scale,
        y: dragStartRef.current.ty + dy / scale,
      });
    },
    [isDragging, scale],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // --- Touch: pinch-to-zoom + double-tap ---
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDistRef.current = Math.sqrt(dx * dx + dy * dy);
        pinchStartScaleRef.current = scale;
      } else if (e.touches.length === 1) {
        // Double-tap detection
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
          // Double-tap → toggle zoom
          if (scale > 1) resetZoom();
          else setScale(2.5);
          lastTapRef.current = 0;
        } else {
          lastTapRef.current = now;
        }
      }
    },
    [scale, resetZoom],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ratio = dist / pinchStartDistRef.current;
        const newScale = Math.min(Math.max(pinchStartScaleRef.current * ratio, MIN_SCALE), MAX_SCALE);
        setScale(newScale);
      }
    },
    [],
  );

  const handleTouchEnd = useCallback(() => {
    pinchStartDistRef.current = null;
    if (scale <= 1) setTranslate({ x: 0, y: 0 });
  }, [scale]);

  if (!offer) return null;

  const ext = offer.fileType || getFileExt(offer.mediaUrl);
  const isVideo = ext === 'mp4' || ext === 'webm' || offer.type === 'video' || offer.type === 'demo';
  const isPdf = ext === 'pdf';
  const isImage = ['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(ext);

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-b from-black/60 to-transparent">
          <div className="text-white">
            <h3 className="text-sm sm:text-base font-semibold truncate max-w-[60vw]">
              {offer.title}
            </h3>
            {offer.fileSize && (
              <span className="text-xs text-white/60">{offer.fileSize}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Zoom controls (only for images) */}
            {isImage && (
              <>
                <button
                  onClick={zoomOut}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-white/70 font-mono min-w-[3rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                {scale > 1 && (
                  <button
                    onClick={resetZoom}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    title="Reset zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
            {/* Fullscreen hint for video */}
            {isVideo && (
              <span className="text-xs text-white/50 flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" />
                Use video controls for fullscreen
              </span>
            )}
            {/* Close button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors ml-2"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div
          ref={containerRef}
          className="w-full h-full flex items-center justify-center overflow-hidden pt-14 pb-4 px-4"
          onWheel={isImage ? handleWheel : undefined}
          onTouchStart={isImage ? handleTouchStart : undefined}
          onTouchMove={isImage ? handleTouchMove : undefined}
          onTouchEnd={isImage ? handleTouchEnd : undefined}
        >
          {/* Image with zoom/pan */}
          {isImage && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-[95vw] max-h-[90vh]"
              style={{
                transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <img
                src={offer.mediaUrl}
                alt={offer.title}
                className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                draggable={false}
              />
            </motion.div>
          )}

          {/* Video — fullscreen native player */}
          {isVideo && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-5xl aspect-video"
            >
              <video
                src={offer.mediaUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full rounded-lg shadow-2xl bg-black"
              />
            </motion.div>
          )}

          {/* PDF — fullscreen iframe */}
          {isPdf && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-6xl h-[90vh]"
            >
              <iframe
                src={offer.mediaUrl}
                title={offer.title}
                className="w-full h-full rounded-lg shadow-2xl bg-white"
                style={{ border: 'none' }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

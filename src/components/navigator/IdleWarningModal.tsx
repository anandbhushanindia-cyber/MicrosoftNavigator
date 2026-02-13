import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from 'lucide-react';
import { EditableText } from '../admin/EditableText';

interface IdleWarningModalProps {
  visible: boolean;
  secondsLeft: number;
  onDismiss: () => void;
}

export const IdleWarningModal: React.FC<IdleWarningModalProps> = ({
  visible,
  secondsLeft,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white rounded-3xl shadow-2xl
              p-10 sm:p-12
              max-w-md w-[90%]
              text-center
            "
          >
            {/* Timer Icon */}
            <div className="
              inline-flex items-center justify-center
              w-20 h-20 rounded-full
              bg-indigo-50 text-indigo-600
              mb-6
            ">
              <Timer className="w-10 h-10" />
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
              <EditableText
                labelKey="idle.title"
                as="span"
                className="text-2xl sm:text-3xl font-semibold text-gray-900"
              />
            </h3>

            {/* Subtitle */}
            <p className="text-lg text-gray-500 mb-8">
              <EditableText
                labelKey="idle.subtitle"
                as="span"
                className="text-lg text-gray-500"
              />
            </p>

            {/* Countdown */}
            <div className="
              inline-flex items-center justify-center
              w-24 h-24 rounded-full
              bg-gradient-to-br from-indigo-500 to-blue-600
              text-white text-4xl font-bold
              mb-8 shadow-lg
            ">
              {secondsLeft}
            </div>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onDismiss}
              className="
                w-full py-5
                bg-gradient-to-r from-blue-500 to-indigo-600
                text-white text-xl font-semibold
                rounded-2xl shadow-lg
                active:from-blue-600 active:to-indigo-700
                transition-all
                min-h-[64px]
                focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300/40
              "
            >
              <EditableText
                labelKey="idle.cta"
                as="span"
                className="text-xl font-semibold"
              />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

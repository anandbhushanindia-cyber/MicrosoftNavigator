import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Enterprise,
  CloudServices,
  ShoppingCatalog,
  UserMultiple,
} from '@carbon/icons-react';
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

const LAYERS = [
  {
    id: 'services',
    title: 'High Value Consulting Services',
    description: 'A dedicated set of advanced skills to address client\'s most complex use cases',
    icon: <UserMultiple size={20} />,
    badge: null,
    color: 'from-blue-500 to-indigo-600',
    lightColor: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-300',
    iconColor: 'text-blue-600',
  },
  {
    id: 'marketplace',
    title: 'Advantage Marketplace',
    description: 'Pre-built Agentic Workflows and Applications across Business, IT, and Industry — delivered with squads of Human and Digital workers',
    icon: <ShoppingCatalog size={20} />,
    badge: 'Coming Soon',
    color: 'from-blue-400 to-blue-600',
    lightColor: 'from-blue-50 to-sky-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
  },
  {
    id: 'ica',
    title: 'IBM Consulting Advantage',
    description: 'The modular AI platform integrated natively with the client\'s preferred AI environments',
    icon: <CloudServices size={20} />,
    badge: null,
    color: 'from-blue-300 to-blue-500',
    lightColor: 'from-sky-50 to-blue-50',
    borderColor: 'border-sky-200',
    iconColor: 'text-sky-600',
  },
];

const HYPERSCALERS = [
  { name: 'Microsoft Azure', highlight: true },
  { name: 'IBM Cloud', highlight: false },
  { name: 'AWS', highlight: false },
  { name: 'Google Cloud', highlight: false },
];

export const EnterpriseAdvantage: React.FC<EnterpriseAdvantageProps> = ({ primaryOffering }) => {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

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

        {/* Main content: 3D visual + descriptions */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-10">

          {/* ─── LEFT: 3D Isometric Stack (hidden on mobile, shown on lg+) ─── */}
          <motion.div
            {...fadeIn(0.1)}
            className="hidden lg:flex items-center justify-center flex-shrink-0"
            style={{ width: 320, minHeight: 320 }}
          >
            <div
              className="relative"
              style={{
                perspective: '800px',
                perspectiveOrigin: '50% 40%',
              }}
            >
              {/* Isometric container */}
              <div
                style={{
                  transform: 'rotateX(55deg) rotateZ(-45deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Platform base */}
                <div
                  className="absolute"
                  style={{
                    width: 220,
                    height: 220,
                    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                    borderRadius: 12,
                    transform: 'translateZ(-10px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
                    left: -10,
                    top: -10,
                  }}
                />

                {/* Layer 3 — Base: ICA */}
                <div
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredLayer('ica')}
                  onMouseLeave={() => setHoveredLayer(null)}
                  style={{
                    width: 200,
                    height: 200,
                    transformStyle: 'preserve-3d',
                    transform: hoveredLayer === 'ica'
                      ? 'translateZ(8px)'
                      : 'translateZ(0px)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {/* Stack of blocks — base tier */}
                  {[0, 1, 2].map((row) => (
                    <div key={`base-${row}`} className="flex gap-1 mb-1" style={{ transformStyle: 'preserve-3d' }}>
                      {[0, 1, 2].map((col) => (
                        <div
                          key={`base-${row}-${col}`}
                          style={{
                            width: 62,
                            height: 22,
                            background: hoveredLayer === 'ica'
                              ? 'linear-gradient(135deg, #60a5fa, #3b82f6)'
                              : 'linear-gradient(135deg, #93c5fd, #60a5fa)',
                            borderRadius: 3,
                            border: '1px solid rgba(255,255,255,0.4)',
                            boxShadow: hoveredLayer === 'ica'
                              ? '0 2px 12px rgba(59,130,246,0.5)'
                              : '0 1px 3px rgba(59,130,246,0.2)',
                            transition: 'all 0.3s ease',
                            transform: 'translateZ(2px)',
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Layer 2 — Middle: Marketplace */}
                <div
                  className="absolute cursor-pointer"
                  onMouseEnter={() => setHoveredLayer('marketplace')}
                  onMouseLeave={() => setHoveredLayer(null)}
                  style={{
                    top: 10,
                    left: 15,
                    width: 170,
                    transformStyle: 'preserve-3d',
                    transform: hoveredLayer === 'marketplace'
                      ? 'translateZ(50px)'
                      : 'translateZ(35px)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {[0, 1, 2].map((row) => (
                    <div key={`mid-${row}`} className="flex gap-1 mb-1" style={{ transformStyle: 'preserve-3d' }}>
                      {[0, 1, 2].map((col) => (
                        <div
                          key={`mid-${row}-${col}`}
                          style={{
                            width: 52,
                            height: 20,
                            background: hoveredLayer === 'marketplace'
                              ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                              : 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                            borderRadius: 3,
                            border: '1px solid rgba(255,255,255,0.35)',
                            boxShadow: hoveredLayer === 'marketplace'
                              ? '0 2px 12px rgba(37,99,235,0.5)'
                              : '0 1px 3px rgba(37,99,235,0.2)',
                            transition: 'all 0.3s ease',
                            transform: 'translateZ(2px)',
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Layer 1 — Top: Services */}
                <div
                  className="absolute cursor-pointer"
                  onMouseEnter={() => setHoveredLayer('services')}
                  onMouseLeave={() => setHoveredLayer(null)}
                  style={{
                    top: 20,
                    left: 30,
                    width: 140,
                    transformStyle: 'preserve-3d',
                    transform: hoveredLayer === 'services'
                      ? 'translateZ(90px)'
                      : 'translateZ(70px)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {[0, 1].map((row) => (
                    <div key={`top-${row}`} className="flex gap-1 mb-1" style={{ transformStyle: 'preserve-3d' }}>
                      {[0, 1].map((col) => (
                        <div
                          key={`top-${row}-${col}`}
                          style={{
                            width: 62,
                            height: 20,
                            background: hoveredLayer === 'services'
                              ? 'linear-gradient(135deg, #2563eb, #4338ca)'
                              : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            borderRadius: 3,
                            border: '1px solid rgba(255,255,255,0.3)',
                            boxShadow: hoveredLayer === 'services'
                              ? '0 2px 12px rgba(67,56,202,0.5)'
                              : '0 1px 3px rgba(67,56,202,0.2)',
                            transition: 'all 0.3s ease',
                            transform: 'translateZ(2px)',
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Wireframe cube outline */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: -5,
                    left: -5,
                    width: 210,
                    height: 210,
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: 4,
                    transform: 'translateZ(100px)',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* ─── RIGHT: Layer Descriptions ─── */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4">
            {LAYERS.map((layer, idx) => {
              const isHovered = hoveredLayer === layer.id;
              return (
                <motion.div
                  key={layer.id}
                  {...fadeIn(0.15 + idx * 0.1)}
                  className={`relative rounded-xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer ${
                    isHovered
                      ? `bg-gradient-to-r ${layer.lightColor} ${layer.borderColor} shadow-md ring-1 ring-blue-200`
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}
                  onMouseEnter={() => setHoveredLayer(layer.id)}
                  onMouseLeave={() => setHoveredLayer(null)}
                >
                  {/* Connector dot — visible on lg+ */}
                  <div className={`hidden lg:block absolute -left-6 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 transition-colors duration-300 ${
                    isHovered ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                  }`} />
                  {/* Connector line — visible on lg+ */}
                  <div className={`hidden lg:block absolute -left-[14px] top-1/2 -translate-y-1/2 w-[14px] h-px transition-colors duration-300 ${
                    isHovered ? 'bg-blue-400' : 'bg-gray-200'
                  }`} style={{ left: -14 }} />

                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      isHovered
                        ? `bg-gradient-to-br ${layer.color} text-white`
                        : `bg-gray-50 ${layer.iconColor}`
                    }`}>
                      {layer.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-gray-900">
                          {layer.title}
                        </h4>
                        {layer.badge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white tracking-wide">
                            {layer.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Hyperscaler row */}
            <motion.div
              {...fadeIn(0.5)}
              className="flex items-center gap-3 pt-2 pl-1"
            >
              <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                Runs on
              </span>
              <div className="flex items-center gap-3 flex-wrap">
                {HYPERSCALERS.map((hs) => (
                  <span
                    key={hs.name}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      hs.highlight
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100'
                        : 'bg-gray-50 text-gray-500 border border-gray-100'
                    }`}
                  >
                    {hs.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contextual tagline */}
        <motion.div {...fadeIn(0.55)} className="mt-6 pt-5 border-t border-gray-100">
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

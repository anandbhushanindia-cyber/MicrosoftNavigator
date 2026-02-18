import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Search,
  ArrowUp,
  Menu,
  X,
  Layers,
  GitBranch,
  Database,
  Bot,
  Clock,
  TrendingUp,
  Activity,
  Rocket,
  ShieldCheck,
  Zap,
  Settings,
  FileText,
  Code2,
  BarChart3,
  Cpu,
  Monitor,
  Palette,
  Info,
  Copy,
  Check,
} from 'lucide-react';

// ─── Types ───
interface TOCItem {
  id: string;
  label: string;
  level: number;
  icon?: React.ReactNode;
}

interface SignalRow {
  num: number;
  signalPath: string;
  data: number;
  ai: number;
  amm: number;
  dpde: number;
}

interface QuestionOption {
  label: string;
  text: string;
  signalPath: string;
  weight: number;
}

interface QuestionRow {
  qNum: string;
  question: string;
  options: QuestionOption[];
}

interface SubScenarioBlock {
  id: string;
  title: string;
  signal: string;
  weight: number;
  questions: QuestionRow[];
}

interface ScenarioBlock {
  id: string;
  title: string;
  group: string;
  subScenarios: SubScenarioBlock[];
}

// ─── Data ───
const SIGNAL_MATRIX: SignalRow[] = [
  { num: 1, signalPath: 'Data Platform Modernization', data: 3, ai: 1, amm: 0, dpde: 0 },
  { num: 2, signalPath: 'Platform Consolidation', data: 3, ai: 1, amm: 0, dpde: 0 },
  { num: 3, signalPath: 'Platform Unification', data: 3, ai: 1, amm: 0, dpde: 0 },
  { num: 4, signalPath: 'Real-Time Analytics', data: 3, ai: 2, amm: 0, dpde: 0 },
  { num: 5, signalPath: 'AI-Ready Data Foundation', data: 1, ai: 3, amm: 0, dpde: 0 },
  { num: 6, signalPath: 'Data Governance', data: 2, ai: 2, amm: 0, dpde: 0 },
  { num: 7, signalPath: 'BI Optimization', data: 2, ai: 1, amm: 0, dpde: 1 },
  { num: 8, signalPath: 'AI Analytics Foundation', data: 1, ai: 3, amm: 0, dpde: 0 },
  { num: 9, signalPath: 'Real-Time AI Foundation', data: 1, ai: 3, amm: 0, dpde: 0 },
  { num: 10, signalPath: 'App Modernization', data: 0, ai: 0, amm: 3, dpde: 0 },
  { num: 11, signalPath: 'Cloud Optimization', data: 0, ai: 0, amm: 2, dpde: 0 },
  { num: 12, signalPath: 'Cloud-Native Transformation', data: 0, ai: 1, amm: 3, dpde: 2 },
  { num: 13, signalPath: 'DevOps Modernization', data: 0, ai: 1, amm: 3, dpde: 2 },
  { num: 14, signalPath: 'API Modernization', data: 0, ai: 1, amm: 3, dpde: 2 },
  { num: 15, signalPath: 'Integration Modernization', data: 0, ai: 1, amm: 3, dpde: 2 },
  { num: 16, signalPath: 'AI Integration', data: 1, ai: 3, amm: 2, dpde: 2 },
  { num: 17, signalPath: 'Dev Platform Modernization', data: 0, ai: 0, amm: 1, dpde: 3 },
  { num: 18, signalPath: 'Quality Engineering', data: 0, ai: 1, amm: 0, dpde: 3 },
  { num: 19, signalPath: 'Experience Engineering', data: 0, ai: 2, amm: 0, dpde: 3 },
  { num: 20, signalPath: 'AI Engineering', data: 1, ai: 3, amm: 0, dpde: 2 },
  { num: 21, signalPath: 'Hybrid Modernization', data: 0, ai: 0, amm: 3, dpde: 0 },
  { num: 22, signalPath: 'DevSecOps Modernization', data: 0, ai: 1, amm: 2, dpde: 2 },
  { num: 23, signalPath: 'Cloud-Native Optimization', data: 0, ai: 0, amm: 2, dpde: 1 },
  { num: 24, signalPath: 'DevSecOps Optimization', data: 0, ai: 1, amm: 2, dpde: 2 },
  { num: 25, signalPath: 'Compliance Modernization', data: 0, ai: 1, amm: 2, dpde: 2 },
  { num: 26, signalPath: 'Product Modernization', data: 0, ai: 0, amm: 1, dpde: 3 },
  { num: 27, signalPath: 'AI-Driven Product Engineering', data: 0, ai: 2, amm: 0, dpde: 3 },
  { num: 28, signalPath: 'Cloud-Native Engineering', data: 0, ai: 0, amm: 1, dpde: 3 },
  { num: 29, signalPath: 'AI-Driven Security', data: 0, ai: 2, amm: 1, dpde: 2 },
  { num: 30, signalPath: 'Security Platform Consolidation', data: 0, ai: 1, amm: 2, dpde: 1 },
  { num: 31, signalPath: 'Cloud Security Optimization', data: 0, ai: 1, amm: 2, dpde: 1 },
  { num: 32, signalPath: 'Platform Rationalization', data: 2, ai: 1, amm: 0, dpde: 0 },
  { num: 33, signalPath: 'Platform Optimization', data: 2, ai: 1, amm: 0, dpde: 0 },
  { num: 34, signalPath: 'AI Optimization', data: 1, ai: 2, amm: 0, dpde: 0 },
  { num: 35, signalPath: 'Governance Modernization', data: 2, ai: 1, amm: 0, dpde: 0 },
  { num: 36, signalPath: 'Governance Optimization', data: 2, ai: 1, amm: 0, dpde: 0 },
  { num: 37, signalPath: 'Data Unification', data: 3, ai: 1, amm: 0, dpde: 0 },
  { num: 38, signalPath: 'Compliance Automation', data: 0, ai: 1, amm: 2, dpde: 2 },
  { num: 39, signalPath: 'Compliance Optimization', data: 0, ai: 1, amm: 2, dpde: 1 },
  { num: 40, signalPath: 'AI Engineering Optimization', data: 0, ai: 2, amm: 0, dpde: 3 },
  { num: 41, signalPath: 'DevOps Optimization', data: 0, ai: 1, amm: 2, dpde: 2 },
  { num: 42, signalPath: 'Platform Rationalization (DPDE)', data: 0, ai: 0, amm: 1, dpde: 2 },
  { num: 43, signalPath: 'Application Modernization', data: 0, ai: 0, amm: 3, dpde: 1 },
  { num: 44, signalPath: 'App Modernization Security', data: 0, ai: 1, amm: 2, dpde: 1 },
  { num: 45, signalPath: 'Supply Chain Security', data: 0, ai: 1, amm: 1, dpde: 2 },
  { num: 46, signalPath: 'DevSecOps Automation', data: 0, ai: 1, amm: 2, dpde: 2 },
  { num: 47, signalPath: 'Product Optimization', data: 0, ai: 0, amm: 1, dpde: 2 },
  { num: 48, signalPath: 'Agile Engineering', data: 0, ai: 0, amm: 0, dpde: 2 },
  { num: 49, signalPath: 'AI-Driven Engineering', data: 0, ai: 2, amm: 0, dpde: 3 },
  { num: 50, signalPath: 'Experience Optimization', data: 0, ai: 1, amm: 0, dpde: 2 },
  { num: 51, signalPath: 'Real-Time Experience', data: 0, ai: 1, amm: 0, dpde: 3 },
  { num: 52, signalPath: 'AI Experience Engineering', data: 0, ai: 2, amm: 0, dpde: 3 },
  { num: 53, signalPath: 'AI Compliance', data: 0, ai: 2, amm: 1, dpde: 2 },
  { num: 54, signalPath: 'Experience Modernization', data: 0, ai: 1, amm: 0, dpde: 3 },
  { num: 55, signalPath: 'API Optimization', data: 0, ai: 0, amm: 2, dpde: 1 },
];

const SCENARIOS_OVERVIEW = [
  { num: 1, id: 'sc_fragmented_data', title: 'Fragmented data and slow insights', group: 'DT', icon: 'Database' },
  { num: 2, id: 'sc_ai_blocked', title: 'AI initiatives blocked by poor data readiness', group: 'DT', icon: 'Bot' },
  { num: 3, id: 'sc_legacy_apps', title: 'Legacy applications with outdated infrastructure', group: 'AMM', icon: 'Clock' },
  { num: 4, id: 'sc_cloud_perf', title: 'Cloud applications facing performance & cost challenges', group: 'AMM', icon: 'TrendingUp' },
  { num: 5, id: 'sc_hybrid_estate', title: 'Hybrid estate creating complexity & risk', group: 'AMM', icon: 'Activity' },
  { num: 6, id: 'sc_dev_productivity', title: 'Stalling Developer Efficiency & Velocity on Azure', group: 'DPDE', icon: 'Rocket' },
  { num: 7, id: 'sc_security_risk', title: 'Increased Security Threat & Inadequate risk management', group: 'DPDE', icon: 'ShieldCheck' },
  { num: 8, id: 'sc_product_evolution', title: 'Lack of Innovation and Speed of Delivery', group: 'DPDE', icon: 'Zap' },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Database: <Database className="w-4 h-4" />,
  Bot: <Bot className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Rocket: <Rocket className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
};

const GROUP_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  DT: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
  AMM: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
  DPDE: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800' },
};

// ─── Table of Contents ───
const TOC_ITEMS: TOCItem[] = [
  { id: 'overview', label: 'Project Overview', level: 1, icon: <Info className="w-4 h-4" /> },
  { id: 'user-flow', label: 'User Flow', level: 1, icon: <GitBranch className="w-4 h-4" /> },
  { id: 'project-structure', label: 'Project Structure', level: 1, icon: <Layers className="w-4 h-4" /> },
  { id: 'type-definitions', label: 'Type Definitions', level: 1, icon: <Code2 className="w-4 h-4" /> },
  { id: 'signal-matrix', label: 'Signal Mapping Matrix', level: 1, icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'scoring-algorithm', label: 'Scoring Algorithm', level: 1, icon: <Cpu className="w-4 h-4" /> },
  { id: 'scenarios', label: 'Scenarios Overview', level: 1, icon: <Layers className="w-4 h-4" /> },
  { id: 'question-tables', label: 'Question Mapping Tables', level: 1, icon: <FileText className="w-4 h-4" /> },
  { id: 'admin-system', label: 'Admin System', level: 1, icon: <Settings className="w-4 h-4" /> },
  { id: 'contextual-content', label: 'Contextual Content', level: 1, icon: <FileText className="w-4 h-4" /> },
  { id: 'kiosk-idle', label: 'Kiosk & Idle Timeout', level: 1, icon: <Monitor className="w-4 h-4" /> },
  { id: 'artifact-system', label: 'Artifact System', level: 1, icon: <Database className="w-4 h-4" /> },
  { id: 'components', label: 'Components Reference', level: 1, icon: <Palette className="w-4 h-4" /> },
  { id: 'configuration', label: 'Configuration & Labels', level: 1, icon: <Settings className="w-4 h-4" /> },
];

// ─── Utility Components ───
const SectionHeading: React.FC<{
  id: string;
  number: number;
  title: string;
  icon: React.ReactNode;
}> = ({ id, number, title, icon }) => (
  <div id={id} className="scroll-mt-24 mb-8">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600">
        {icon}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        <span className="text-indigo-500 mr-2">{number}.</span>
        {title}
      </h2>
    </div>
    <div className="mt-3 h-px bg-gradient-to-r from-indigo-200 via-gray-200 to-transparent" />
  </div>
);

const CodeBlock: React.FC<{ children: string; language?: string }> = ({ children, language }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs font-mono text-gray-400">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-100 leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
};

const InfoCard: React.FC<{
  title: string;
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'rose';
}> = ({ title, children, variant = 'blue' }) => {
  const colors = {
    blue: 'border-blue-200 bg-blue-50/50',
    green: 'border-emerald-200 bg-emerald-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
    rose: 'border-rose-200 bg-rose-50/50',
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[variant]} my-4`}>
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  </div>
);

const WeightBadge: React.FC<{ weight: number }> = ({ weight }) => {
  const colors = {
    1: 'bg-gray-100 text-gray-600',
    2: 'bg-amber-100 text-amber-700',
    3: 'bg-red-100 text-red-700',
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${colors[weight as 1 | 2 | 3] || 'bg-gray-100 text-gray-600'}`}
    >
      {weight}
    </span>
  );
};

const ScoreCell: React.FC<{ value: number }> = ({ value }) => {
  if (value === 0) return <span className="text-gray-300">0</span>;
  const colors = {
    1: 'bg-blue-100 text-blue-700',
    2: 'bg-indigo-100 text-indigo-700',
    3: 'bg-indigo-200 text-indigo-900 font-bold',
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${colors[value as 1 | 2 | 3] || ''}`}
    >
      {value}
    </span>
  );
};

// ─── Collapsible Section ───
const Collapsible: React.FC<{
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}> = ({ title, children, defaultOpen = false, className = '' }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Question Table Component ───
const QuestionTable: React.FC<{ questions: QuestionRow[] }> = ({ questions }) => (
  <div className="overflow-x-auto -mx-1">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-3 py-2.5 text-left font-semibold text-gray-600 border-b border-gray-200 w-12">Q#</th>
          <th className="px-3 py-2.5 text-left font-semibold text-gray-600 border-b border-gray-200">Question</th>
          <th className="px-3 py-2.5 text-left font-semibold text-gray-600 border-b border-gray-200 w-10">Opt</th>
          <th className="px-3 py-2.5 text-left font-semibold text-gray-600 border-b border-gray-200">Option Text</th>
          <th className="px-3 py-2.5 text-left font-semibold text-gray-600 border-b border-gray-200">Signal Path</th>
          <th className="px-3 py-2.5 text-center font-semibold text-gray-600 border-b border-gray-200 w-10">W</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q) =>
          q.options.map((opt, optIdx) => (
            <tr
              key={`${q.qNum}-${opt.label}`}
              className={`${optIdx === 0 ? 'border-t border-gray-200' : ''} hover:bg-blue-50/30 transition-colors`}
            >
              {optIdx === 0 ? (
                <>
                  <td className="px-3 py-2 font-mono text-xs text-indigo-600 font-bold align-top" rowSpan={q.options.length}>
                    {q.qNum}
                  </td>
                  <td className="px-3 py-2 text-gray-800 align-top font-medium" rowSpan={q.options.length}>
                    {q.question}
                  </td>
                </>
              ) : null}
              <td className="px-3 py-1.5 font-mono text-xs text-gray-500">{opt.label}</td>
              <td className="px-3 py-1.5 text-gray-700">{opt.text}</td>
              <td className="px-3 py-1.5">
                <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-mono whitespace-nowrap">
                  {opt.signalPath}
                </span>
              </td>
              <td className="px-3 py-1.5 text-center">
                <WeightBadge weight={opt.weight} />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// ─── Import scenarios data for question tables ───
import scenariosData from '../data/scenarios.json';
import type { Scenario as ScenarioType } from '../types/navigator.types';

function buildScenarioBlocks(): ScenarioBlock[] {
  const scenarios = scenariosData.scenarios as ScenarioType[];
  return scenarios.map((sc) => ({
    id: sc.id,
    title: sc.title,
    group: sc.offeringGroup || '',
    subScenarios: sc.subScenarios.map((ss) => ({
      id: ss.id,
      title: ss.text,
      signal: ss.signalPath,
      weight: ss.weight,
      questions: ss.questions.map((q, qi) => ({
        qNum: `Q${qi + 1}`,
        question: q.text,
        options: q.options.map((opt, oi) => ({
          label: String.fromCharCode(65 + oi),
          text: opt.text,
          signalPath: opt.signalPath,
          weight: opt.weight,
        })),
      })),
    })),
  }));
}

// ─── Main Page ───
export const DocumentationPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const scenarioBlocks = useMemo(() => buildScenarioBlocks(), []);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    TOC_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop((mainRef.current?.scrollTop ?? 0) > 600);
    };
    const el = mainRef.current;
    el?.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSidebarOpen(false); // Close sidebar on mobile after click
  };

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTOC = searchQuery
    ? TOC_ITEMS.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : TOC_ITEMS;

  return (
    <div className="fixed inset-0 flex bg-gray-50 overflow-hidden" style={{ userSelect: 'auto' }}>
      {/* ─── Sidebar ─── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-white border-r border-gray-200
          flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">Microsoft Navigator</h1>
            <p className="text-xs text-gray-500">Documentation</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections..."
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
          {filteredTOC.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left
                text-sm transition-all duration-150
                ${
                  activeSection === item.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }
              `}
            >
              <span className={activeSection === item.id ? 'text-indigo-500' : 'text-gray-400'}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {activeSection === item.id && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Stats Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="font-bold text-indigo-600">160</div>
              <div className="text-gray-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-indigo-600">55</div>
              <div className="text-gray-500">Signal Paths</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-indigo-600">8</div>
              <div className="text-gray-500">Scenarios</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-indigo-600">640</div>
              <div className="text-gray-500">Options</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Main Content ─── */}
      <main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
        {/* Sticky header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">
              Microsoft Navigator — Project Documentation
            </h1>
          </div>
          <a
            href="/"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            Back to App
          </a>
        </header>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* ═══════════════════════════════════════════
              SECTION 1: Project Overview
              ═══════════════════════════════════════════ */}
          <SectionHeading id="overview" number={1} title="Project Overview" icon={<Info className="w-5 h-5" />} />

          <p className="text-gray-700 leading-relaxed mb-6">
            A <strong>kiosk-optimized touchscreen web application</strong> that guides enterprise users
            through a multi-step questionnaire to receive personalized IBM + Microsoft solution recommendations
            for digital transformation.
          </p>

          {/* Tech Stack */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              { name: 'React', version: '19.2.0', desc: 'UI framework' },
              { name: 'TypeScript', version: '5.9.3', desc: 'Type safety' },
              { name: 'Vite', version: '7.2.4', desc: 'Build tool' },
              { name: 'Tailwind CSS', version: '3.4.17', desc: 'Styling' },
              { name: 'Framer Motion', version: '12.31.0', desc: 'Animations' },
              { name: 'Lucide React', version: '0.563.0', desc: 'Icons' },
            ].map((tech) => (
              <div key={tech.name} className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="font-semibold text-gray-900 text-sm">{tech.name}</div>
                <div className="text-xs text-indigo-600 font-mono">{tech.version}</div>
                <div className="text-xs text-gray-500 mt-0.5">{tech.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard label="Scenarios" value={8} icon={<Layers className="w-5 h-5" />} />
            <StatCard label="Questions" value={160} icon={<FileText className="w-5 h-5" />} />
            <StatCard label="Signal Paths" value={55} icon={<GitBranch className="w-5 h-5" />} />
            <StatCard label="Options" value={640} icon={<BarChart3 className="w-5 h-5" />} />
          </div>

          <InfoCard title="Deployment" variant="green">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Azure Static Web Apps</strong> (primary)</li>
              <li><strong>Firebase Hosting</strong> (alternate)</li>
              <li>Environment variable: <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">VITE_ARTIFACT_BASE_URL</code></li>
            </ul>
          </InfoCard>

          {/* ═══════════════════════════════════════════
              SECTION 2: User Flow
              ═══════════════════════════════════════════ */}
          <SectionHeading id="user-flow" number={2} title="User Flow" icon={<GitBranch className="w-5 h-5" />} />

          <div className="space-y-0 mb-8">
            {[
              { step: 1, label: 'Landing Screen', desc: '"Begin Your Journey" button', color: 'border-indigo-400 bg-indigo-50' },
              { step: 2, label: 'Scenario Selector', desc: 'Choose 1 of 8 transformation challenges (grouped by DT/AMM/DPDE)', color: 'border-blue-400 bg-blue-50' },
              { step: 3, label: 'Sub-Scenario Selector', desc: 'Choose 1 of 4 specific problem areas (each has signalPath + weight)', color: 'border-teal-400 bg-teal-50' },
              { step: 4, label: 'Question Flow', desc: 'Answer 5 questions × 4 options each (signalPath + weight 1-3)', color: 'border-purple-400 bg-purple-50' },
              { step: 5, label: 'Recommendation Screen', desc: 'Primary/Supporting/Optional offerings, challenges, solutions, tech stack', color: 'border-emerald-400 bg-emerald-50' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-stretch">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-10 h-10 rounded-full ${s.color} border-2 flex items-center justify-center font-bold text-sm text-gray-700`}>
                    {s.step}
                  </div>
                  {i < 4 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                </div>
                <div className="pb-6">
                  <h4 className="font-semibold text-gray-800">{s.label}</h4>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <InfoCard title="Back Navigation" variant="amber">
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Questions → Previous Question (removes last answer)</li>
              <li>Question 1 → Sub-Scenario Selector (clears answers)</li>
              <li>Sub-Scenario → Scenario Selector (clears sub-selection)</li>
              <li>Scenario → Landing (clears scenario selection)</li>
              <li>Results → Sub-Scenario Selector (clears answers & recommendation)</li>
            </ul>
          </InfoCard>

          {/* ═══════════════════════════════════════════
              SECTION 3: Project Structure
              ═══════════════════════════════════════════ */}
          <SectionHeading id="project-structure" number={3} title="Project Structure" icon={<Layers className="w-5 h-5" />} />

          <CodeBlock language="plaintext">{`MicrosoftNavigator/
├── src/
│   ├── App.tsx                          # Root: AdminProvider + kiosk mode
│   ├── main.tsx                         # React DOM entry point
│   ├── index.css                        # Global styles
│   │
│   ├── pages/
│   │   ├── NavigatorPage.tsx            # Main page orchestrator
│   │   └── DocumentationPage.tsx        # This documentation page
│   │
│   ├── components/
│   │   ├── navigator/
│   │   │   ├── LandingScreen.tsx        # Welcome screen
│   │   │   ├── NavigatorLayout.tsx      # Header/footer layout
│   │   │   ├── ScenarioSelector.tsx     # 8 scenario cards
│   │   │   ├── SubScenarioSelector.tsx  # 4 sub-scenario cards
│   │   │   ├── QuestionFlow.tsx         # Question + 4 options
│   │   │   ├── RecommendationScreen.tsx # Results display
│   │   │   ├── IdleWarningModal.tsx     # Timeout warning
│   │   │   ├── DocumentCard.tsx         # Office file display
│   │   │   └── ZoomableMediaModal.tsx   # Media lightbox
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminToolbar.tsx         # Admin floating panel
│   │   │   ├── EditableText.tsx         # Inline text editor
│   │   │   └── EditableList.tsx         # List editor
│   │   │
│   │   └── visualizations/
│   │       ├── AnimatedBackground.tsx   # Background manager
│   │       └── variants/               # 5 animation variants
│   │
│   ├── contexts/
│   │   └── AdminContext.tsx             # Admin state provider
│   │
│   ├── hooks/
│   │   ├── useNavigator.ts             # Navigation + scoring logic
│   │   ├── useAdminMode.ts             # Admin state management
│   │   ├── useIdleTimeout.ts           # Idle timeout logic
│   │   └── useArtifacts.ts             # Artifact loading
│   │
│   ├── types/
│   │   └── navigator.types.ts          # All TypeScript types
│   │
│   ├── data/
│   │   ├── scenarios.json              # 9,077 lines - scenarios + questions
│   │   ├── contextualContent.json      # 1,498 lines - contextual overrides
│   │   ├── labels.ts                   # Default UI labels + config
│   │   └── artifactManifest.ts         # Static artifact fallback
│   │
│   ├── config/
│   │   └── artifacts.ts                # Artifact storage config
│   │
│   ├── services/
│   │   └── artifactService.ts          # Azure Blob Storage fetcher
│   │
│   └── utils/
│       ├── kiosk.ts                    # Kiosk lockdown utilities
│       └── artifactHelpers.ts          # Artifact helpers
│
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json`}</CodeBlock>

          {/* ═══════════════════════════════════════════
              SECTION 4: Type Definitions
              ═══════════════════════════════════════════ */}
          <SectionHeading id="type-definitions" number={4} title="Type Definitions" icon={<Code2 className="w-5 h-5" />} />

          <Collapsible title="Core Data Types" defaultOpen>
            <CodeBlock language="typescript">{`// Sub-Scenario (4 per scenario)
interface SubScenario {
  id: string;              // e.g., "sc1_sub1"
  text: string;            // Display text
  businessMeaning: string; // Internal description
  signalPath: string;      // e.g., "Data Platform Modernization"
  weight: number;          // 1-3, contributes to scoring
  questions: Question[];   // 5 questions per sub-scenario
}

// Question (5 per sub-scenario)
interface Question {
  id: string;              // e.g., "sc1_sub1_q1"
  text: string;            // The question text
  options: QuestionOption[]; // 4 options
}

// Question Option (4 per question)
interface QuestionOption {
  id: string;              // e.g., "sc1_sub1_q1_a"
  text: string;            // Display text
  businessMeaning: string; // Internal description
  signalPath: string;      // Maps to signal matrix
  weight: number;          // 1-3, scoring strength
}`}</CodeBlock>
          </Collapsible>

          <Collapsible title="Scenario & Offering Types" className="mt-3">
            <CodeBlock language="typescript">{`// Scenario (8 total)
interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;            // Lucide icon name
  color: string;           // Tailwind gradient
  enabled: boolean;
  offeringGroup?: string;  // 'DT' | 'AMM' | 'DPDE'
  subScenarios: SubScenario[];
  signalPathMappings: SignalPathMapping[];
}

// Signal Path Mapping (per scenario)
interface SignalPathMapping {
  signalPath: string;
  primaryRecommendation: string;
  supportingCapability: string;
  description: string;
  techStack: string[];
  challenges: string[];
  solutions: string[];
  approach: string[];
  capabilities: string[];
  ibmOffers: IBMOffer[];
}

// Offerings
type OfferingName = 'Data' | 'AI' | 'AMM' | 'DPDE';

// Signal Matrix Entry
interface SignalOfferingMapping {
  signalPath: string;
  Data: number;  // 0-3 multiplier
  AI: number;
  AMM: number;
  DPDE: number;
}`}</CodeBlock>
          </Collapsible>

          <Collapsible title="Navigation & Recommendation Types" className="mt-3">
            <CodeBlock language="typescript">{`type NavigatorStep = 'landing' | 'scenario' | 'subscenario' | 'questions' | 'results';

interface Answer {
  questionId: string;
  optionId: string;
  signalPath: string;
  weight: number;
}

interface Recommendation {
  offeringGroup: string;
  scenarioTitle: string;
  subScenarioText: string;
  primaryOffering: OfferingName;
  supportingOffering?: OfferingName;
  optionalOffering?: OfferingName;
  offeringScores: OfferingScore[];
  primarySignalPath: string;
  primaryRecommendation: string;
  primaryDescription: string;
  primaryTechStack: string[];
  supportingSignalPath: string;
  supportingCapability: string;
  supportingDescription: string;
  confidence: number;
  signalScores: SignalPathScore[];
  challenges: string[];
  solutions: string[];
  approach: string[];
  capabilities: string[];
  ibmOffers: IBMOffer[];
}`}</CodeBlock>
          </Collapsible>

          {/* ═══════════════════════════════════════════
              SECTION 5: Signal Mapping Matrix
              ═══════════════════════════════════════════ */}
          <SectionHeading id="signal-matrix" number={5} title="Signal Mapping Matrix" icon={<BarChart3 className="w-5 h-5" />} />

          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            The signal mapping matrix defines how each signal path contributes to the 4 offering scores.
            Each signal path has a weight (0-3) per offering. The weights act as multipliers applied to the
            user's answer weight during scoring.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 border-b border-gray-200 w-10">#</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 border-b border-gray-200">Signal Path</th>
                  <th className="px-3 py-3 text-center font-semibold text-blue-600 border-b border-gray-200 w-14">Data</th>
                  <th className="px-3 py-3 text-center font-semibold text-violet-600 border-b border-gray-200 w-14">AI</th>
                  <th className="px-3 py-3 text-center font-semibold text-emerald-600 border-b border-gray-200 w-14">AMM</th>
                  <th className="px-3 py-3 text-center font-semibold text-purple-600 border-b border-gray-200 w-14">DPDE</th>
                </tr>
              </thead>
              <tbody>
                {SIGNAL_MATRIX.map((row) => (
                  <tr key={row.num} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-3 py-2 text-gray-400 font-mono text-xs border-b border-gray-50">{row.num}</td>
                    <td className="px-3 py-2 text-gray-800 font-medium border-b border-gray-50">{row.signalPath}</td>
                    <td className="px-3 py-2 text-center border-b border-gray-50"><ScoreCell value={row.data} /></td>
                    <td className="px-3 py-2 text-center border-b border-gray-50"><ScoreCell value={row.ai} /></td>
                    <td className="px-3 py-2 text-center border-b border-gray-50"><ScoreCell value={row.amm} /></td>
                    <td className="px-3 py-2 text-center border-b border-gray-50"><ScoreCell value={row.dpde} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════════
              SECTION 6: Scoring Algorithm
              ═══════════════════════════════════════════ */}
          <SectionHeading id="scoring-algorithm" number={6} title="Scoring Algorithm & Recommendation Engine" icon={<Cpu className="w-5 h-5" />} />

          <InfoCard title="Source Code" variant="blue">
            <code className="text-xs font-mono">src/hooks/useNavigator.ts</code> — function{' '}
            <code className="text-xs font-mono">generateRecommendation()</code> (lines 101-235)
          </InfoCard>

          <p className="text-gray-700 mb-4 leading-relaxed">
            The recommendation engine takes <strong>two inputs</strong>: the selected sub-scenario
            (carrying its own signalPath + weight), and the 5 user answers (each with a signalPath + weight).
          </p>

          <Collapsible title="6.1 — Two Parallel Score Systems" defaultOpen>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 border-b">Score System</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 border-b">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 border-b">Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold text-indigo-700">Offering Scores</td>
                    <td className="px-4 py-3 text-gray-700">Which IBM offering to recommend (Data, AI, AMM, DPDE)</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">weight × matrix[signalPath][offering]</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-indigo-700">Signal Path Scores</td>
                    <td className="px-4 py-3 text-gray-700">Which technical recommendation within the offering</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">Raw weight accumulation per signal path</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Collapsible>

          <Collapsible title="6.2 — Step-by-Step Process" className="mt-3">
            <div className="mt-3 space-y-4">
              {[
                { step: 1, title: 'Initialize', desc: 'offeringTotals = { Data: 0, AI: 0, AMM: 0, DPDE: 0 }, signalScores = {}' },
                { step: 2, title: 'Process sub-scenario base signal', desc: 'Adds sub-scenario weight × matrix multipliers to offering totals. Accumulates sub-scenario weight to signal scores.' },
                { step: 3, title: 'Process 5 user answers', desc: 'For each answer: adds answer.weight × matrix multipliers to offering totals, and accumulates answer.weight to signal scores.' },
                { step: 4, title: 'Rank offerings by total score (DESC)', desc: 'Primary offering = highest score. E.g., Data=33 → Primary.' },
                { step: 5, title: 'Determine supporting & optional tiers', desc: 'Supporting: 2nd offering ≥ 40% of primary AND ≥ 10 absolute. Optional: 3rd offering ≥ 25% of primary AND ≥ 10.' },
                { step: 6, title: 'Rank signal paths by accumulated score', desc: 'Primary signal = highest. Tie-breaker: sub-scenario\'s signal wins.' },
                { step: 7, title: 'Look up recommendation content', desc: 'Find signalPathMapping matching primary signal → challenges, solutions, approach, tech stack.' },
                { step: 8, title: 'Resolve contextual content', desc: 'Fallback: contextualContent[subId:signal] → signalPathMapping → empty.' },
                { step: 9, title: 'Inject answer modifiers', desc: 'Weight ≥ 3 answers can append extra challenges/solutions (max 5 each).' },
                { step: 10, title: 'Calculate confidence', desc: 'min(round((primaryScore / totalScore) × 100), 95). Default 70% if total=0.' },
                { step: 11, title: 'Assemble Recommendation object', desc: 'Complete object sent to RecommendationScreen for display.' },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{s.title}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title="6.3 — Worked Example (sc_fragmented_data / sc1_sub1)" className="mt-3">
            <div className="mt-3">
              <p className="text-sm text-gray-700 mb-3">
                <strong>Sub-scenario:</strong> sc1_sub1 — "Legacy data warehouse environment"<br />
                <strong>Signal:</strong> Data Platform Modernization (W:3) → Matrix: Data=3, AI=1, AMM=0, DPDE=0
              </p>

              <h5 className="font-semibold text-gray-700 text-sm mb-2">Step 2 — Base signal:</h5>
              <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left border-b">Offering</th>
                      <th className="px-3 py-2 text-left border-b">Calculation</th>
                      <th className="px-3 py-2 text-right border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b"><td className="px-3 py-1.5">Data</td><td className="px-3 py-1.5 font-mono">0 + (3 × 3) = 9</td><td className="px-3 py-1.5 text-right font-bold text-blue-700">9</td></tr>
                    <tr className="border-b"><td className="px-3 py-1.5">AI</td><td className="px-3 py-1.5 font-mono">0 + (3 × 1) = 3</td><td className="px-3 py-1.5 text-right font-bold">3</td></tr>
                    <tr className="border-b"><td className="px-3 py-1.5">AMM</td><td className="px-3 py-1.5 font-mono">0 + (3 × 0) = 0</td><td className="px-3 py-1.5 text-right">0</td></tr>
                    <tr><td className="px-3 py-1.5">DPDE</td><td className="px-3 py-1.5 font-mono">0 + (3 × 0) = 0</td><td className="px-3 py-1.5 text-right">0</td></tr>
                  </tbody>
                </table>
              </div>

              <h5 className="font-semibold text-gray-700 text-sm mb-2">Final Result:</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
                  <div className="text-xs text-blue-600 font-semibold">Data</div>
                  <div className="text-2xl font-bold text-blue-800">51</div>
                  <div className="text-[10px] text-blue-500 font-semibold">PRIMARY</div>
                </div>
                <div className="p-3 rounded-lg bg-violet-50 border border-violet-200 text-center">
                  <div className="text-xs text-violet-600 font-semibold">AI</div>
                  <div className="text-2xl font-bold text-violet-800">21</div>
                  <div className="text-[10px] text-violet-500 font-semibold">SUPPORTING</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 font-semibold">AMM</div>
                  <div className="text-2xl font-bold text-gray-400">0</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 font-semibold">DPDE</div>
                  <div className="text-2xl font-bold text-gray-400">0</div>
                </div>
              </div>

              <p className="text-xs text-gray-600">
                <strong>Confidence:</strong> min(round((51 / 72) × 100), 95) = <strong className="text-indigo-700">71%</strong>
              </p>
            </div>
          </Collapsible>

          <Collapsible title="6.4 — Configurable Thresholds" className="mt-3 mb-8">
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Config Key</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-600 border-b">Default</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="px-4 py-2 font-mono text-xs">supportingThreshold</td><td className="px-4 py-2 text-center font-bold">0.4</td><td className="px-4 py-2 text-gray-600">2nd offering ≥ 40% of primary</td></tr>
                  <tr className="border-b"><td className="px-4 py-2 font-mono text-xs">optionalThreshold</td><td className="px-4 py-2 text-center font-bold">0.25</td><td className="px-4 py-2 text-gray-600">3rd offering ≥ 25% of primary</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-xs">minScoreToDisplay</td><td className="px-4 py-2 text-center font-bold">10</td><td className="px-4 py-2 text-gray-600">Minimum absolute score</td></tr>
                </tbody>
              </table>
            </div>
          </Collapsible>

          {/* ═══════════════════════════════════════════
              SECTION 7: Scenarios Overview
              ═══════════════════════════════════════════ */}
          <SectionHeading id="scenarios" number={7} title="Scenarios Overview" icon={<Layers className="w-5 h-5" />} />

          <div className="grid gap-3 mb-8">
            {SCENARIOS_OVERVIEW.map((sc) => {
              const colors = GROUP_COLORS[sc.group] || GROUP_COLORS.DT;
              return (
                <div
                  key={sc.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${colors.border} ${colors.bg} transition-all hover:shadow-sm`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colors.badge} flex items-center justify-center`}>
                    {ICON_MAP[sc.icon] || <Layers className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{sc.group}</span>
                      <span className="text-xs text-gray-500 font-mono">{sc.id}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm truncate">{sc.title}</h4>
                  </div>
                  <div className="text-xs text-gray-500">4 sub-scenarios</div>
                </div>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════
              SECTION 8: Question Mapping Tables
              ═══════════════════════════════════════════ */}
          <SectionHeading id="question-tables" number={8} title="Complete Question Mapping Tables" icon={<FileText className="w-5 h-5" />} />

          <p className="text-gray-700 mb-6 text-sm leading-relaxed">
            <strong>Total:</strong> 8 scenarios × 4 sub-scenarios × 5 questions × 4 options ={' '}
            <strong className="text-indigo-700">160 questions, 640 options</strong>.
            Each table shows all questions for one scenario with their signal paths and weights.
          </p>

          <div className="space-y-4 mb-8">
            {scenarioBlocks.map((sc) => {
              const colors = GROUP_COLORS[sc.group] || GROUP_COLORS.DT;
              return (
                <Collapsible
                  key={sc.id}
                  title={
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{sc.group}</span>
                      <span className="font-semibold text-gray-800">{sc.id}</span>
                      <span className="text-gray-500 text-sm hidden sm:inline">— {sc.title}</span>
                    </div>
                  }
                >
                  <div className="space-y-6 mt-4">
                    {sc.subScenarios.map((ss) => (
                      <div key={ss.id}>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{ss.id}</span>
                          <span className="text-sm font-semibold text-gray-800">{ss.title}</span>
                          <span className="text-xs text-gray-500">
                            Signal: <span className="font-mono">{ss.signal}</span> (W:{ss.weight})
                          </span>
                        </div>
                        <QuestionTable questions={ss.questions} />
                      </div>
                    ))}
                  </div>
                </Collapsible>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════
              SECTION 9: Admin System
              ═══════════════════════════════════════════ */}
          <SectionHeading id="admin-system" number={9} title="Admin System" icon={<Settings className="w-5 h-5" />} />

          <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Activate</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[
              { method: 'URL Parameter', detail: '?admin=true', icon: '🔗' },
              { method: 'Keyboard', detail: 'Ctrl+Shift+A', icon: '⌨️' },
              { method: 'Triple-Tap', detail: 'Header logo area × 3', icon: '👆' },
            ].map((m) => (
              <div key={m.method} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
                <div className="text-2xl mb-2">{m.icon}</div>
                <div className="font-semibold text-gray-800 text-sm">{m.method}</div>
                <div className="text-xs text-gray-500 font-mono mt-1">{m.detail}</div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Capabilities</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 border-b">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Edit Labels', 'Double-click any text to inline-edit UI labels'],
                  ['Edit Scenarios', 'Modify scenario titles, descriptions, questions, options'],
                  ['Edit Config', 'Adjust numeric thresholds (idle timeout, scoring)'],
                  ['Export', 'Download current overrides as JSON file'],
                  ['Import', 'Load overrides from a JSON file'],
                  ['Reset', 'Clear all overrides, restore defaults (requires double-confirm)'],
                  ['Change Tracking', 'Badge shows count of modified fields'],
                ].map(([feature, desc]) => (
                  <tr key={feature} className="border-b last:border-0">
                    <td className="px-4 py-2 font-semibold text-gray-800">{feature}</td>
                    <td className="px-4 py-2 text-gray-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <InfoCard title="Storage" variant="amber">
            <p><strong>Key:</strong> <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">navigator_admin_overrides</code> in localStorage</p>
            <p className="mt-1"><strong>Merge Strategy:</strong> Deep merge — overrides layered on top of defaults from scenarios.json and labels.ts</p>
          </InfoCard>

          {/* ═══════════════════════════════════════════
              SECTION 10: Contextual Content
              ═══════════════════════════════════════════ */}
          <SectionHeading id="contextual-content" number={10} title="Contextual Content System" icon={<FileText className="w-5 h-5" />} />

          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            Provides journey-specific challenges, solutions, and approach content that overrides generic
            signal path mapping content.
          </p>

          <CodeBlock language="json">{`{
  "entries": {
    "subScenarioId:signalPath": {
      "challenges": ["Challenge 1", ...],
      "solutions": ["Solution 1", ...],
      "approach": ["Phase 1...", ...]
    }
  },
  "answerModifiers": {
    "questionOptionId": {
      "challengeAppend": "Additional challenge text",
      "solutionAppend": "Additional solution text"
    }
  }
}`}</CodeBlock>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Resolution Priority</h3>
          <div className="flex items-stretch gap-0 mb-6">
            {[
              { num: 1, label: 'Contextual Content', desc: 'entries[subId:signal]', color: 'bg-green-50 border-green-200' },
              { num: 2, label: 'Signal Path Mapping', desc: 'signalPathMappings', color: 'bg-amber-50 border-amber-200' },
              { num: 3, label: 'Empty Arrays', desc: 'Last resort', color: 'bg-gray-50 border-gray-200' },
            ].map((p, i) => (
              <React.Fragment key={p.num}>
                {i > 0 && <div className="flex items-center px-1"><ChevronRight className="w-4 h-4 text-gray-300" /></div>}
                <div className={`flex-1 p-3 rounded-lg border ${p.color} text-center`}>
                  <div className="text-xs font-bold text-gray-600">#{p.num}</div>
                  <div className="text-sm font-semibold text-gray-800">{p.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* ═══════════════════════════════════════════
              SECTION 11: Kiosk & Idle Timeout
              ═══════════════════════════════════════════ */}
          <SectionHeading id="kiosk-idle" number={11} title="Kiosk & Idle Timeout" icon={<Monitor className="w-5 h-5" />} />

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <InfoCard title="Kiosk Mode Prevents" variant="rose">
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Pinch-zoom (multi-touch gestures)</li>
                <li>Pull-to-refresh (overscroll bounce)</li>
                <li>Edge swipe navigation</li>
                <li>Context menu (long press)</li>
                <li>Text selection</li>
                <li>Keyboard shortcuts (Ctrl+/-, F5, F11, etc.)</li>
              </ul>
            </InfoCard>
            <InfoCard title="Idle Timeout Flow" variant="blue">
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>User inactive for 120 seconds</li>
                <li>Warning modal with countdown circle</li>
                <li>"Tap to Continue" → timer resets</li>
                <li>Countdown → 0 → reset to Landing</li>
              </ol>
              <div className="mt-2 text-xs">
                <strong>Tracked events:</strong> touchstart, mousemove, keydown, pointerdown, scroll
              </div>
            </InfoCard>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Config</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600 border-b">Default</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="px-4 py-2 font-mono text-xs">idleTimeoutMs</td><td className="px-4 py-2 text-center font-bold">120000</td><td className="px-4 py-2 text-gray-600">2 minutes before idle warning</td></tr>
                <tr className="border-b"><td className="px-4 py-2 font-mono text-xs">warningMs</td><td className="px-4 py-2 text-center font-bold">15000</td><td className="px-4 py-2 text-gray-600">15 seconds warning countdown</td></tr>
                <tr><td className="px-4 py-2 font-mono text-xs">enabled</td><td className="px-4 py-2 text-center font-bold">true</td><td className="px-4 py-2 text-gray-600">Disabled on landing screen</td></tr>
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════════
              SECTION 12: Artifact System
              ═══════════════════════════════════════════ */}
          <SectionHeading id="artifact-system" number={12} title="Artifact System" icon={<Database className="w-5 h-5" />} />

          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            Dynamic loading of IBM solution artifacts (videos, PDFs, architecture diagrams) from Azure Blob Storage.
          </p>

          <Collapsible title="Loading Flow" defaultOpen>
            <ol className="list-decimal list-inside space-y-2 mt-3 text-sm text-gray-700">
              <li>Hook <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">useArtifacts(offeringGroup)</code> receives offering group ("DT", "AMM", "DPDE")</li>
              <li>Fetches artifact manifest from Azure Blob Storage via <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">artifactService.ts</code></li>
              <li>Falls back to static manifest if Blob Storage unavailable</li>
              <li>Returns array of <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">IBMOffer</code> objects with media URLs</li>
              <li>Caches results for 5 minutes (TTL)</li>
            </ol>
          </Collapsible>

          <Collapsible title="Artifact Types" className="mt-3 mb-8">
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Type</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Formats</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Display</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Video', 'MP4, WebM', 'Native video player with controls'],
                    ['Architecture', 'PNG, JPG', 'Image with zoom modal'],
                    ['Tool', 'PDF, PPTX, XLSX', 'DocumentCard with download'],
                    ['Document', 'PDF', 'Embedded iframe'],
                    ['Demo', 'Various', 'Interactive demo link'],
                  ].map(([type, formats, display]) => (
                    <tr key={type} className="border-b last:border-0">
                      <td className="px-4 py-2 font-semibold text-gray-800">{type}</td>
                      <td className="px-4 py-2 text-gray-600 font-mono text-xs">{formats}</td>
                      <td className="px-4 py-2 text-gray-600">{display}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>

          {/* ═══════════════════════════════════════════
              SECTION 13: Components Reference
              ═══════════════════════════════════════════ */}
          <SectionHeading id="components" number={13} title="Components Reference" icon={<Palette className="w-5 h-5" />} />

          <Collapsible title="Navigator Components" defaultOpen>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Component</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">File</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['LandingScreen', 'navigator/LandingScreen.tsx', 'Welcome screen with CTA button'],
                    ['ScenarioSelector', 'navigator/ScenarioSelector.tsx', '8 scenario cards grouped by offering'],
                    ['SubScenarioSelector', 'navigator/SubScenarioSelector.tsx', '4 sub-scenario cards per scenario'],
                    ['QuestionFlow', 'navigator/QuestionFlow.tsx', 'Question display with 4 option buttons'],
                    ['RecommendationScreen', 'navigator/RecommendationScreen.tsx', 'Full results page with artifacts'],
                    ['IdleWarningModal', 'navigator/IdleWarningModal.tsx', 'Timeout warning with countdown'],
                    ['NavigatorLayout', 'navigator/NavigatorLayout.tsx', 'Header/footer layout wrapper'],
                    ['DocumentCard', 'navigator/DocumentCard.tsx', 'Office file card (PPTX/XLSX/PDF)'],
                    ['ZoomableMediaModal', 'navigator/ZoomableMediaModal.tsx', 'Full-screen media viewer with zoom'],
                  ].map(([name, file, purpose]) => (
                    <tr key={name} className="border-b last:border-0 hover:bg-blue-50/30">
                      <td className="px-4 py-2 font-semibold text-indigo-700">{name}</td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-600">{file}</td>
                      <td className="px-4 py-2 text-gray-600">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>

          <Collapsible title="Visualization Components" className="mt-3">
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Component</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Screen</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['HeroConstellation', 'Landing'],
                    ['FlowStreams', 'Scenario Selection'],
                    ['ConvergeFocus', 'Sub-Scenario Selection'],
                    ['PulseOrbs', 'Questions'],
                    ['RevealPremium', 'Recommendation'],
                  ].map(([name, screen]) => (
                    <tr key={name} className="border-b last:border-0">
                      <td className="px-4 py-2 font-semibold text-gray-800">{name}</td>
                      <td className="px-4 py-2 text-gray-600">{screen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>

          <Collapsible title="Animation Patterns" className="mt-3 mb-8">
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <strong>Page transitions:</strong> Framer Motion AnimatePresence mode="wait"
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <strong>Landing:</strong> Opacity fade (0.3s)
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <strong>Scenario/SubScenario:</strong> Y-slide + opacity (0.35s, easeOut)
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <strong>Questions:</strong> X-slide + opacity (0.35s, easeOut)
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <strong>Results:</strong> Scale + opacity (0.4s, easeOut)
              </div>
            </div>
          </Collapsible>

          {/* ═══════════════════════════════════════════
              SECTION 14: Configuration & Labels
              ═══════════════════════════════════════════ */}
          <SectionHeading id="configuration" number={14} title="Configuration & Labels" icon={<Settings className="w-5 h-5" />} />

          <Collapsible title="Default Labels (src/data/labels.ts)" defaultOpen>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Key</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Default Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['landing.heading', 'Digital Transformation Navigator'],
                    ['landing.subtitle', 'Discover your transformation path with IBM + Microsoft'],
                    ['landing.attribution', 'Powered by IBM Consulting'],
                    ['landing.cta', 'Begin Your Journey'],
                    ['scenario.heading', 'What best describes your current challenge?'],
                    ['scenario.group.DT', 'Data Transformation'],
                    ['scenario.group.AMM', 'App Modernization'],
                    ['scenario.group.DPDE', 'Product Engineering'],
                    ['subscenario.heading', 'Tell us more..'],
                    ['question.backToSub', 'Back to sub-scenarios'],
                    ['question.backPrevious', 'Previous question'],
                    ['results.badge', 'Personalized Recommendation'],
                    ['results.heading', 'Your Transformation Path'],
                    ['results.badgePrimary', 'Primary'],
                    ['results.badgeSupporting', 'Supporting'],
                    ['results.badgeOptional', 'Optional'],
                    ['results.startOver', 'Start Over'],
                    ['idle.title', 'Still exploring?'],
                    ['idle.cta', 'Tap to Continue'],
                    ['layout.location', 'Bangalore'],
                    ['layout.date', 'March 8, 2026'],
                  ].map(([key, value]) => (
                    <tr key={key} className="border-b last:border-0 hover:bg-blue-50/30">
                      <td className="px-4 py-2 font-mono text-xs text-indigo-700">{key}</td>
                      <td className="px-4 py-2 text-gray-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>

          <Collapsible title="Default Config" className="mt-3 mb-8">
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Key</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-600 border-b">Default</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 border-b">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['idleTimeoutMs', '120000', '2 minutes before idle warning'],
                    ['warningMs', '15000', '15 seconds warning countdown'],
                    ['supportingThreshold', '0.4', '40% of primary = supporting tier'],
                    ['optionalThreshold', '0.25', '25% of primary = optional tier'],
                    ['minScoreToDisplay', '10', 'Minimum score to show offering'],
                    ['backgroundMode', '0', '0 = animated, 1 = static'],
                  ].map(([key, val, desc]) => (
                    <tr key={key} className="border-b last:border-0">
                      <td className="px-4 py-2 font-mono text-xs">{key}</td>
                      <td className="px-4 py-2 text-center font-bold">{val}</td>
                      <td className="px-4 py-2 text-gray-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
            <p>Generated from source code analysis of the MicrosoftNavigator project.</p>
            <p className="mt-1">8 scenarios • 32 sub-scenarios • 160 questions • 640 options • 55 signal paths</p>
          </div>
        </div>
      </main>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center justify-center transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

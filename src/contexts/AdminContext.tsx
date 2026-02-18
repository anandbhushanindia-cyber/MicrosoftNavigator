import React, { createContext, useContext, useMemo } from 'react';
import { useAdminMode } from '../hooks/useAdminMode';
import { DEFAULT_LABELS, DEFAULT_CONFIG } from '../data/labels';
import scenariosData from '../data/scenarios.json';
import type { Scenario, SignalOfferingMapping } from '../types/navigator.types';

// ─── Context shape ───
interface AdminContextValue {
  isAdminMode: boolean;
  setIsAdminMode: (v: boolean) => void;

  // Labels (hardcoded UI strings)
  getLabel: (key: string) => string;
  setLabel: (key: string, value: string) => void;

  // Scenario data (merged defaults + overrides)
  getScenarios: () => Scenario[];
  getSignalMatrix: () => SignalOfferingMapping[];
  updateScenarioField: (scenarioId: string, fieldPath: string, value: unknown) => void;

  // Config values
  getConfig: (key: string) => number;
  setConfig: (key: string, value: number) => void;

  // Import / Export / Reset
  exportConfig: () => void;
  importConfig: (file: File) => Promise<void>;
  resetToDefaults: () => void;

  // Triple-tap handler (for header logo area)
  handleTripleTap: () => void;

  // Change tracking
  hasChanges: boolean;
  changeCount: number;
}

const AdminContext = createContext<AdminContextValue | null>(null);

// ─── Provider ───
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const admin = useAdminMode();

  // Merge scenario data: defaults + overrides
  const mergedScenarios = useMemo((): Scenario[] => {
    const defaults = scenariosData.scenarios as Scenario[];
    return defaults.map(scenario => {
      const override = admin.getScenarioOverride(scenario.id);
      if (!override || Object.keys(override).length === 0) return scenario;
      return deepMergeScenario(scenario, override);
    });
  }, [admin.getScenarioOverride, admin.overrides.scenarios]);

  const signalMatrix = useMemo(
    () => scenariosData.signalMappingMatrix as SignalOfferingMapping[],
    [],
  );

  // Label getter with fallback to defaults
  const getLabel = (key: string): string => {
    return admin.getLabel(key, DEFAULT_LABELS[key] ?? key);
  };

  // Config getter with fallback to defaults
  const getConfig = (key: string): number => {
    return admin.getConfig(key, DEFAULT_CONFIG[key] ?? 0);
  };

  const value: AdminContextValue = {
    isAdminMode: admin.isAdminMode,
    setIsAdminMode: admin.setIsAdminMode,
    getLabel,
    setLabel: admin.setLabel,
    getScenarios: () => mergedScenarios,
    getSignalMatrix: () => signalMatrix,
    updateScenarioField: admin.updateScenarioField,
    getConfig,
    setConfig: admin.setConfig,
    exportConfig: admin.exportConfig,
    importConfig: admin.importConfig,
    resetToDefaults: admin.resetToDefaults,
    handleTripleTap: admin.handleTripleTap,
    hasChanges: admin.hasChanges,
    changeCount: admin.changeCount,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

// ─── Hook ───
export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}

// ─── Deep merge utility for scenario overrides ───
function deepMergeScenario(scenario: Scenario, override: Record<string, unknown>): Scenario {
  const merged = { ...scenario } as Record<string, unknown>;

  for (const [key, overrideVal] of Object.entries(override)) {
    if (key === 'subScenarios' && typeof overrideVal === 'object' && overrideVal !== null) {
      // Merge sub-scenarios by ID, including nested questions
      merged.subScenarios = scenario.subScenarios.map(ss => {
        const ssOverride = (overrideVal as Record<string, unknown>)[ss.id];
        if (!ssOverride || typeof ssOverride !== 'object') return ss;
        const ssMerged = { ...ss, ...(ssOverride as Record<string, unknown>) };

        // Deep-merge questions within each sub-scenario
        const qOverrides = (ssOverride as Record<string, unknown>).questions;
        if (qOverrides && typeof qOverrides === 'object' && ss.questions) {
          ssMerged.questions = ss.questions.map(q => {
            const qOverride = (qOverrides as Record<string, unknown>)[q.id];
            if (!qOverride || typeof qOverride !== 'object') return q;
            const qMerged = { ...q, ...(qOverride as Record<string, unknown>) };
            // Merge options by ID if present
            const optOverrides = (qOverride as Record<string, unknown>).options;
            if (optOverrides && typeof optOverrides === 'object') {
              qMerged.options = q.options.map(opt => {
                const optOvr = (optOverrides as Record<string, unknown>)[opt.id];
                if (!optOvr || typeof optOvr !== 'object') return opt;
                return { ...opt, ...(optOvr as Record<string, unknown>) };
              });
            }
            return qMerged;
          });
        }

        return ssMerged;
      });
    } else if (key === 'signalPathMappings' && typeof overrideVal === 'object' && overrideVal !== null) {
      // Merge signal path mappings by signalPath key
      merged.signalPathMappings = scenario.signalPathMappings.map(spm => {
        const spmOverride = (overrideVal as Record<string, unknown>)[spm.signalPath];
        if (!spmOverride || typeof spmOverride !== 'object') return spm;
        return { ...spm, ...(spmOverride as Record<string, unknown>) };
      });
    } else {
      // Simple field override (title, description, etc.)
      merged[key] = overrideVal;
    }
  }

  return merged as unknown as Scenario;
}

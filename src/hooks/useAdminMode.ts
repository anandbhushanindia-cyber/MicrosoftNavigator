import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'navigator_admin_overrides';

export interface AdminOverrides {
  labels: Record<string, string>;
  scenarios: Record<string, Record<string, unknown>>;
  signalMappingMatrix: Record<string, Record<string, number>>;
  config: Record<string, number>;
}

const EMPTY_OVERRIDES: AdminOverrides = {
  labels: {},
  scenarios: {},
  signalMappingMatrix: {},
  config: {},
};

function loadOverrides(): AdminOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_OVERRIDES };
    const parsed = JSON.parse(raw);
    return {
      labels: parsed.labels || {},
      scenarios: parsed.scenarios || {},
      signalMappingMatrix: parsed.signalMappingMatrix || {},
      config: parsed.config || {},
    };
  } catch {
    return { ...EMPTY_OVERRIDES };
  }
}

function saveOverrides(overrides: AdminOverrides): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    console.warn('Failed to save admin overrides to localStorage');
  }
}

function countChanges(overrides: AdminOverrides): number {
  let count = Object.keys(overrides.labels).length;
  count += Object.keys(overrides.config).length;
  // Count scenario-level changes recursively
  for (const scenarioOverride of Object.values(overrides.scenarios)) {
    count += countObjectLeaves(scenarioOverride);
  }
  for (const matrixOverride of Object.values(overrides.signalMappingMatrix)) {
    count += Object.keys(matrixOverride).length;
  }
  return count;
}

function countObjectLeaves(obj: unknown): number {
  if (obj === null || obj === undefined) return 0;
  if (typeof obj !== 'object') return 1;
  if (Array.isArray(obj)) return obj.length;
  let count = 0;
  for (const val of Object.values(obj as Record<string, unknown>)) {
    count += countObjectLeaves(val);
  }
  return count;
}

export function useAdminMode() {
  const [isAdminMode, setIsAdminMode] = useState(() => {
    // Check URL param on init
    const params = new URLSearchParams(window.location.search);
    return params.get('admin') === 'true';
  });
  const [overrides, setOverrides] = useState<AdminOverrides>(loadOverrides);

  // Persist overrides whenever they change
  useEffect(() => {
    saveOverrides(overrides);
  }, [overrides]);

  // Ctrl+Shift+A keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdminMode(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Toggle text selection based on admin mode
  useEffect(() => {
    if (isAdminMode) {
      document.body.style.userSelect = 'text';
      (document.body.style as unknown as Record<string, string>).webkitUserSelect = 'text';
    } else {
      document.body.style.userSelect = 'none';
      (document.body.style as unknown as Record<string, string>).webkitUserSelect = 'none';
    }
  }, [isAdminMode]);

  // --- Label operations ---
  const getLabel = useCallback(
    (key: string, defaultValue: string): string => {
      return overrides.labels[key] ?? defaultValue;
    },
    [overrides.labels],
  );

  const setLabel = useCallback((key: string, value: string) => {
    setOverrides(prev => ({
      ...prev,
      labels: { ...prev.labels, [key]: value },
    }));
  }, []);

  // --- Scenario data operations ---
  const getScenarioOverride = useCallback(
    (scenarioId: string): Record<string, unknown> => {
      return overrides.scenarios[scenarioId] || {};
    },
    [overrides.scenarios],
  );

  const updateScenarioField = useCallback(
    (scenarioId: string, fieldPath: string, value: unknown) => {
      setOverrides(prev => {
        const scenarioCopy = { ...(prev.scenarios[scenarioId] || {}) };
        setNestedValue(scenarioCopy, fieldPath, value);
        return {
          ...prev,
          scenarios: { ...prev.scenarios, [scenarioId]: scenarioCopy },
        };
      });
    },
    [],
  );

  // --- Config operations ---
  const getConfig = useCallback(
    (key: string, defaultValue: number): number => {
      return overrides.config[key] ?? defaultValue;
    },
    [overrides.config],
  );

  const setConfig = useCallback((key: string, value: number) => {
    setOverrides(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value },
    }));
  }, []);

  // --- Export ---
  const exportConfig = useCallback(() => {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `navigator-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [overrides]);

  // --- Import ---
  const importConfig = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<AdminOverrides>;
      setOverrides({
        labels: parsed.labels || {},
        scenarios: parsed.scenarios || {},
        signalMappingMatrix: parsed.signalMappingMatrix || {},
        config: parsed.config || {},
      });
    } catch (err) {
      console.error('Failed to import config:', err);
      alert('Invalid config file. Please upload a valid JSON file.');
    }
  }, []);

  // --- Reset ---
  const resetToDefaults = useCallback(() => {
    setOverrides({ ...EMPTY_OVERRIDES });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // --- Triple-tap detection ref (for header logo) ---
  const tripleTapRef = useRef<number[]>([]);
  const handleTripleTap = useCallback(() => {
    const now = Date.now();
    tripleTapRef.current.push(now);
    // Keep only last 3 taps
    if (tripleTapRef.current.length > 3) {
      tripleTapRef.current = tripleTapRef.current.slice(-3);
    }
    if (tripleTapRef.current.length >= 3) {
      const first = tripleTapRef.current[tripleTapRef.current.length - 3];
      if (now - first < 1000) {
        setIsAdminMode(prev => !prev);
        tripleTapRef.current = [];
      }
    }
  }, []);

  const changeCount = countChanges(overrides);

  return {
    isAdminMode,
    setIsAdminMode,
    overrides,
    getLabel,
    setLabel,
    getScenarioOverride,
    updateScenarioField,
    getConfig,
    setConfig,
    exportConfig,
    importConfig,
    resetToDefaults,
    handleTripleTap,
    hasChanges: changeCount > 0,
    changeCount,
  };
}

// --- Utility: set a value at a dot-separated path in an object ---
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

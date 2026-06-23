import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FrameworkId } from '../types';
import { getControlsByFramework } from '../data/complianceRegistry';

const STORAGE_KEY = 'compstack-state-v1';

interface PersistedState {
  frameworkId: FrameworkId;
  implementedControlIds: string[];
}

function loadFromStorage(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      return parsed;
    }
  } catch {
    // Ignore parse errors
  }
  return { frameworkId: 'soc2', implementedControlIds: [] };
}

function saveToStorage(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

function trackEvent(event: string, props?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.aif?.track) {
    window.aif.track(event, props);
  }
}

export function useComplianceStack() {
  const [state, setState] = useState<PersistedState>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const controls = useMemo(() => getControlsByFramework(state.frameworkId), [state.frameworkId]);

  const implementedControls = useMemo(
    () => controls.filter((c) => state.implementedControlIds.includes(c.id)),
    [controls, state.implementedControlIds],
  );

  const implementedCount = implementedControls.length;
  const totalCount = controls.length;
  const coveragePercentage = totalCount > 0 ? Math.round((implementedCount / totalCount) * 100) : 0;

  const selectFramework = useCallback((frameworkId: FrameworkId) => {
    setState((prev) => {
      // Clear implemented controls that don't belong to the new framework
      const newFrameworkControls = getControlsByFramework(frameworkId);
      const newControlIds = new Set(newFrameworkControls.map((c) => c.id));
      const remaining = prev.implementedControlIds.filter((id) => newControlIds.has(id));
      const next = { frameworkId, implementedControlIds: remaining };
      return next;
    });
    trackEvent('framework_selected', { framework: frameworkId });
  }, []);

  const toggleControl = useCallback((controlId: string) => {
    setState((prev) => {
      const isImplemented = prev.implementedControlIds.includes(controlId);
      const implementedControlIds = isImplemented
        ? prev.implementedControlIds.filter((id) => id !== controlId)
        : [...prev.implementedControlIds, controlId];
      return { ...prev, implementedControlIds };
    });
    trackEvent('control_toggled', { control_id: controlId });
  }, []);

  const isControlImplemented = useCallback(
    (controlId: string) => state.implementedControlIds.includes(controlId),
    [state.implementedControlIds],
  );

  const copyInstallCommand = useCallback((command: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(command).catch(() => {});
    }
    trackEvent('install_command_copied', { command });
  }, []);

  return {
    frameworkId: state.frameworkId,
    controls,
    implementedControls,
    implementedCount,
    totalCount,
    coveragePercentage,
    selectFramework,
    toggleControl,
    isControlImplemented,
    copyInstallCommand,
  };
}

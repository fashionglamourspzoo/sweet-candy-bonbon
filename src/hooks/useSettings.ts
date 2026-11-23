import { useCallback, useSyncExternalStore } from 'react';
import { Settings, progressStore } from '../game/progressStore';

const getSettings = (): Settings => progressStore.load().settings;

/** Individual selector — a screen that only needs the settings does not re-render on score changes. */
export function useSettings(): Settings {
  return useSyncExternalStore(progressStore.subscribe, getSettings, getSettings);
}

export function useReducedMotion(): boolean {
  return useSettings().reducedMotion;
}

export function useSettingsActions() {
  const toggle = useCallback((key: keyof Settings) => {
    const current = progressStore.load().settings;
    const patch = {} as Partial<Settings>;
    patch[key] = !current[key];
    progressStore.saveSettings(patch);
  }, []);

  const resetProgress = useCallback(() => {
    progressStore.reset();
  }, []);

  return { toggle, resetProgress };
}

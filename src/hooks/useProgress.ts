import { useSyncExternalStore } from 'react';
import {
  Progress,
  availableStars,
  earnedStars,
  progressStore,
  recipesDiscovered,
  totalStarsEarned,
} from '../game/progressStore';

/**
 * Every screen reads progress through this hook, which reads the single
 * repository. No component writes stored state directly.
 */
export function useProgress(): Progress {
  return useSyncExternalStore(progressStore.subscribe, progressStore.load, progressStore.load);
}

/** Pull one value instead of subscribing a whole screen to the whole model. */
export function useStars(): number {
  const progress = useProgress();
  return availableStars(progress);
}

export function useEarnedStars(): number {
  const progress = useProgress();
  return earnedStars(progress);
}

export function useStageStars(): number[] {
  return useProgress().stageStars;
}

export function useRecipeCount(): number {
  return recipesDiscovered(useProgress());
}

export function useTotalStageStars(): number {
  return totalStarsEarned(useProgress());
}


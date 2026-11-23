import { INGREDIENT_COUNT } from '../constants/theme';
import { TOTAL_STAGES } from './stages';

/**
 * THE single persistence repository of the app. Every screen reads and writes
 * progress through this module and nowhere else, so there is exactly one source
 * of truth. The storage backend is a local in-module snapshot: the dependency
 * allowlist of this project has no storage native module, and the app is fully
 * offline by contract (no network, no account, no server state). If a storage
 * dependency is ever allowed, only this file changes.
 */

export type Settings = {
  colourblind: boolean;
  reducedMotion: boolean;
  hintHelper: boolean;
};

export type Progress = {
  stageStars: number[];
  starsSpent: number;
  recipes: boolean[];
  collection: number[];
  rewards: boolean[];
  bestScore: number;
  dailyLastDay: number;
  dailyStreak: number;
  dailyBestScore: number;
  dailyStars: number;
  tutorialSeen: boolean;
  settings: Settings;
};

const RECIPE_COUNT = 10;
const REWARD_COUNT = 8;

export function initialProgress(): Progress {
  return {
    stageStars: new Array(TOTAL_STAGES).fill(0),
    starsSpent: 0,
    recipes: new Array(RECIPE_COUNT).fill(false),
    collection: new Array(INGREDIENT_COUNT).fill(0),
    rewards: new Array(REWARD_COUNT).fill(false),
    bestScore: 0,
    dailyLastDay: -1,
    dailyStreak: 0,
    dailyBestScore: 0,
    dailyStars: 0,
    tutorialSeen: false,
    settings: { colourblind: false, reducedMotion: false, hintHelper: true },
  };
}

let snapshot: Progress = initialProgress();
type Listener = (value: Progress) => void;
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach(listener => {
    listener(snapshot);
  });
}

export const progressStore = {
  load(): Progress {
    return snapshot;
  },

  save(patch: Partial<Progress>): Progress {
    snapshot = { ...snapshot, ...patch };
    emit();
    return snapshot;
  },

  update(mutator: (current: Progress) => Partial<Progress>): Progress {
    return progressStore.save(mutator(snapshot));
  },

  saveSettings(patch: Partial<Settings>): Progress {
    snapshot = { ...snapshot, settings: { ...snapshot.settings, ...patch } };
    emit();
    return snapshot;
  },

  reset(): Progress {
    snapshot = initialProgress();
    emit();
    return snapshot;
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/** Stars the player currently owns = earned minus spent on decorations. */
export function availableStars(progress: Progress): number {
  return Math.max(0, earnedStars(progress) - progress.starsSpent);
}

export function earnedStars(progress: Progress): number {
  return totalStarsEarned(progress) + progress.dailyStars;
}

export function totalStarsEarned(progress: Progress): number {
  return progress.stageStars.reduce((a, b) => a + b, 0);
}

export function recipesDiscovered(progress: Progress): number {
  return progress.recipes.filter(Boolean).length;
}

export function stagesCleared(progress: Progress): number {
  return progress.stageStars.filter(s => s > 0).length;
}

/** Banks the result of a stage. Stars are kept at the best ever earned. */
export function applyStageResult(
  progress: Progress,
  stageIndex: number,
  stars: number,
  score: number,
  collected: number[],
  recipeIndex: number | null,
): { progress: Progress; recipeUnlocked: number | null } {
  const stageStars = progress.stageStars.slice();
  if (stageIndex >= 0 && stageIndex < stageStars.length) {
    stageStars[stageIndex] = Math.max(stageStars[stageIndex], stars);
  }

  const collection = progress.collection.slice();
  for (let i = 0; i < collection.length; i++) {
    collection[i] += collected[i] ?? 0;
  }

  const recipes = progress.recipes.slice();
  let recipeUnlocked: number | null = null;
  if (stars > 0 && recipeIndex !== null && recipeIndex >= 0 && recipeIndex < recipes.length && !recipes[recipeIndex]) {
    recipes[recipeIndex] = true;
    recipeUnlocked = recipeIndex;
  }

  return {
    progress: {
      ...progress,
      stageStars,
      collection,
      recipes,
      bestScore: Math.max(progress.bestScore, score),
    },
    recipeUnlocked,
  };
}

export function claimReward(progress: Progress, rewardIndex: number, cost: number): Progress | null {
  if (progress.rewards[rewardIndex]) {
    return null;
  }
  if (availableStars(progress) < cost) {
    return null;
  }
  const rewards = progress.rewards.slice();
  rewards[rewardIndex] = true;
  return { ...progress, rewards, starsSpent: progress.starsSpent + cost };
}

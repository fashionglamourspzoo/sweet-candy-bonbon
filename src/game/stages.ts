import { PAR_PER_MOVE, STARS_PER_LOCATION } from '../constants/config';
import { Objective, StageDef } from './types';

export type LocationDef = {
  index: number;
  name: string;
  accent: string;
  starsToOpen: number;
};

export const LOCATIONS: LocationDef[] = [
  { index: 0, name: 'STRAWBERRY MEADOW', accent: '#FF4F7B', starsToOpen: 0 },
  { index: 1, name: 'LEMON GROVE', accent: '#FFC531', starsToOpen: STARS_PER_LOCATION },
  { index: 2, name: 'GRAPE ARBOUR', accent: '#9B59B6', starsToOpen: STARS_PER_LOCATION * 2 },
  { index: 3, name: 'MINT HOLLOW', accent: '#3FD0A6', starsToOpen: STARS_PER_LOCATION * 3 },
];

export const STAGES_PER_LOCATION = 5;
export const TOTAL_STAGES = LOCATIONS.length * STAGES_PER_LOCATION;

/** Sugar budget: 8..16 in the first garden, +2 per garden, hard cap 24. */
const BASE_MOVES = [8, 10, 12, 14, 16];

/** Syrup cells grow 0 -> 14 across the run. */
const SYRUP_BY_STAGE = [0, 0, 3, 4, 5, 4, 5, 6, 7, 8, 6, 7, 8, 10, 11, 9, 10, 12, 13, 14];

/** Collect targets grow 10 -> 34. */
const COLLECT_BY_STAGE = [10, 12, 14, 16, 18, 18, 20, 21, 22, 24, 24, 25, 26, 28, 29, 29, 30, 31, 32, 34];

export type RecipeDef = {
  index: number;
  name: string;
  ingredients: number[];
  stageIndex: number;
};

export const RECIPES: RecipeDef[] = [
  { index: 0, name: 'STRAWBERRY BONBON', ingredients: [0, 0, 4], stageIndex: 0 },
  { index: 1, name: 'LEMON DROP SWIRL', ingredients: [1, 1, 4], stageIndex: 2 },
  { index: 2, name: 'MEADOW GUMDROP', ingredients: [0, 3, 1], stageIndex: 4 },
  { index: 3, name: 'CITRUS TAFFY ROLL', ingredients: [1, 4, 4], stageIndex: 6 },
  { index: 4, name: 'GRAPE FONDANT CUBE', ingredients: [2, 2, 3], stageIndex: 8 },
  { index: 5, name: 'ARBOUR LOLLIPOP', ingredients: [2, 0, 1], stageIndex: 10 },
  { index: 6, name: 'MINT CREAM PEARL', ingredients: [3, 3, 2], stageIndex: 12 },
  { index: 7, name: 'CARAMEL RIBBON BAR', ingredients: [4, 4, 0], stageIndex: 14 },
  { index: 8, name: 'HOLLOW FROST DRAGEE', ingredients: [3, 1, 2], stageIndex: 16 },
  { index: 9, name: 'ATELIER RAINBOW BONBON', ingredients: [0, 1, 2, 3, 4], stageIndex: 18 },
];

export type RewardDef = {
  index: number;
  name: string;
  cost: number;
  shape: 'lantern' | 'arch' | 'bench' | 'fountain' | 'fence' | 'tree' | 'birdhouse' | 'gate';
  accent: string;
};

/** Decorative atelier items only — cosmetic, bought with earned stars, never with money. */
export const REWARDS: RewardDef[] = [
  { index: 0, name: 'SUGAR LANTERN', cost: 5, shape: 'lantern', accent: '#FFB300' },
  { index: 1, name: 'CANDY ARCH', cost: 10, shape: 'arch', accent: '#FF2E86' },
  { index: 2, name: 'MARZIPAN BENCH', cost: 15, shape: 'bench', accent: '#FF8A3D' },
  { index: 3, name: 'GUMDROP FOUNTAIN', cost: 20, shape: 'fountain', accent: '#5B8DEF' },
  { index: 4, name: 'RIBBON FENCE', cost: 25, shape: 'fence', accent: '#9B59B6' },
  { index: 5, name: 'LOLLIPOP TREE', cost: 30, shape: 'tree', accent: '#3FD0A6' },
  { index: 6, name: 'FONDANT BIRDHOUSE', cost: 40, shape: 'birdhouse', accent: '#FF4F7B' },
  { index: 7, name: 'PRALINE GATE', cost: 50, shape: 'gate', accent: '#FFC531' },
];

function objectivesFor(stageIndex: number, location: number, moves: number, syrup: number): Objective[] {
  const out: Objective[] = [];
  const ing = (location + Math.floor(stageIndex / 2)) % 5;
  out.push({ kind: 'collect', ing, target: COLLECT_BY_STAGE[stageIndex] });
  if (syrup > 0) {
    out.push({ kind: 'syrup', target: syrup });
  } else if (stageIndex % 5 === 1) {
    out.push({ kind: 'score', target: moves * PAR_PER_MOVE });
  }
  return out;
}

function buildStage(stageIndex: number): StageDef {
  const location = Math.floor(stageIndex / STAGES_PER_LOCATION);
  const numberInLocation = stageIndex % STAGES_PER_LOCATION;
  const moves = Math.min(24, BASE_MOVES[numberInLocation] + location * 2);
  const syrup = SYRUP_BY_STAGE[stageIndex];
  const recipe = RECIPES.find(r => r.stageIndex === stageIndex);
  return {
    index: stageIndex,
    location,
    numberInLocation,
    title: `STAGE ${stageIndex + 1} · ${LOCATIONS[location].name}`,
    moves,
    syrup,
    palette: 5,
    objectives: objectivesFor(stageIndex, location, moves, syrup),
    par: moves * PAR_PER_MOVE,
    recipe: recipe ? recipe.index : null,
  };
}

export const STAGES: StageDef[] = Array.from({ length: TOTAL_STAGES }, (_v, i) => buildStage(i));

export const getStage = (index: number): StageDef =>
  STAGES[Math.max(0, Math.min(STAGES.length - 1, index))];

export function locationUnlocked(location: number, totalStars: number): boolean {
  return totalStars >= LOCATIONS[location].starsToOpen;
}

export function stageUnlocked(stageIndex: number, stageStars: number[], totalStars: number): boolean {
  if (stageIndex === 0) {
    return true;
  }
  const stage = getStage(stageIndex);
  if (!locationUnlocked(stage.location, totalStars)) {
    return false;
  }
  return (stageStars[stageIndex - 1] ?? 0) > 0;
}

export function nextStageIndex(stageIndex: number, stageStars: number[], totalStars: number): number | null {
  const candidate = stageIndex + 1;
  if (candidate >= TOTAL_STAGES) {
    return null;
  }
  const stage = getStage(candidate);
  return locationUnlocked(stage.location, totalStars) ? candidate : null;
}

/** First stage that has not been cleared yet — where PLAY and the tutorial send the player. */
export function currentStageIndex(stageStars: number[], totalStars: number): number {
  for (let i = 0; i < TOTAL_STAGES; i++) {
    if ((stageStars[i] ?? 0) === 0) {
      return locationUnlocked(getStage(i).location, totalStars) ? i : Math.max(0, i - 1);
    }
  }
  return TOTAL_STAGES - 1;
}

export const starsInLocation = (location: number, stageStars: number[]): number => {
  let sum = 0;
  for (let i = 0; i < STAGES_PER_LOCATION; i++) {
    sum += stageStars[location * STAGES_PER_LOCATION + i] ?? 0;
  }
  return sum;
};

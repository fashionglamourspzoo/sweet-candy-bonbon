import {
  COMBO_CAP,
  COMBO_STEP,
  POINTS_PER_CANDY,
  STAR_THREE_FACTOR,
  STAR_TWO_FACTOR,
  STREAK_LADDER,
} from '../constants/config';
import { Objective } from './types';

/** Cascade depth 1 => x1, depth 2 => x1.5, depth 3 => x2 ... capped at x3. */
export function comboMultiplier(depth: number): number {
  const raw = 1 + COMBO_STEP * (Math.max(1, depth) - 1);
  return Math.min(COMBO_CAP, Math.round(raw * 100) / 100);
}

/** Caramel streak climbs only on productive moves: 1 -> 1.2 -> 1.5 -> 2 (cap). */
export const RUSH_LADDER = [1, 1.2, 1.5, 2, 2.5, 3] as const;

export function nextStreak(current: number, ladder: readonly number[] = STREAK_LADDER): number {
  const i = ladder.indexOf(current);
  if (i < 0) {
    return ladder[0];
  }
  return ladder[Math.min(ladder.length - 1, i + 1)];
}

export const resetStreak = (): number => STREAK_LADDER[0];

export function scoreForClear(candies: number, depth: number, streak: number): number {
  return Math.round(candies * POINTS_PER_CANDY * comboMultiplier(depth) * streak);
}

export function parForStage(movesTotal: number, perMove: number): number {
  return movesTotal * perMove;
}

export function starsFor(won: boolean, score: number, par: number): number {
  if (!won) {
    return 0;
  }
  let stars = 1;
  if (score >= par * STAR_TWO_FACTOR) {
    stars += 1;
  }
  if (score >= par * STAR_THREE_FACTOR) {
    stars += 1;
  }
  return Math.min(3, stars);
}

export type ObjectiveState = {
  objective: Objective;
  current: number;
  target: number;
  done: boolean;
};

export function objectiveState(
  objective: Objective,
  collected: number[],
  syrupCleared: number,
  score: number,
): ObjectiveState {
  let current = 0;
  if (objective.kind === 'collect') {
    current = collected[objective.ing] ?? 0;
  } else if (objective.kind === 'syrup') {
    current = syrupCleared;
  } else {
    current = score;
  }
  const capped = Math.min(current, objective.target);
  return { objective, current: capped, target: objective.target, done: current >= objective.target };
}

export function allObjectivesDone(
  objectives: Objective[],
  collected: number[],
  syrupCleared: number,
  score: number,
): boolean {
  if (objectives.length === 0) {
    return false;
  }
  return objectives.every(o => objectiveState(o, collected, syrupCleared, score).done);
}

export type RoundStatus = 'idle' | 'resolving' | 'complete' | 'outOfSugar';

/**
 * A stage never ends on its own: only a met objective or an empty sugar budget
 * ends it, so a player who does nothing cannot lose.
 */
export function evaluateRound(
  objectives: Objective[],
  collected: number[],
  syrupCleared: number,
  score: number,
  movesLeft: number,
  timeLeft: number | null,
): RoundStatus {
  if (allObjectivesDone(objectives, collected, syrupCleared, score)) {
    return 'complete';
  }
  if (movesLeft <= 0) {
    return 'outOfSugar';
  }
  if (timeLeft !== null && timeLeft <= 0) {
    return 'outOfSugar';
  }
  return 'idle';
}

export const sumCollected = (collected: number[]): number =>
  collected.reduce((a, b) => a + b, 0);

export function milestoneFor(total: number, milestones: number[]): { next: number; progress: number } {
  for (const m of milestones) {
    if (total < m) {
      return { next: m, progress: Math.min(1, total / m) };
    }
  }
  const last = milestones[milestones.length - 1] || 1;
  return { next: last, progress: 1 };
}

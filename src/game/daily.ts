import {
  DAILY_MOVES,
  DAILY_STARS,
  DAILY_TARGET,
  DAILY_TIMED_BONUS,
  DAILY_TIMED_SECONDS,
} from '../constants/config';
import { Objective, StageDef } from './types';

export type DailyModifier = {
  key: 'doubleSyrup' | 'caramelRush' | 'narrowPalette';
  name: string;
  description: string;
  accent: string;
};

export const DAILY_MODIFIERS: DailyModifier[] = [
  {
    key: 'doubleSyrup',
    name: 'DOUBLE SYRUP',
    description: 'TWICE AS MANY SYRUP CELLS, MANY OF THEM TWO LAYERS DEEP',
    accent: '#FFB300',
  },
  {
    key: 'caramelRush',
    name: 'CARAMEL RUSH',
    description: 'THE CARAMEL STREAK CLIMBS TO x3 INSTEAD OF x2',
    accent: '#FF8A3D',
  },
  {
    key: 'narrowPalette',
    name: 'NARROW PALETTE',
    description: 'ONLY FOUR CANDY KINDS — MATCHES COME FASTER, SO DO MISTAKES',
    accent: '#9B59B6',
  },
];

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** Whole days since the epoch — the daily seed and the "already played today" key. */
export function dayIndex(now: Date = new Date()): number {
  const utc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor(utc / 86400000);
}

export function dayLabel(now: Date = new Date()): string {
  return `${now.getDate()} ${MONTHS[now.getMonth()]}`;
}

export function modifierForDay(day: number): DailyModifier {
  const i = ((day % DAILY_MODIFIERS.length) + DAILY_MODIFIERS.length) % DAILY_MODIFIERS.length;
  return DAILY_MODIFIERS[i];
}

export const DAILY_STAGE_INDEX = 1000;

/** The daily run is a normal limited-move stage with the modifier of the day applied. */
export function dailyStage(day: number): StageDef {
  const modifier = modifierForDay(day);
  const syrup = modifier.key === 'doubleSyrup' ? 12 : 6;
  const ing = ((day % 5) + 5) % 5;
  const objectives: Objective[] = [
    { kind: 'collect', ing, target: DAILY_TARGET },
    { kind: 'syrup', target: syrup },
  ];
  return {
    index: DAILY_STAGE_INDEX,
    location: 0,
    numberInLocation: 0,
    title: `DAILY CHALLENGE · ${modifier.name}`,
    moves: DAILY_MOVES,
    syrup,
    palette: modifier.key === 'narrowPalette' ? 4 : 5,
    objectives,
    par: DAILY_MOVES * 220,
    recipe: null,
  };
}

export const dailyTimerSeconds = (timed: boolean): number | null =>
  timed ? DAILY_TIMED_SECONDS : null;

export const dailyStarReward = (timed: boolean): number =>
  DAILY_STARS + (timed ? DAILY_TIMED_BONUS : 0);

/** Seven day dots: which of the last 7 days were completed. */
export function streakDots(lastDay: number, streak: number, today: number): boolean[] {
  const out: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = today - i;
    const completed = day <= lastDay && day > lastDay - streak;
    out.push(completed);
  }
  return out;
}

export function nextStreakValue(lastDay: number, streak: number, today: number): number {
  if (lastDay === today) {
    return streak;
  }
  if (lastDay === today - 1) {
    return streak + 1;
  }
  return 1;
}

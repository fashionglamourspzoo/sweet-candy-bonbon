import { Dimensions } from 'react-native';

const win = Dimensions.get('window');
export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/**
 * Splash hold. Fixed product contract: exactly 8000 ms, timer driven,
 * no tap-to-skip and no "continue when ready" path.
 */
export const LOADER_DURATION_MS = 8000;
export const LOADER_BAR_MS = 7600;
export const LOADER_BAR_W = 220;

/** Board geometry — deterministic, computed once (G1 Classic Stack). */
export const COLS = 7;
export const ROWS = 7;
export const CELL_COUNT = COLS * ROWS;

const PAD = 6;
const BORDER = 2;
export const BOARD_FRAME = PAD + BORDER; // 8
const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380, Math.floor(SCREEN_H * 0.44));
export const TILE = Math.max(34, Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / COLS));
export const BOARD_W = TILE * COLS + 2 * BOARD_FRAME;
export const BOARD_H = TILE * ROWS + 2 * BOARD_FRAME;

/** Compact layout switch for short devices. */
export const COMPACT = SCREEN_H < 700;
export const HUB_ROW_H = COMPACT ? 76 : 84;

/** Move economy. */
export const COST_SWAP = 1;
export const COST_BONBON = 1;
export const COST_SUGAR_DROP = 2;
export const COST_BOUNCE = 0;

/** Scoring. */
export const POINTS_PER_CANDY = 10;
export const COMBO_STEP = 0.5;
export const COMBO_CAP = 3;
export const STREAK_LADDER = [1, 1.2, 1.5, 2] as const;
export const PAR_PER_MOVE = 220;
export const STAR_TWO_FACTOR = 1;
export const STAR_THREE_FACTOR = 1.6;

/** Progression. */
export const STARS_PER_LOCATION = 8;
export const MAX_HINTS = 3;
export const GENERATION_ATTEMPTS = 20;

/** Collection milestones. */
export const MILESTONES = [50, 150, 400];

/** Daily challenge. */
export const DAILY_MOVES = 20;
export const DAILY_TARGET = 24;
export const DAILY_TIMED_SECONDS = 90;
export const DAILY_STARS = 2;
export const DAILY_TIMED_BONUS = 1;

/** Animation timings (ms). Multiplied by 0.4 when REDUCED MOTION is on. */
export const TIMING = {
  navFade: 220,
  loaderExit: 300,
  pop: 180,
  cascade: 320,
  swap: 220,
  bounce: 260,
  celebrate: 900,
  comboLabel: 700,
  hintPulse: 1200,
  idleHintAfter: 5000,
  controlHintFor: 6000,
};

export const motion = (ms: number, reduced: boolean) =>
  Math.max(40, Math.round(ms * (reduced ? 0.4 : 1)));

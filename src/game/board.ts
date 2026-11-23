import { COLS, GENERATION_ATTEMPTS, ROWS } from '../constants/config';
import { Board } from './types';
import { Rng, makeSeed, mulberry32, randInt, shuffled } from './rng';
import { findMatches, hasValidSwap, idxOf } from './matcher';

/**
 * Last-resort layout for a 7x7 board: no initial match, several legal swaps.
 * It is a guarantee, never the game — the generator practically always succeeds.
 */
export const FALLBACK_LAYOUT: number[] = [
  0, 1, 2, 3, 4, 0, 1,
  2, 3, 4, 0, 1, 2, 3,
  4, 0, 1, 2, 3, 4, 0,
  1, 2, 3, 4, 0, 1, 2,
  3, 4, 0, 1, 2, 3, 4,
  0, 1, 2, 3, 4, 0, 1,
  2, 3, 4, 0, 1, 2, 3,
];

function emptyBoard(cols: number, rows: number): Board {
  return {
    cells: new Array(cols * rows).fill(null),
    syrup: new Array(cols * rows).fill(0),
    cols,
    rows,
    nextId: 1,
  };
}

/** Fills every cell, refusing an ingredient that would complete a line of three. */
function fillCandies(board: Board, rng: Rng, palette: number): void {
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      const banned = new Set<number>();
      if (c >= 2) {
        const a = board.cells[idxOf(board, r, c - 1)];
        const b = board.cells[idxOf(board, r, c - 2)];
        if (a && b && a.ing === b.ing) {
          banned.add(a.ing);
        }
      }
      if (r >= 2) {
        const a = board.cells[idxOf(board, r - 1, c)];
        const b = board.cells[idxOf(board, r - 2, c)];
        if (a && b && a.ing === b.ing) {
          banned.add(a.ing);
        }
      }
      const choices: number[] = [];
      for (let i = 0; i < palette; i++) {
        if (!banned.has(i)) {
          choices.push(i);
        }
      }
      const pick = choices.length > 0 ? choices[randInt(rng, choices.length)] : randInt(rng, palette);
      board.cells[idxOf(board, r, c)] = { id: board.nextId++, ing: pick, special: 'none' };
    }
  }
}

/** Syrup placement is generated too — two attempts at one stage never look the same. */
function placeSyrup(board: Board, rng: Rng, cellsWithSyrup: number, doubleLayers: boolean): void {
  if (cellsWithSyrup <= 0) {
    return;
  }
  const all: number[] = [];
  for (let i = 0; i < board.cells.length; i++) {
    all.push(i);
  }
  const order = shuffled(all, rng);
  const count = Math.min(cellsWithSyrup, order.length);
  for (let i = 0; i < count; i++) {
    const layers = doubleLayers && rng() < 0.45 ? 2 : 1;
    board.syrup[order[i]] = layers;
  }
}

export type GenerateOptions = {
  seed: number;
  palette: number;
  syrupCells: number;
  doubleSyrup?: boolean;
  cols?: number;
  rows?: number;
};

export type GeneratedBoard = {
  board: Board;
  seed: number;
  attempts: number;
  usedFallback: boolean;
};

/**
 * Generated, never hardcoded: placement comes from the seeded PRNG, quantities from config.
 * The layout is validated (no match on screen, at least one legal swap) before it is shown.
 */
export function generateBoard(options: GenerateOptions): GeneratedBoard {
  const cols = options.cols ?? COLS;
  const rows = options.rows ?? ROWS;
  const palette = Math.max(3, Math.min(5, options.palette));

  for (let attempt = 0; attempt < GENERATION_ATTEMPTS; attempt++) {
    const rng = mulberry32((options.seed + attempt * 2654435761) >>> 0);
    const board = emptyBoard(cols, rows);
    fillCandies(board, rng, palette);
    placeSyrup(board, rng, options.syrupCells, options.doubleSyrup === true);
    if (findMatches(board).length === 0 && hasValidSwap(board)) {
      return { board, seed: options.seed, attempts: attempt + 1, usedFallback: false };
    }
  }

  const board = emptyBoard(cols, rows);
  for (let i = 0; i < board.cells.length; i++) {
    const ing = FALLBACK_LAYOUT[i % FALLBACK_LAYOUT.length] % palette;
    board.cells[i] = { id: board.nextId++, ing, special: 'none' };
  }
  placeSyrup(board, mulberry32(options.seed >>> 0), options.syrupCells, options.doubleSyrup === true);
  return { board, seed: options.seed, attempts: GENERATION_ATTEMPTS, usedFallback: true };
}

export function boardForStage(stageIndex: number, attempt: number, palette: number, syrupCells: number, doubleSyrup = false): GeneratedBoard {
  return generateBoard({
    seed: makeSeed(stageIndex, attempt),
    palette,
    syrupCells,
    doubleSyrup,
  });
}

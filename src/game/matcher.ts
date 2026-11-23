import { Board, Cell, ClearResult, MatchGroup, Special } from './types';
import { Rng, randInt } from './rng';

export const idxOf = (board: Board, row: number, col: number) => row * board.cols + col;
export const rowOf = (board: Board, i: number) => Math.floor(i / board.cols);
export const colOf = (board: Board, i: number) => i % board.cols;

export function areAdjacent(board: Board, a: number, b: number): boolean {
  const ra = rowOf(board, a);
  const ca = colOf(board, a);
  const rb = rowOf(board, b);
  const cb = colOf(board, b);
  return Math.abs(ra - rb) + Math.abs(ca - cb) === 1;
}

export function cloneBoard(board: Board): Board {
  return {
    cells: board.cells.slice(),
    syrup: board.syrup.slice(),
    cols: board.cols,
    rows: board.rows,
    nextId: board.nextId,
  };
}

export function swapCells(board: Board, a: number, b: number): Board {
  const next = cloneBoard(board);
  const tmp = next.cells[a];
  next.cells[a] = next.cells[b];
  next.cells[b] = tmp;
  return next;
}

/** Every horizontal / vertical run of 3 or more identical ingredients. */
export function findMatches(board: Board): MatchGroup[] {
  const groups: MatchGroup[] = [];

  for (let r = 0; r < board.rows; r++) {
    let run: number[] = [];
    let ing = -1;
    for (let c = 0; c <= board.cols; c++) {
      const cell = c < board.cols ? board.cells[idxOf(board, r, c)] : null;
      if (cell && cell.ing === ing) {
        run.push(idxOf(board, r, c));
      } else {
        if (run.length >= 3) {
          groups.push({ idx: run.slice(), dir: 'h', ing });
        }
        run = cell ? [idxOf(board, r, c)] : [];
        ing = cell ? cell.ing : -1;
      }
    }
  }

  for (let c = 0; c < board.cols; c++) {
    let run: number[] = [];
    let ing = -1;
    for (let r = 0; r <= board.rows; r++) {
      const cell = r < board.rows ? board.cells[idxOf(board, r, c)] : null;
      if (cell && cell.ing === ing) {
        run.push(idxOf(board, r, c));
      } else {
        if (run.length >= 3) {
          groups.push({ idx: run.slice(), dir: 'v', ing });
        }
        run = cell ? [idxOf(board, r, c)] : [];
        ing = cell ? cell.ing : -1;
      }
    }
  }

  return groups;
}

export function hasMatch(board: Board): boolean {
  return findMatches(board).length > 0;
}

/** At least one legal swap exists — a generated layout is never a dead board. */
export function hasValidSwap(board: Board): boolean {
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      const i = idxOf(board, r, c);
      const here = board.cells[i];
      if (here && here.special !== 'none') {
        return true;
      }
      if (c + 1 < board.cols && hasMatch(swapCells(board, i, idxOf(board, r, c + 1)))) {
        return true;
      }
      if (r + 1 < board.rows && hasMatch(swapCells(board, i, idxOf(board, r + 1, c)))) {
        return true;
      }
    }
  }
  return false;
}

/** The first swap that would resolve — used by the HINT helper. */
export function findHint(board: Board): [number, number] | null {
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      const i = idxOf(board, r, c);
      if (c + 1 < board.cols) {
        const j = idxOf(board, r, c + 1);
        if (hasMatch(swapCells(board, i, j))) {
          return [i, j];
        }
      }
      if (r + 1 < board.rows) {
        const j = idxOf(board, r + 1, c);
        if (hasMatch(swapCells(board, i, j))) {
          return [i, j];
        }
      }
    }
  }
  return null;
}

function specialFor(group: MatchGroup): Special | null {
  if (group.idx.length >= 5) {
    return 'rainbow';
  }
  if (group.idx.length === 4) {
    return group.dir === 'h' ? 'swirlH' : 'swirlV';
  }
  return null;
}

function gravityAndRefill(board: Board, rng: Rng, palette: number): Board {
  const next = cloneBoard(board);
  for (let c = 0; c < next.cols; c++) {
    let write = next.rows - 1;
    for (let r = next.rows - 1; r >= 0; r--) {
      const cell = next.cells[idxOf(next, r, c)];
      if (cell) {
        next.cells[idxOf(next, write, c)] = cell;
        if (write !== r) {
          next.cells[idxOf(next, r, c)] = null;
        }
        write--;
      }
    }
    for (let r = write; r >= 0; r--) {
      next.cells[idxOf(next, r, c)] = {
        id: next.nextId++,
        ing: randInt(rng, palette),
        special: 'none',
      };
    }
  }
  return next;
}

/**
 * Removes a set of positions: counts ingredients, melts one syrup layer per pop,
 * promotes 4/5 matches into bonbons, then lets the board fall and refill.
 */
export function clearPositions(
  board: Board,
  positions: number[],
  rng: Rng,
  palette: number,
  promote: MatchGroup[] = [],
): ClearResult {
  const working = cloneBoard(board);
  const cleared = [0, 0, 0, 0, 0];
  let syrupCleared = 0;

  const created = new Map<number, Special>();
  for (const group of promote) {
    const special = specialFor(group);
    if (special) {
      const anchor = group.idx[Math.floor(group.idx.length / 2)];
      created.set(anchor, special);
    }
  }

  const unique: number[] = [];
  const seen = new Set<number>();
  for (const p of positions) {
    if (!seen.has(p) && working.cells[p]) {
      seen.add(p);
      unique.push(p);
    }
  }

  for (const p of unique) {
    const cell = working.cells[p] as Cell;
    if (cell.ing >= 0 && cell.ing < cleared.length) {
      cleared[cell.ing] += 1;
    }
    if (working.syrup[p] > 0) {
      working.syrup[p] -= 1;
      syrupCleared += 1;
    }
    const promoted = created.get(p);
    if (promoted) {
      working.cells[p] = { id: working.nextId++, ing: cell.ing, special: promoted };
    } else {
      working.cells[p] = null;
    }
  }

  const createdIdx: number[] = [];
  created.forEach((_value, key) => {
    if (seen.has(key)) {
      createdIdx.push(key);
    }
  });

  return {
    board: gravityAndRefill(working, rng, palette),
    cleared,
    syrupCleared,
    popped: unique,
    created: createdIdx,
  };
}

/** One cascade step: resolve every current match at once. */
export function resolveStep(board: Board, rng: Rng, palette: number): ClearResult | null {
  const groups = findMatches(board);
  if (groups.length === 0) {
    return null;
  }
  const positions: number[] = [];
  for (const g of groups) {
    for (const i of g.idx) {
      positions.push(i);
    }
  }
  return clearPositions(board, positions, rng, palette, groups);
}

/** Positions a bonbon takes out when it is set off. */
export function detonationPositions(board: Board, index: number): number[] {
  const cell = board.cells[index];
  if (!cell || cell.special === 'none') {
    return [];
  }
  const out: number[] = [index];
  if (cell.special === 'swirlH') {
    const r = rowOf(board, index);
    for (let c = 0; c < board.cols; c++) {
      out.push(idxOf(board, r, c));
    }
  } else if (cell.special === 'swirlV') {
    const c = colOf(board, index);
    for (let r = 0; r < board.rows; r++) {
      out.push(idxOf(board, r, c));
    }
  } else {
    for (let i = 0; i < board.cells.length; i++) {
      const other = board.cells[i];
      if (other && other.ing === cell.ing) {
        out.push(i);
      }
    }
  }
  return out;
}

/** SUGAR DROP: the whole board slides down one row, a fresh seeded row enters on top. */
export function sugarDrop(board: Board, rng: Rng, palette: number): Board {
  const next = cloneBoard(board);
  for (let c = 0; c < next.cols; c++) {
    for (let r = next.rows - 1; r > 0; r--) {
      next.cells[idxOf(next, r, c)] = next.cells[idxOf(next, r - 1, c)];
    }
    next.cells[idxOf(next, 0, c)] = {
      id: next.nextId++,
      ing: randInt(rng, palette),
      special: 'none',
    };
  }
  return next;
}

export function countSyrup(board: Board): number {
  return board.syrup.reduce((sum, v) => sum + v, 0);
}

export function cellAt(board: Board, index: number): Cell | null {
  const cell = board.cells[index];
  return cell ? cell : null;
}

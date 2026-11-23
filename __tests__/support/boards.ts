import { Board, Cell } from '../../src/game/types';

/** Builds a board from a literal ingredient grid — used by the logic tests. */
export function makeBoard(grid: number[][], syrupGrid?: number[][]): Board {
  const rows = grid.length;
  const cols = grid[0].length;
  let id = 1;
  const cells: (Cell | null)[] = [];
  const syrup: number[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ id: id++, ing: grid[r][c], special: 'none' });
      syrup.push(syrupGrid ? syrupGrid[r][c] : 0);
    }
  }

  return { cells, syrup, cols, rows, nextId: id };
}

/** A 5x5 layout with no match on screen and one known resolving swap. */
export const CALM_GRID: number[][] = [
  [0, 0, 1, 2, 3],
  [2, 3, 0, 1, 2],
  [1, 2, 3, 4, 0],
  [3, 4, 1, 0, 2],
  [4, 0, 2, 3, 1],
];

export const idx = (cols: number, row: number, col: number) => row * cols + col;

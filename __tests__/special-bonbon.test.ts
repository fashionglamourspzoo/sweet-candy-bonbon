import { clearPositions, detonationPositions } from '../src/game/matcher';
import { mulberry32 } from '../src/game/rng';
import { Board, MatchGroup } from '../src/game/types';
import { idx, makeBoard } from './support/boards';

const GRID = [
  [0, 0, 0, 0, 1],
  [2, 3, 4, 1, 2],
  [3, 4, 2, 3, 4],
  [1, 2, 3, 4, 0],
  [4, 0, 1, 2, 3],
];

function withSpecial(board: Board, index: number, special: 'swirlH' | 'swirlV' | 'rainbow'): Board {
  const cells = board.cells.slice();
  const cell = cells[index]!;
  cells[index] = { ...cell, special };
  return { ...board, cells };
}

describe('special bonbons', () => {
  it('promotes a line of four into a swirl bonbon', () => {
    const board = makeBoard(GRID);
    const group: MatchGroup = { idx: [0, 1, 2, 3], dir: 'h', ing: 0 };
    const result = clearPositions(board, group.idx, mulberry32(21), 5, [group]);
    expect(result.created).toHaveLength(1);
    const anchor = result.created[0];
    expect(result.board.cells.some(c => c && c.special === 'swirlH')).toBe(true);
    expect(anchor).toBeGreaterThanOrEqual(0);
  });

  it('promotes a line of five into a rainbow bonbon', () => {
    const grid = GRID.map(row => row.slice());
    grid[0] = [0, 0, 0, 0, 0];
    const board = makeBoard(grid);
    const group: MatchGroup = { idx: [0, 1, 2, 3, 4], dir: 'h', ing: 0 };
    const result = clearPositions(board, group.idx, mulberry32(22), 5, [group]);
    expect(result.board.cells.some(c => c && c.special === 'rainbow')).toBe(true);
  });

  it('clears a whole row, column or ingredient when it is set off', () => {
    const board = makeBoard(GRID);
    const rowBomb = withSpecial(board, idx(5, 2, 2), 'swirlH');
    expect(new Set(detonationPositions(rowBomb, idx(5, 2, 2))).size).toBe(5);

    const colBomb = withSpecial(board, idx(5, 2, 2), 'swirlV');
    expect(new Set(detonationPositions(colBomb, idx(5, 2, 2))).size).toBe(5);

    const rainbow = withSpecial(board, idx(5, 2, 2), 'rainbow');
    const hit = detonationPositions(rainbow, idx(5, 2, 2));
    hit.forEach(i => expect(rainbow.cells[i]!.ing).toBe(2));
  });

  it('does nothing on a plain candy', () => {
    const board = makeBoard(GRID);
    expect(detonationPositions(board, idx(5, 4, 4))).toHaveLength(0);
  });
});

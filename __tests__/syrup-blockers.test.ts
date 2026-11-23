import { clearPositions, countSyrup } from '../src/game/matcher';
import { mulberry32 } from '../src/game/rng';
import { CALM_GRID, idx, makeBoard } from './support/boards';

describe('clear syrup blockers', () => {
  const syrupGrid = [
    [0, 0, 2, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  it('melts exactly one layer per pop', () => {
    const board = makeBoard(CALM_GRID, syrupGrid);
    expect(countSyrup(board)).toBe(3);

    const first = clearPositions(board, [idx(5, 0, 2)], mulberry32(7), 5);
    expect(first.syrupCleared).toBe(1);
    expect(countSyrup(first.board)).toBe(2);

    const second = clearPositions(first.board, [idx(5, 0, 2)], mulberry32(9), 5);
    expect(second.syrupCleared).toBe(1);
    expect(countSyrup(second.board)).toBe(1);
  });

  it('counts nothing on a cell without syrup', () => {
    const board = makeBoard(CALM_GRID, syrupGrid);
    const result = clearPositions(board, [idx(5, 4, 4)], mulberry32(3), 5);
    expect(result.syrupCleared).toBe(0);
    expect(countSyrup(result.board)).toBe(3);
  });
});

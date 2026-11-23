import { areAdjacent, findMatches, swapCells } from '../src/game/matcher';
import { CALM_GRID, idx, makeBoard } from './support/boards';

describe('swap and combine candy pieces', () => {
  const board = makeBoard(CALM_GRID);

  it('starts with no match already on screen', () => {
    expect(findMatches(board)).toHaveLength(0);
  });

  it('only accepts orthogonal neighbours as a swap target', () => {
    expect(areAdjacent(board, idx(5, 0, 2), idx(5, 1, 2))).toBe(true);
    expect(areAdjacent(board, idx(5, 0, 2), idx(5, 2, 2))).toBe(false);
    expect(areAdjacent(board, idx(5, 0, 0), idx(5, 1, 1))).toBe(false);
  });

  it('resolves a line of three when the swap creates one', () => {
    const swapped = swapCells(board, idx(5, 0, 2), idx(5, 1, 2));
    const matches = findMatches(swapped);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].idx).toHaveLength(3);
    expect(matches[0].ing).toBe(0);
  });

  it('matches nothing when the swap is pointless, so the move is free', () => {
    const swapped = swapCells(board, idx(5, 4, 3), idx(5, 4, 4));
    expect(findMatches(swapped)).toHaveLength(0);
  });
});

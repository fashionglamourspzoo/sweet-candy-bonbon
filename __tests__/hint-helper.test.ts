import { MAX_HINTS } from '../src/constants/config';
import { findHint, hasMatch, hasValidSwap, swapCells } from '../src/game/matcher';
import { progressStore } from '../src/game/progressStore';
import { CALM_GRID, makeBoard } from './support/boards';

describe('setting: hint helper', () => {
  beforeEach(() => {
    progressStore.reset();
  });

  it('is on by default and can be switched off', () => {
    expect(progressStore.load().settings.hintHelper).toBe(true);
    progressStore.saveSettings({ hintHelper: false });
    expect(progressStore.load().settings.hintHelper).toBe(false);
  });

  it('offers a limited number of hints per stage', () => {
    expect(MAX_HINTS).toBe(3);
  });

  it('points at a swap that really resolves', () => {
    const board = makeBoard(CALM_GRID);
    expect(hasValidSwap(board)).toBe(true);
    const hint = findHint(board);
    expect(hint).not.toBeNull();
    expect(hasMatch(swapCells(board, hint![0], hint![1]))).toBe(true);
  });
});

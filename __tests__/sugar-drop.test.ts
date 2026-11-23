import { COST_SUGAR_DROP } from '../src/constants/config';
import { sugarDrop } from '../src/game/matcher';
import { mulberry32 } from '../src/game/rng';
import { evaluateRound } from '../src/game/rules';
import { getStage } from '../src/game/stages';
import { CALM_GRID, idx, makeBoard } from './support/boards';

describe('sugar drop dispenser', () => {
  it('slides the board down and pours a fresh row on top', () => {
    const board = makeBoard(CALM_GRID);
    const before = board.cells.map(c => (c ? c.ing : -1));
    const after = sugarDrop(board, mulberry32(11), 5);

    for (let r = 1; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        expect(after.cells[idx(5, r, c)]!.ing).toBe(before[idx(5, r - 1, c)]);
      }
    }
    expect(after.cells.filter(Boolean)).toHaveLength(board.cells.length);
  });

  it('leaves the syrup where it is, because syrup never falls', () => {
    const syrup = [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    const board = makeBoard(CALM_GRID, syrup);
    const after = sugarDrop(board, mulberry32(5), 5);
    expect(after.syrup).toEqual(board.syrup);
  });

  it('costs two moves, so four presses empty the first stage', () => {
    const stage = getStage(0);
    expect(COST_SUGAR_DROP).toBe(2);
    let moves = stage.moves;
    let presses = 0;
    while (moves >= COST_SUGAR_DROP) {
      moves -= COST_SUGAR_DROP;
      presses += 1;
    }
    expect(presses).toBe(4);
    expect(evaluateRound(stage.objectives, [0, 0, 0, 0, 0], 0, 0, moves, null)).toBe('outOfSugar');
  });
});

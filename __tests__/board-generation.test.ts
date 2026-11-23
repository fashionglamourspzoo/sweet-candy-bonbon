import { COLS, ROWS } from '../src/constants/config';
import { FALLBACK_LAYOUT, generateBoard } from '../src/game/board';
import { countSyrup, findMatches, hasValidSwap } from '../src/game/matcher';
import { makeSeed } from '../src/game/rng';

describe('seeded board generation', () => {
  it('always hands over a layout with no match on screen and a legal swap', () => {
    for (let attempt = 0; attempt < 6; attempt++) {
      const { board } = generateBoard({
        seed: makeSeed(attempt, attempt),
        palette: 5,
        syrupCells: 5,
      });
      expect(board.cells.filter(Boolean)).toHaveLength(COLS * ROWS);
      expect(findMatches(board)).toHaveLength(0);
      expect(hasValidSwap(board)).toBe(true);
      expect(countSyrup(board)).toBeGreaterThanOrEqual(5);
    }
  });

  it('is reproducible from its seed', () => {
    const options = { seed: makeSeed(3, 1), palette: 5, syrupCells: 4 };
    const a = generateBoard(options);
    const b = generateBoard(options);
    expect(a.board.cells.map(c => c!.ing)).toEqual(b.board.cells.map(c => c!.ing));
    expect(a.board.syrup).toEqual(b.board.syrup);
  });

  it('places the same stage differently on a second attempt', () => {
    const first = generateBoard({ seed: makeSeed(3, 0), palette: 5, syrupCells: 4 });
    const second = generateBoard({ seed: makeSeed(3, 1), palette: 5, syrupCells: 4 });
    expect(first.board.cells.map(c => c!.ing)).not.toEqual(second.board.cells.map(c => c!.ing));
  });

  it('keeps a hardcoded layout only as a last-resort guarantee', () => {
    expect(FALLBACK_LAYOUT).toHaveLength(COLS * ROWS);
  });
});
